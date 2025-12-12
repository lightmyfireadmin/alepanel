export function OperationsSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 animate-pulse"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--background-tertiary)]" />
              <div className="w-16 h-4 rounded bg-[var(--background-tertiary)]" />
            </div>
            <div className="w-10 h-10 rounded-lg bg-[var(--background-tertiary)]" />
          </div>
          
          {/* Title */}
          <div className="h-5 w-3/4 rounded bg-[var(--background-tertiary)] mb-2" />
          <div className="h-4 w-1/2 rounded bg-[var(--background-tertiary)] mb-4" />
          
          {/* Tags */}
          <div className="flex gap-2">
            <div className="h-6 w-20 rounded-full bg-[var(--background-tertiary)]" />
            <div className="h-6 w-24 rounded-full bg-[var(--background-tertiary)]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TeamSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] rounded-xl bg-[var(--background-tertiary)] mb-3" />
          <div className="h-5 w-3/4 rounded bg-[var(--background-tertiary)] mb-2" />
          <div className="h-4 w-1/2 rounded bg-[var(--background-tertiary)]" />
        </div>
      ))}
    </div>
  );
}

export function NewsSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden animate-pulse"
        >
          <div className="aspect-video bg-[var(--background-tertiary)]" />
          <div className="p-6">
            <div className="h-6 w-20 rounded-full bg-[var(--background-tertiary)] mb-3" />
            <div className="h-5 w-full rounded bg-[var(--background-tertiary)] mb-2" />
            <div className="h-5 w-3/4 rounded bg-[var(--background-tertiary)] mb-4" />
            <div className="h-4 w-full rounded bg-[var(--background-tertiary)]" />
            <div className="h-4 w-2/3 rounded bg-[var(--background-tertiary)] mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}
