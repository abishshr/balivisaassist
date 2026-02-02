export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Configure your admin portal settings
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8">
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Settings page coming soon
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Future features: User management, email templates, notification preferences
          </p>
        </div>
      </div>
    </div>
  )
}
