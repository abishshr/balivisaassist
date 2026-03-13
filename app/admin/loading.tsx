function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-zinc-200/70 dark:bg-zinc-800 ${className || ''}`} />
}

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-8 w-36" />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm ring-1 ring-zinc-950/5 dark:ring-white/10 p-4 lg:p-5">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Status Breakdown */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm ring-1 ring-zinc-950/5 dark:ring-white/10 p-4 lg:p-5">
        <Skeleton className="h-5 w-40 mb-4" />
        <div className="flex flex-wrap gap-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm ring-1 ring-zinc-950/5 dark:ring-white/10 p-4 lg:p-5">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="space-y-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3">
              <div className="flex-1">
                <Skeleton className="h-4 w-40 mb-2" />
                <Skeleton className="h-3.5 w-56" />
              </div>
              <div className="text-right ml-3">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
