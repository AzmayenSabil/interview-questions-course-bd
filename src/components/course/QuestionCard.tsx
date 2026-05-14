'use client'

import { useState } from 'react'
import { ChevronDown, ExternalLink, Check } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Badge } from '@/components/ui/badge'
import { DifficultyBadge } from '@/components/shared/DifficultyBadge'
import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer'
import { useProgressStore } from '@/features/course/store/progressStore'
import type { Question } from '@/features/course/types/course.types'

interface QuestionCardProps {
  question: Question
  initialExpanded?: boolean
}

function extractTitle(content: string): string {
  const firstLine = content.split('\n').find((l) => l.trim().length > 5) ?? content.slice(0, 120)
  return firstLine
    .replace(/[*#`\[\]]/g, '')
    .replace(/\(.+?\)/g, '')
    .trim()
    .slice(0, 140)
}

export function QuestionCard({ question, initialExpanded = false }: QuestionCardProps) {
  const [expanded, setExpanded] = useState(initialExpanded)
  const { isCompleted, toggleQuestion } = useProgressStore()
  const done = isCompleted(question.id)

  const title = extractTitle(question.content)

  function handleToggleDone(e: React.MouseEvent) {
    e.stopPropagation()
    toggleQuestion(question.id)
  }

  return (
    <article
      className={cn(
        'rounded-xl border bg-card shadow-sm overflow-hidden transition-colors',
        done ? 'border-green-400 dark:border-green-700' : 'border-border hover:border-indigo-400',
      )}
      data-question-id={question.id}
    >
      {/* Header row */}
      <div
        className={cn(
          'flex items-start gap-3 px-4 py-3.5 cursor-pointer select-none',
          done && 'bg-green-50 dark:bg-green-900/20',
        )}
        onClick={() => setExpanded((v) => !v)}
        onKeyDown={(e) => e.key === 'Enter' && setExpanded((v) => !v)}
        tabIndex={0}
        role="button"
        aria-expanded={expanded}
        aria-controls={`q-body-${question.id}`}
      >
        {/* Completion toggle */}
        <button
          onClick={handleToggleDone}
          className={cn(
            'flex-shrink-0 mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors',
            done
              ? 'bg-green-500 border-green-500'
              : 'border-muted-foreground/40 hover:border-indigo-500',
          )}
          aria-label={done ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {done && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
        </button>

        {/* Title & tags */}
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              'text-sm font-medium leading-snug',
              done
                ? 'text-green-700 dark:text-green-400 line-through opacity-70'
                : 'text-foreground',
            )}
          >
            {title}
            {title.length >= 140 ? '…' : ''}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2" aria-label="Tags">
            <Badge variant="company">{question.company}</Badge>
            <DifficultyBadge difficulty={question.difficulty} />
            {question.ojUrl && (
              <a
                href={question.ojUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 rounded-full bg-muted border border-border px-2 py-0.5 text-xs text-muted-foreground hover:text-indigo-600 hover:border-indigo-400 transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                Solve
              </a>
            )}
          </div>
        </div>

        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground shrink-0 mt-0.5 transition-transform duration-200',
            expanded && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </div>

      {/* Body */}
      {expanded && (
        <div id={`q-body-${question.id}`} className="border-t border-border px-4 pb-4 pt-3">
          <MarkdownRenderer content={question.content} />
        </div>
      )}
    </article>
  )
}
