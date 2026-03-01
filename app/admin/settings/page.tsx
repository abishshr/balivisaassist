import { Users, Mail, Bell } from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'User Management',
    description: 'Manage admin users, roles, and permissions for your team.',
  },
  {
    icon: Mail,
    title: 'Email Templates',
    description: 'Customize notification emails sent to customers and agents.',
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'Configure alerts for application status changes and deadlines.',
  },
]

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        Settings
      </h1>

      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm ring-1 ring-zinc-950/5 dark:ring-white/10 p-5 lg:p-6">
        <div className="text-center py-8 mb-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-medium mb-3">
            Coming Soon
          </span>
          <p className="text-zinc-600 dark:text-zinc-400">
            Settings page under development
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
            Features being built for the next release
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-5 bg-white dark:bg-zinc-900 rounded-xl ring-1 ring-zinc-950/5 dark:ring-white/10"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3">
                <feature.icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                {feature.title}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
