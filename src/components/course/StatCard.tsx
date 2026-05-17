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
        'group relative flex flex-col items-center justify-center rounded-2xl p-5 overflow-hidden',
        'glass-card shadow-sm',
        'transition-all duration-300 hover:-translate-y-1',
        'hover:shadow-[0_12px_36px_rgba(99,102,241,0.13)] dark:hover:shadow-[0_12px_36px_rgba(129,140,248,0.1)]',
        className,
      )}
    >
      {/* Ambient gradient background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.04] via-violet-500/[0.03] to-cyan-500/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        aria-hidden="true"
      />

      <span className="relative z-10 text-3xl font-extrabold tracking-tight gradient-text tabular-nums">
        {value}
      </span>
      <span className="relative z-10 mt-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
        {label}
      </span>
    </div>
  )
}
