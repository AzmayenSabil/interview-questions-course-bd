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
        'group relative flex flex-col gap-0 rounded-2xl overflow-hidden',
        'glass-card shadow-sm h-full min-h-[148px]',
        'transition-all duration-300 hover:-translate-y-1',
        'hover:shadow-[0_14px_40px_rgba(99,102,241,0.16)] dark:hover:shadow-[0_14px_40px_rgba(129,140,248,0.13)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      )}
    >
      {/* Hover shimmer */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.06] via-violet-500/[0.04] to-cyan-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        aria-hidden="true"
      />

      {/* Completion glow when done */}
      {progress.isComplete && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-emerald-400/[0.08] to-teal-400/[0.05] pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <div className="relative z-10 flex flex-col flex-1 p-4 gap-3">
        {/* Top row: icon + percentage */}
        <div className="flex items-start justify-between gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/60 dark:to-violet-900/50 flex items-center justify-center text-xl shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
            <span aria-hidden="true">{topic.icon}</span>
          </div>
          <span
            className={cn(
              'text-xs font-bold tabular-nums mt-0.5',
              progress.isComplete ? 'text-emerald-600 dark:text-emerald-400' : 'gradient-text',
            )}
          >
            {progress.percentage}%
          </span>
        </div>

        {/* Topic name */}
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
            {topic.name}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1 tabular-nums">
            {progress.completed}/{progress.total} questions
          </p>
        </div>
      </div>

      {/* Progress bar — flush to bottom */}
      <div
        className="relative z-10 h-1 w-full bg-border/50"
        role="progressbar"
        aria-valuenow={progress.percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${topic.name} progress`}
      >
        <div
          className={cn(
            'h-full transition-all duration-700',
            progress.isComplete ? 'gradient-progress-complete' : 'gradient-progress',
          )}
          style={{ width: `${progress.percentage}%` }}
        />
      </div>
    </Link>
  )
}
