function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-zinc-200/70 dark:bg-zinc-800 ${className || ''}`} />
}

export default function CustomerDetailLoading() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Skeleton className="h-4 w-40 mb-3" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div>
            <Skeleton className="h-7 w-48 mb-1" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>

      {/* Info Cards */}
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

      {/* Applications */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm ring-1 ring-zinc-950/5 dark:ring-white/10 p-5 lg:p-6">
        <Skeleton className="h-5 w-32 mb-4" />
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
              <div>
                <Skeleton className="h-4 w-36 mb-1.5" />
                <Skeleton className="h-3.5 w-48" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
