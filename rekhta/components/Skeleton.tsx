export default function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-slate-200 animate-pulse rounded-lg ${className}`}
      style={{
        backgroundImage: `linear-gradient(
          90deg,
          rgb(226, 232, 240) 0%,
          rgb(203, 213, 225) 50%,
          rgb(226, 232, 240) 100%
        )`,
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite'
      }}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Word of the Day Skeleton */}
      <div className="rounded-3xl overflow-hidden shadow-xl">
        <Skeleton className="h-48 w-full" />
      </div>

      {/* Proverb Skeleton */}
      <div className="rounded-2xl overflow-hidden shadow-sm">
        <Skeleton className="h-32 w-full" />
      </div>

      {/* Trending Words Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    </div>
  );
}

export function WordListSkeleton() {
  return (
    <div className="space-y-3 animate-in fade-in">
      <Skeleton className="h-4 w-32" />
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-20 w-full rounded-2xl" />
      ))}
    </div>
  );
}
