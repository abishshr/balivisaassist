function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-zinc-200/70 dark:bg-zinc-800 ${className || ''}`} />
}

export default function CustomersLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-5 w-8 rounded-md" />
        </div>
        <Skeleton className="h-9 w-20 rounded-lg" />
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 rounded-xl shadow-sm ring-1 ring-zinc-950/5 dark:ring-white/10">
            <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-4 w-36 mb-1.5" />
              <Skeleton className="h-3 w-44" />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white dark:bg-zinc-900 rounded-xl shadow-sm ring-1 ring-zinc-950/5 dark:ring-white/10 overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 flex gap-4">
          {['w-32', 'w-36', 'w-24', 'w-28', 'w-20'].map((w, i) => (
            <Skeleton key={i} className={`h-3.5 ${w}`} />
          ))}
        </div>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-4">
            <div className="flex items-center gap-3 w-32">
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}
