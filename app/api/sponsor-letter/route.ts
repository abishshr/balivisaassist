import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createClient } from '@/lib/supabase/server'
import { COMPANY } from '@/constants/company'
import {
  SponsorLetterDocument,
  type SponsorLetterData,
  type CompanyInfo,
} from '@/lib/pdf/sponsor-letter-template'
import React from 'react'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const {
      applicantName,
      nationality,
      passportNumber,
      dateOfBirth,
      visaType,
      purposes,
      letterNumber,
    } = body as {
      applicantName: string
      nationality: string
      passportNumber: string
      dateOfBirth: string
      visaType: string
      purposes: string[]
      letterNumber: string
    }

    if (!applicantName || !nationality || !passportNumber || !visaType) {
      return NextResponse.json(
        { error: 'applicantName, nationality, passportNumber, and visaType are required' },
        { status: 400 }
      )
    }

    // Format date as DD/MM/YYYY
    const now = new Date()
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`

    // Generate reference number if not provided
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const autoNumber =
      letterNumber || `RIL/${year}/${month}/${String(Date.now()).slice(-3)}`

    const letterData: SponsorLetterData = {
      letterNumber: autoNumber,
      date: formattedDate,
      applicantName,
      nationality,
      passportNumber,
      dateOfBirth: dateOfBirth || '',
      visaType,
      purposes: purposes && purposes.length > 0 ? purposes : ['Business exploration activities'],
    }

    const companyInfo: CompanyInfo = {
      legalName: COMPANY.legalName,
      nib: COMPANY.nib,
      npwp: COMPANY.npwp,
      address: COMPANY.office.address,
      director: {
        name: COMPANY.director.name,
        title: COMPANY.director.title,
        phone: COMPANY.director.phone,
        email: COMPANY.director.email,
      },
    }

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      React.createElement(SponsorLetterDocument, {
        data: letterData,
        company: companyInfo,
      }) as any
    )

    // Return PDF as downloadable file
    const safeFileName = applicantName.replace(/[^a-zA-Z0-9]/g, '_')
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Recommendation_Letter_${safeFileName}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating recommendation letter:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendation letter' },
      { status: 500 }
    )
  }
}
