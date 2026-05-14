import { cn } from '@/utils/cn'

interface StatCardProps {
  value: string | number
  label: string
  className?: string
}

export function StatCard({ value, label, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-border bg-card p-4 shadow-sm',
        className,
      )}
    >
      <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
        {value}
      </span>
      <span className="mt-1 text-xs text-muted-foreground">{label}</span>
    </div>
  )
}
