function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-zinc-200/70 dark:bg-zinc-800 ${className || ''}`} />
}

export default function ApplicationDetailLoading() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Skeleton className="h-4 w-48 mb-3" />
        <div className="flex items-center gap-2.5 flex-wrap">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-16 rounded" />
        </div>
        <Skeleton className="h-4 w-64 mt-2" />
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm ring-1 ring-zinc-950/5 dark:ring-white/10 p-5 lg:p-6">
            <Skeleton className="h-5 w-40 mb-4" />
            <div className="space-y-3">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="flex items-start gap-3">
                  <Skeleton className="h-4 w-24 flex-shrink-0" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Document Sections */}
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm ring-1 ring-zinc-950/5 dark:ring-white/10 p-5 lg:p-6">
          <Skeleton className="h-5 w-48 mb-4" />
          <div className="space-y-2">
            {[...Array(3)].map((_, j) => (
              <Skeleton key={j} className="h-4 w-full max-w-md" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
