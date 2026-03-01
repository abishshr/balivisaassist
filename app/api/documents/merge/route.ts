import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PDFDocument } from 'pdf-lib'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { applicationId } = body

    if (!applicationId) {
      return NextResponse.json(
        { error: 'applicationId is required' },
        { status: 400 }
      )
    }

    // Fetch all bank statement PDFs for this application
    const { data: rawDocuments, error: fetchError } = await supabase
      .from('documents')
      .select('*')
      .eq('application_id', applicationId)
      .eq('type', 'bank_statement')
      .eq('mime_type', 'application/pdf')
      .order('created_at', { ascending: true })

    if (fetchError) {
      console.error('Error fetching documents:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch documents' },
        { status: 500 }
      )
    }

    const documents = rawDocuments as unknown as { file_path: string; file_name: string }[]

    if (!documents || documents.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 bank statement PDFs are required to merge' },
        { status: 400 }
      )
    }

    // Create a new PDF document
    const mergedPdf = await PDFDocument.create()

    // Download and merge each PDF
    for (const doc of documents) {
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('documents')
        .download(doc.file_path)

      if (downloadError || !fileData) {
        console.error(`Error downloading ${doc.file_name}:`, downloadError)
        return NextResponse.json(
          { error: `Failed to download ${doc.file_name}` },
          { status: 500 }
        )
      }

      const pdfBytes = await fileData.arrayBuffer()
      const sourcePdf = await PDFDocument.load(pdfBytes)
      const pageIndices = sourcePdf.getPageIndices()
      const copiedPages = await mergedPdf.copyPages(sourcePdf, pageIndices)

      for (const page of copiedPages) {
        mergedPdf.addPage(page)
      }
    }

    const mergedPdfBytes = await mergedPdf.save()

    return new NextResponse(Buffer.from(mergedPdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Bank_Statements_Combined.pdf"',
      },
    })
  } catch (error) {
    console.error('Error merging PDFs:', error)
    return NextResponse.json(
      { error: 'Failed to merge PDFs' },
      { status: 500 }
    )
  }
}
