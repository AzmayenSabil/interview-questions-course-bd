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
    <div className="space-y-5">
      {/* Topic header */}
      <header>
        <h1 className="text-2xl font-bold flex items-center gap-2.5">
          <span aria-hidden="true">{topic.icon}</span>
          {topic.name}
        </h1>
        {topic.description && (
          <p className="mt-1.5 text-sm text-muted-foreground">{topic.description}</p>
        )}
        <div
          className="mt-3 h-2 rounded-full bg-border overflow-hidden"
          role="progressbar"
          aria-valuenow={progress.percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${topic.name} completion progress`}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              progress.isComplete ? 'bg-green-500' : 'bg-indigo-500',
            )}
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
        <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
          <span>
            <strong className="text-foreground">{progress.completed}</strong> / {progress.total}{' '}
            completed
          </span>
          <span>
            <strong className="text-foreground">{progress.percentage}%</strong> done
          </span>
          {easyCt > 0 && (
            <span>
              <strong className="text-foreground">{easyCt}</strong> easy
            </span>
          )}
          {mediumCt > 0 && (
            <span>
              <strong className="text-foreground">{mediumCt}</strong> medium
            </span>
          )}
          {hardCt > 0 && (
            <span>
              <strong className="text-foreground">{hardCt}</strong> hard
            </span>
          )}
        </div>
      </header>

      {/* Lock advisory banner */}
      {!isUnlocked && prevTopic && (
        <div className="flex items-start gap-3 rounded-lg border border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700 px-4 py-3 text-sm text-yellow-700 dark:text-yellow-400">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
          <p>
            <strong>Recommended:</strong> Complete at least 50% of <strong>{prevTopic.name}</strong>{' '}
            before this topic. You can still study ahead, but foundational topics help.
          </p>
        </div>
      )}

      {/* Question list */}
      <div className="space-y-3">
        {topic.questions.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center text-muted-foreground">
            <span className="text-5xl mb-3" aria-hidden="true">
              📭
            </span>
            <p className="text-sm">No questions in this topic yet.</p>
          </div>
        ) : (
          topic.questions.map((question) => <QuestionCard key={question.id} question={question} />)
        )}
      </div>
    </div>
  )
}
