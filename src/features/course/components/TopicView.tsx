'use client'

import { AlertTriangle } from 'lucide-react'
import { cn } from '@/utils/cn'
import { QuestionCard } from '@/components/course/QuestionCard'
import { useTopicProgress } from '@/features/course/hooks/useTopicProgress'
import { useTopicUnlock } from '@/features/course/hooks/useTopicUnlock'
import type { CourseData, Topic } from '@/features/course/types/course.types'

interface TopicViewProps {
  topic: Topic
  data: CourseData
}

export function TopicView({ topic, data }: TopicViewProps) {
  const topicsWithQuestions = data.topics.filter((t) => t.questions.length > 0)
  const progress = useTopicProgress(topic)
  const isUnlocked = useTopicUnlock(topic, topicsWithQuestions)

  const prevTopic =
    topicsWithQuestions[topicsWithQuestions.findIndex((t) => t.id === topic.id) - 1] ?? null

  const easyCt = topic.questions.filter((q) => q.difficulty === 'easy').length
  const mediumCt = topic.questions.filter((q) => q.difficulty === 'medium').length
  const hardCt = topic.questions.filter((q) => q.difficulty === 'hard').length

  return (
    <div className="space-y-6">
      {/* ── Topic header card ── */}
      <header className="relative overflow-hidden rounded-2xl px-6 py-5 glass-card shadow-sm">
        {/* Ambient gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-violet-500/[0.04] to-transparent pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-indigo-400/10 dark:bg-indigo-500/8 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10">
          {/* Title row */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/50 dark:to-violet-900/40 flex items-center justify-center text-2xl shrink-0 shadow-sm">
              <span aria-hidden="true">{topic.icon}</span>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground leading-tight">
                {topic.name}
              </h1>
              {topic.description && (
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {topic.description}
                </p>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div
            className="h-2 w-full rounded-full bg-border/60 overflow-hidden mb-3"
            role="progressbar"
            aria-valuenow={progress.percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${topic.name} completion progress`}
          >
            <div
              className={cn(
                'h-full rounded-full transition-all duration-700',
                progress.isComplete ? 'gradient-progress-complete' : 'gradient-progress',
              )}
              style={{ width: `${progress.percentage}%` }}
            />
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
            <span className="text-muted-foreground">
              <strong className="text-foreground font-bold tabular-nums">
                {progress.completed}
              </strong>{' '}
              / {progress.total} completed
            </span>
            <span className="font-bold gradient-text tabular-nums">
              {progress.percentage}% done
            </span>
            {easyCt > 0 && (
              <span className="text-muted-foreground">
                <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {easyCt}
                </strong>{' '}
                easy
              </span>
            )}
            {mediumCt > 0 && (
              <span className="text-muted-foreground">
                <strong className="text-amber-600 dark:text-amber-400 font-bold">{mediumCt}</strong>{' '}
                medium
              </span>
            )}
            {hardCt > 0 && (
              <span className="text-muted-foreground">
                <strong className="text-rose-600 dark:text-rose-400 font-bold">{hardCt}</strong>{' '}
                hard
              </span>
            )}
          </div>
        </div>
      </header>

      {/* ── Lock advisory ── */}
      {!isUnlocked && prevTopic && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-300/60 dark:border-amber-700/40 bg-amber-50/80 dark:bg-amber-950/20 backdrop-blur-sm px-4 py-3.5 text-sm text-amber-700 dark:text-amber-400 shadow-sm">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
          <p>
            <strong>Recommended:</strong> Complete at least 50% of <strong>{prevTopic.name}</strong>{' '}
            before this topic. You can still study ahead, but foundational topics help.
          </p>
        </div>
      )}

      {/* ── Question list ── */}
      <div className="space-y-2.5">
        {topic.questions.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center text-muted-foreground glass-card rounded-2xl">
            <span className="text-5xl mb-3 animate-float" aria-hidden="true">
              📭
            </span>
            <p className="text-sm font-medium">No questions in this topic yet.</p>
          </div>
        ) : (
          topic.questions.map((question, i) => (
            <div
              key={question.id}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <QuestionCard question={question} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
