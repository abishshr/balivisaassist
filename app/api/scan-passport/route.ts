import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Tesseract from 'tesseract.js'
import * as mrz from 'mrz'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// Convert MRZ date (YYMMDD) to YYYY-MM-DD
function mrzDateToISO(dateStr: string, isBirth: boolean): string {
  if (!dateStr || dateStr.length !== 6) return ''
  const yy = parseInt(dateStr.substring(0, 2), 10)
  const mm = dateStr.substring(2, 4)
  const dd = dateStr.substring(4, 6)
  // For birth dates, assume 1900s if yy > current 2-digit year, else 2000s
  // For expiry dates, almost always 20xx
  const currentYY = new Date().getFullYear() % 100
  let yyyy: number
  if (isBirth) {
    yyyy = yy > currentYY ? 1900 + yy : 2000 + yy
  } else {
    yyyy = 2000 + yy
  }
  return `${yyyy}-${mm}-${dd}`
}

// Capitalize properly: "JOHN DOE" -> "John Doe"
function titleCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

// Fix common OCR misreads in MRZ lines
function fixMRZOcr(line: string): string {
  // In the second MRZ line, letters in numeric positions are common OCR errors
  // B→8, O→0, I→1, S→5, Z→2, G→6, D→0 are typical
  return line
    .replace(/B(?=\d)/g, '8')
    .replace(/(?<=\d)B/g, '8')
    .replace(/O(?=\d)/g, '0')
    .replace(/(?<=\d)O/g, '0')
    .replace(/I(?=\d)/g, '1')
    .replace(/(?<=\d)I/g, '1')
}

// Try to find and extract MRZ lines from OCR text
function extractMRZLines(text: string): string[] | null {
  const lines = text.split('\n').map((l) => l.trim().replace(/\s/g, ''))

  // Clean each line: keep only MRZ-valid characters
  const cleaned: string[] = []
  for (const line of lines) {
    const c = line.replace(/[^A-Z0-9<]/gi, '').toUpperCase()
    if (c.length >= 20) {
      cleaned.push(c)
    }
  }

  // Strategy 1: Find a line starting with P< (first MRZ line)
  // The first line may be short because trailing < chars get lost in OCR
  for (let i = 0; i < cleaned.length; i++) {
    if (cleaned[i].startsWith('P<') || cleaned[i].startsWith('P0')) {
      const line1 = cleaned[i].substring(0, 44).padEnd(44, '<')

      // The next line with 40+ chars is likely the second MRZ line
      for (let j = i + 1; j < cleaned.length; j++) {
        if (cleaned[j].length >= 40) {
          const line2 = fixMRZOcr(cleaned[j].substring(0, 44).padEnd(44, '<'))
          return [line1, line2]
        }
      }
    }
  }

  // Strategy 2: Look for any 44-char line that looks like MRZ line 2
  // (starts with digits, contains country code pattern)
  for (let i = 0; i < cleaned.length; i++) {
    if (cleaned[i].length >= 40 && /^\d{9}/.test(cleaned[i])) {
      // Found line 2, check if previous line could be line 1
      for (let j = i - 1; j >= 0; j--) {
        if (cleaned[j].startsWith('P') && cleaned[j].length >= 20) {
          const line1 = cleaned[j].substring(0, 44).padEnd(44, '<')
          const line2 = fixMRZOcr(cleaned[i].substring(0, 44).padEnd(44, '<'))
          return [line1, line2]
        }
      }
    }
  }

  return null
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a JPG, PNG, or WebP image.' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File is too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Save passport scan to Supabase Storage
    const ext = file.name.split('.').pop() || 'jpg'
    const storagePath = `passport-scans/${Date.now()}-${crypto.randomUUID()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Passport scan upload error:', uploadError)
      // Continue with OCR even if upload fails — don't block the scan
    }

    // Run OCR with Tesseract.js
    const { data } = await Tesseract.recognize(buffer, 'eng', {
      logger: () => {},
    })

    const ocrText = data.text

    // Try to extract MRZ lines
    const mrzLines = extractMRZLines(ocrText)
    if (!mrzLines) {
      return NextResponse.json(
        { error: 'Could not find the machine-readable zone (MRZ) on this passport. Please ensure the full passport page is visible in the image.' },
        { status: 422 }
      )
    }

    // Parse MRZ
    const parsed = mrz.parse(mrzLines)
    const fields = parsed.fields

    const result = {
      first_name: fields.firstName ? titleCase(fields.firstName) : '',
      last_name: fields.lastName ? titleCase(fields.lastName) : '',
      nationality: fields.nationality || '',
      passport_number: fields.documentNumber || '',
      date_of_birth: fields.birthDate ? mrzDateToISO(fields.birthDate, true) : '',
      passport_expiry: fields.expirationDate ? mrzDateToISO(fields.expirationDate, false) : '',
      gender: fields.sex === 'female' ? 'F' : fields.sex === 'male' ? 'M' : '',
      passport_scan_path: uploadError ? null : storagePath,
    }

    return NextResponse.json({ data: result })
  } catch (error: any) {
    console.error('Passport scan error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to scan passport' },
      { status: 500 }
    )
  }
}
