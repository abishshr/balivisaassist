import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get total applications
    const { count: totalApplications } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })

    // Get applications by status
    const { data: statusCounts } = await supabase
      .from('applications')
      .select('status')

    // Count by status
    const statusBreakdown = statusCounts?.reduce((acc, app: any) => {
      acc[app.status] = (acc[app.status] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    // Get this month's applications
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { count: thisMonthApplications } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString())

    // Get this month's revenue
    const { data: thisMonthPayments } = await supabase
      .from('payments')
      .select('amount')
      .eq('payment_status', 'verified')
      .gte('created_at', startOfMonth.toISOString())

    const thisMonthRevenue = thisMonthPayments?.reduce(
      (sum, payment: any) => sum + Number(payment.amount),
      0
    ) || 0

    // Get recent applications with customer info
    const { data: recentApplications } = await supabase
      .from('applications')
      .select(`
        *,
        customer:customers (
          id,
          first_name,
          last_name,
          email,
          whatsapp_number,
          nationality
        )
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    return NextResponse.json({
      totalApplications: totalApplications || 0,
      statusBreakdown,
      thisMonthApplications: thisMonthApplications || 0,
      thisMonthRevenue,
      recentApplications: recentApplications || [],
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
