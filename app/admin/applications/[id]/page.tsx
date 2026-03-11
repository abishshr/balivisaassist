import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Globe } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { DocumentUpload } from '@/components/admin/DocumentUpload'
import { SponsorLetterForm } from '@/components/admin/SponsorLetterForm'
import { AgreementForm } from '@/components/admin/AgreementForm'
import { DocumentChecklistButton } from '@/components/admin/DocumentChecklistButton'
import { ImmigrationApply } from '@/components/admin/ImmigrationApply'
import { getServiceBySlug } from '@/data/services'
import { formatPrice, formatDate } from '@/lib/utils'
import type { Application, ApplicationPriority, Document } from '@/types/application'
import type { Customer } from '@/types/customer'

interface ApplicationWithFullCustomer extends Application {
  customer: Customer
}

const priorityStyles: Record<ApplicationPriority, string> = {
  low: 'bg-zinc-500/10 text-zinc-700 dark:text-zinc-300',
  normal: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  high: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
  urgent: 'bg-red-500/10 text-red-700 dark:text-red-400',
}

export default async function ApplicationDetailPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const supabase = await createClient()

  // Fetch application with customer
  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      customer:customers (*)
    `)
    .eq('id', id)
    .single()

  if (error || !data) {
    notFound()
  }

  const application = data as unknown as ApplicationWithFullCustomer
  const customer = application.customer

  // Fetch documents
  const { data: documentsData } = await supabase
    .from('documents')
    .select('*')
    .eq('application_id', id)
    .order('created_at', { ascending: false })

  const documents = (documentsData || []) as unknown as Document[]

  // Generate signed URLs for all documents
  const documentUrls: Record<string, string> = {}
  for (const doc of documents) {
    const { data: signedUrlData } = await supabase.storage
      .from('documents')
      .createSignedUrl(doc.file_path, 3600)
    if (signedUrlData?.signedUrl) {
      documentUrls[doc.id] = signedUrlData.signedUrl
    }
  }

  // Get passport scan signed URL if available
  let passportScanUrl: string | null = null
  if (customer.passport_scan_path) {
    const { data: signedUrlData } = await supabase.storage
      .from('documents')
      .createSignedUrl(customer.passport_scan_path, 3600)
    passportScanUrl = signedUrlData?.signedUrl || null
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 mb-3 text-sm text-zinc-500 dark:text-zinc-400">
            <Link
              href="/admin/applications"
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Applications
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-zinc-900 dark:text-zinc-100 font-mono">
              {application.application_number}
            </span>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-semibold tracking-tight font-mono text-zinc-900 dark:text-zinc-100">
              {application.application_number}
            </h1>
            <StatusBadge status={application.status} />
            <span
              className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${priorityStyles[application.priority]}`}
            >
              {application.priority}
            </span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            {application.service_name} &middot; Created{' '}
            {formatDate(application.created_at)}
          </p>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Customer Info */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm ring-1 ring-zinc-950/5 dark:ring-white/10 p-5 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Customer Information
            </h2>
            <Link
              href={`/admin/customers/${customer.id}`}
              className="text-xs text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium"
            >
              View Profile
            </Link>
          </div>
          <div className="space-y-2.5">
            <InfoRow
              label="Full Name"
              value={`${customer.first_name} ${customer.last_name}`}
            />
            <InfoRow label="Nationality" value={customer.nationality} />
            <InfoRow
              label="Passport"
              value={customer.passport_number || 'Not provided'}
            />
            {customer.passport_expiry && (
              <InfoRow
                label="Passport Expiry"
                value={formatDate(customer.passport_expiry)}
              />
            )}
            <InfoRow
              label="Email"
              value={customer.email || 'Not provided'}
            />
            <InfoRow label="WhatsApp" value={customer.whatsapp_number} />
            {customer.date_of_birth && (
              <InfoRow
                label="Date of Birth"
                value={formatDate(customer.date_of_birth)}
              />
            )}
            {customer.place_of_birth && (
              <InfoRow label="Place of Birth" value={customer.place_of_birth} />
            )}
            {customer.phone_number && (
              <InfoRow label="Phone" value={customer.phone_number} />
            )}
            {(customer.indonesia_address || customer.indonesia_city || customer.indonesia_province) && (
              <InfoRow
                label="Indonesia Addr."
                value={[customer.indonesia_address, customer.indonesia_city, customer.indonesia_province, customer.indonesia_postal_code].filter(Boolean).join(', ')}
              />
            )}
          </div>
        </div>

        {/* Service Info */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm ring-1 ring-zinc-950/5 dark:ring-white/10 p-5 lg:p-6">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Service Details
          </h2>
          <div className="space-y-2.5">
            <InfoRow label="Service" value={application.service_name} />
            <InfoRow
              label="Quoted Price"
              value={formatPrice(application.quoted_price)}
            />
            <InfoRow label="Status" value={application.status.replace(/_/g, ' ')} />
            <InfoRow label="Priority" value={application.priority} />
            {application.desired_start_date && (
              <InfoRow
                label="Desired Start"
                value={formatDate(application.desired_start_date)}
              />
            )}
            <InfoRow
              label="Created"
              value={formatDate(application.created_at, 'long')}
            />
            {application.completed_at && (
              <InfoRow
                label="Completed"
                value={formatDate(application.completed_at, 'long')}
              />
            )}
          </div>
        </div>
      </div>

      {/* Service Agreement Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm ring-1 ring-zinc-950/5 dark:ring-white/10 p-5 lg:p-6">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Service Agreement
        </h2>
        <AgreementForm
          customerName={`${customer.first_name} ${customer.last_name}`}
          nationality={customer.nationality}
          passportNumber={customer.passport_number || ''}
          whatsappNumber={customer.whatsapp_number}
          email={customer.email || ''}
          serviceName={application.service_name}
          serviceDescription={getServiceBySlug(application.service_id)?.shortDescription || application.service_name}
          quotedPrice={application.quoted_price}
        />
      </div>

      {/* Document Checklist Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm ring-1 ring-zinc-950/5 dark:ring-white/10 p-5 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Document Checklist
          </h2>
          <DocumentChecklistButton
            serviceId={application.service_id}
            serviceName={application.service_name}
            customerName={`${customer.first_name} ${customer.last_name}`}
            whatsappNumber={customer.whatsapp_number}
          />
        </div>
        {(() => {
          const service = getServiceBySlug(application.service_id)
          const requirements = service?.requirements || []
          return requirements.length > 0 ? (
            <ul className="space-y-2">
              {requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="text-zinc-400 dark:text-zinc-500 mt-0.5 flex-shrink-0">&#9744;</span>
                  {req}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-500">No requirements found for this service.</p>
          )
        })()}
      </div>

      {/* Documents Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm ring-1 ring-zinc-950/5 dark:ring-white/10 p-5 lg:p-6">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Documents
        </h2>
        <DocumentUpload
          applicationId={id}
          serviceId={application.service_id}
          initialDocuments={documents}
          passportScanUrl={passportScanUrl}
          documentUrls={documentUrls}
        />
      </div>

      {/* Sponsor Letter Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm ring-1 ring-zinc-950/5 dark:ring-white/10 p-5 lg:p-6">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Recommendation & Invitation Letter
        </h2>
        <SponsorLetterForm
          applicantName={`${customer.first_name} ${customer.last_name}`}
          nationality={customer.nationality}
          passportNumber={customer.passport_number || ''}
          visaType={application.service_name}
          dateOfBirth={customer.date_of_birth || ''}
        />
      </div>

      {/* Immigration Portal Automation */}
      {application.service_id.startsWith('d12-') && ['documents_received', 'under_review'].includes(application.status) && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm ring-1 ring-zinc-950/5 dark:ring-white/10 p-5 lg:p-6">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4 text-blue-500" />
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Apply to Immigration
            </h2>
          </div>
          <ImmigrationApply
            applicationId={id}
            applicationNumber={application.application_number}
          />
        </div>
      )}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-sm text-zinc-500 dark:text-zinc-400 w-28 flex-shrink-0">
        {label}
      </span>
      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {value}
      </span>
    </div>
  )
}
