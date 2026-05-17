'use client'

import Link from 'next/link'
import { cn } from '@/utils/cn'
import { useTopicProgress } from '@/features/course/hooks/useTopicProgress'
import type { Topic } from '@/features/course/types/course.types'

interface TopicCardProps {
  topic: Topic
}

export function TopicCard({ topic }: TopicCardProps) {
  const progress = useTopicProgress(topic)

  return (
    <Link
      href={`/topics/${topic.id}`}
      className={cn(
        'group relative flex flex-col gap-3 rounded-2xl p-4 overflow-hidden',
        'glass-card shadow-sm',
        'transition-all duration-300 hover:-translate-y-1',
        'hover:shadow-[0_12px_36px_rgba(99,102,241,0.14)] dark:hover:shadow-[0_12px_36px_rgba(129,140,248,0.11)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      )}
    >
      {/* Hover shimmer overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-violet-500/[0.04] to-cyan-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        aria-hidden="true"
      />

      {/* Icon pill */}
      <div className="relative z-10 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/50 dark:to-violet-900/40 flex items-center justify-center text-xl shrink-0 shadow-sm">
        <span aria-hidden="true">{topic.icon}</span>
      </div>

      {/* Text */}
      <div className="relative z-10 flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground leading-snug">{topic.name}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5 tabular-nums">
          {progress.completed}/{progress.total} done
        </p>
      </div>

      {/* Progress bar */}
      <div
        className="relative z-10 h-1 w-full rounded-full bg-border/60 overflow-hidden"
        role="progressbar"
        aria-valuenow={progress.percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${topic.name} progress`}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-700',
            progress.isComplete ? 'gradient-progress-complete' : 'gradient-progress',
          )}
          style={{ width: `${progress.percentage}%` }}
        />
      </div>
    </Link>
  )
}
