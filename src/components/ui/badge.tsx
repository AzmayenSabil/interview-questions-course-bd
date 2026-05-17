import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
        easy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
        medium: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
        hard: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400',
        outline: 'border border-border bg-transparent text-muted-foreground',
        company: 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
