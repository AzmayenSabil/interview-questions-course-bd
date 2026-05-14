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
        'group flex flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-sm',
        'transition-all hover:border-indigo-400 hover:-translate-y-0.5 hover:shadow-md',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
      )}
    >
      <span className="text-2xl" aria-hidden="true">
        {topic.icon}
      </span>
      <p className="text-sm font-semibold text-foreground leading-tight">{topic.name}</p>
      <p className="text-xs text-muted-foreground">
        {progress.completed}/{progress.total} done
      </p>
      <div
        className="h-1.5 w-full rounded-full bg-border overflow-hidden"
        role="progressbar"
        aria-valuenow={progress.percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${topic.name} progress`}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            progress.isComplete ? 'bg-green-500' : 'bg-indigo-500',
          )}
          style={{ width: `${progress.percentage}%` }}
        />
      </div>
    </Link>
  )
}
