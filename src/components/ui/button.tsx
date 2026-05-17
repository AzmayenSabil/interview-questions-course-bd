import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const buttonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none',
  {
    variants: {
      variant: {
        default: [
          'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md',
          'hover:from-indigo-500 hover:to-violet-500 hover:shadow-[0_4px_20px_rgba(99,102,241,0.4)]',
          'active:scale-[0.97]',
          'dark:from-indigo-500 dark:to-violet-500 dark:hover:shadow-[0_4px_20px_rgba(129,140,248,0.35)]',
        ],
        ghost: [
          'bg-transparent text-muted-foreground border border-border/70',
          'hover:bg-muted hover:text-foreground hover:border-indigo-300 dark:hover:border-indigo-700',
          'active:scale-[0.97]',
        ],
        subtle: [
          'bg-indigo-50 text-indigo-700 border border-indigo-100',
          'hover:bg-indigo-100 hover:border-indigo-200',
          'dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/60',
          'dark:hover:bg-indigo-900/50 dark:hover:border-indigo-800',
          'active:scale-[0.97]',
        ],
        danger: [
          'bg-rose-50 text-rose-600 border border-rose-100',
          'hover:bg-rose-600 hover:text-white hover:border-rose-600 hover:shadow-[0_4px_14px_rgba(244,63,94,0.3)]',
          'dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50',
          'dark:hover:bg-rose-600 dark:hover:text-white dark:hover:border-rose-600',
          'active:scale-[0.97]',
        ],
        link: 'text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-400 p-0 h-auto',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-7 px-3 py-1 text-xs rounded-lg',
        lg: 'h-11 px-6 text-base rounded-2xl',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
