import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/admin/Sidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If not authenticated, render children without sidebar (login page).
  // The middleware handles redirecting non-login admin pages to /admin/login.
  if (!user) {
    return <>{children}</>
  }

  return (
    <div className="flex h-dvh bg-zinc-50/50 dark:bg-zinc-950 supports-[height:100dvh]:h-dvh h-screen">
      <Sidebar userEmail={user.email} />
      <main className="flex-1 overflow-y-auto overscroll-contain">
        <div className="p-4 pb-24 md:p-6 md:pb-8 lg:p-8">
          <div className="max-w-7xl mx-auto admin-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
