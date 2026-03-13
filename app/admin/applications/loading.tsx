function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-zinc-200/70 dark:bg-zinc-800 ${className || ''}`} />
}

export default function ApplicationsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-5 w-8 rounded-md" />
        </div>
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>

      {/* Search & Filter */}
      <div className="space-y-3">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full sm:w-40 rounded-lg" />
      </div>

      {/* Application Cards */}
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm ring-1 ring-zinc-950/5 dark:ring-white/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-36 mb-2" />
                  <Skeleton className="h-3.5 w-28 mb-1" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16 ml-auto" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
