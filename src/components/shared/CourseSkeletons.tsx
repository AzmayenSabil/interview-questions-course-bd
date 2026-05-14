import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/utils/cn'

export function QuestionCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-start gap-3">
        <Skeleton className="h-5 w-5 rounded-full shrink-0 mt-0.5" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function TopicCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <Skeleton className="h-7 w-7 rounded" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-1.5 w-full rounded-full" />
    </div>
  )
}

export function TopicViewSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      <div className="space-y-2 mb-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-2 w-full rounded-full mt-3" />
      </div>
      {Array.from({ length: count }, (_, i) => (
        <QuestionCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function HomeViewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-3 py-6">
        <Skeleton className="h-9 w-72 mx-auto" />
        <Skeleton className="h-5 w-96 mx-auto" />
      </div>
      <div className={cn('grid gap-4', 'grid-cols-2 sm:grid-cols-4')}>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-2">
            <Skeleton className="h-8 w-16 mx-auto" />
            <Skeleton className="h-3 w-20 mx-auto" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 8 }, (_, i) => (
          <TopicCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
