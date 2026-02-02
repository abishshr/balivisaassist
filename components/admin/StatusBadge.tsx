import type { ApplicationStatus } from '@/types/application'
import { Badge } from '@/components/ui/Badge'

interface StatusBadgeProps {
  status: ApplicationStatus
}

const statusConfig: Record<ApplicationStatus, { label: string; variant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' }> = {
  new: { label: 'New', variant: 'secondary' },
  documents_pending: { label: 'Documents Pending', variant: 'warning' },
  documents_received: { label: 'Documents Received', variant: 'secondary' },
  under_review: { label: 'Under Review', variant: 'default' },
  submitted_to_immigration: { label: 'Submitted', variant: 'default' },
  approved: { label: 'Approved', variant: 'success' },
  completed: { label: 'Completed', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
