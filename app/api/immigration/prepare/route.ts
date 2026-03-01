import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Document } from '@/types/application'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { applicationId } = await request.json()

    if (!applicationId) {
      return NextResponse.json(
        { error: 'applicationId is required' },
        { status: 400 }
      )
    }

    // Fetch application with customer
    const { data: appData, error: appError } = await supabase
      .from('applications')
      .select(`
        *,
        customer:customers (*)
      `)
      .eq('id', applicationId)
      .single()

    if (appError || !appData) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    const application = appData as any
    const customer = application.customer

    // Fetch documents
    const { data: docsData, error: docsError } = await supabase
      .from('documents')
      .select('*')
      .eq('application_id', applicationId)
      .order('created_at', { ascending: false })

    if (docsError) {
      return NextResponse.json(
        { error: 'Failed to fetch documents' },
        { status: 500 }
      )
    }

    // Download each document from storage and convert to base64
    const docs = (docsData || []) as unknown as Document[]
    const documents = []
    for (const doc of docs) {
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('documents')
        .download(doc.file_path)

      if (downloadError || !fileData) {
        console.error(`Failed to download document ${doc.file_name}:`, downloadError)
        continue
      }

      const arrayBuffer = await fileData.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString('base64')

      documents.push({
        type: doc.type,
        file_name: doc.file_name,
        mime_type: doc.mime_type,
        base64,
      })
    }

    // Download passport scan from customer record if available
    let passportScan = null
    if (customer.passport_scan_path) {
      const { data: scanData, error: scanError } = await supabase.storage
        .from('documents')
        .download(customer.passport_scan_path)

      if (scanData && !scanError) {
        const arrayBuffer = await scanData.arrayBuffer()
        const base64 = Buffer.from(arrayBuffer).toString('base64')
        const ext = customer.passport_scan_path.split('.').pop() || 'jpg'
        passportScan = {
          file_name: `passport-scan.${ext}`,
          mime_type: `image/${ext === 'png' ? 'png' : 'jpeg'}`,
          base64,
        }
      }
    }

    return NextResponse.json({
      application: {
        id: application.id,
        application_number: application.application_number,
        service_id: application.service_id,
        service_name: application.service_name,
        status: application.status,
      },
      customer: {
        first_name: customer.first_name,
        last_name: customer.last_name,
        nationality: customer.nationality,
        passport_number: customer.passport_number,
        passport_expiry: customer.passport_expiry,
        date_of_birth: customer.date_of_birth,
        email: customer.email,
        place_of_birth: customer.place_of_birth,
        phone_number: customer.phone_number,
        indonesia_residence_type: customer.indonesia_residence_type,
        indonesia_address: customer.indonesia_address,
        indonesia_postal_code: customer.indonesia_postal_code,
        indonesia_province: customer.indonesia_province,
        indonesia_city: customer.indonesia_city,
      },
      documents,
      passportScan,
    })
  } catch (error) {
    console.error('Error preparing immigration data:', error)
    return NextResponse.json(
      { error: 'Failed to prepare immigration data' },
      { status: 500 }
    )
  }
}
