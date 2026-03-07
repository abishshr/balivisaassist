import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createClient } from '@/lib/supabase/server'
import { COMPANY } from '@/constants/company'
import {
  ServiceAgreementDocument,
  type AgreementData,
  type AgreementCompanyInfo,
} from '@/lib/pdf/service-agreement-template'
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
      customerName,
      nationality,
      passportNumber,
      whatsappNumber,
      email,
      serviceName,
      serviceDescription,
      quotedPrice,
    } = body as {
      customerName: string
      nationality: string
      passportNumber: string
      whatsappNumber: string
      email: string
      serviceName: string
      serviceDescription: string
      quotedPrice: string
    }

    if (!customerName || !passportNumber || !serviceName) {
      return NextResponse.json(
        { error: 'customerName, passportNumber, and serviceName are required' },
        { status: 400 }
      )
    }

    // Format date as DD/MM/YYYY
    const now = new Date()
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`

    // Generate agreement number: SA/{YEAR}/{MONTH}/{sequence}
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const seq = String(Date.now()).slice(-3)
    const agreementNumber = `SA/${year}/${month}/${seq}`

    const agreementData: AgreementData = {
      agreementNumber,
      date: formattedDate,
      customerName,
      nationality: nationality || '',
      passportNumber,
      whatsappNumber: whatsappNumber || '',
      email: email || '',
      serviceName,
      serviceDescription: serviceDescription || '',
      quotedPrice: quotedPrice || '',
    }

    const companyInfo: AgreementCompanyInfo = {
      legalName: COMPANY.legalName,
      nib: COMPANY.nib,
      npwp: COMPANY.npwp,
      address: COMPANY.office.address,
      banking: {
        bankName: COMPANY.banking.bankName,
        accountNumber: COMPANY.banking.accountNumber,
        accountHolder: COMPANY.banking.accountHolder,
      },
      director: {
        name: COMPANY.director.name,
        title: COMPANY.director.title,
        phone: COMPANY.director.phone,
        email: COMPANY.director.email,
      },
    }

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      React.createElement(ServiceAgreementDocument, {
        data: agreementData,
        company: companyInfo,
      }) as any
    )

    // Return PDF as downloadable file
    const safeFileName = customerName.replace(/[^a-zA-Z0-9]/g, '_')
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Service_Agreement_${safeFileName}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating service agreement:', error)
    return NextResponse.json(
      { error: 'Failed to generate service agreement' },
      { status: 500 }
    )
  }
}
