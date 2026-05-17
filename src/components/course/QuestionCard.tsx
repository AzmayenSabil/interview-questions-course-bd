'use client'

import { useState } from 'react'
import { ChevronDown, ExternalLink, Check } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Badge } from '@/components/ui/badge'
import { DifficultyBadge } from '@/components/shared/DifficultyBadge'
import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer'
import { useProgressStore } from '@/features/course/store/progressStore'
import { useAuth } from '@/contexts/AuthContext'
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
  const { isCompleted, toggleQuestion: localToggle } = useProgressStore()
  const { user, openAuthModal } = useAuth()
  const done = isCompleted(question.id)

  const title = question.title || extractTitle(question.content)

  async function syncToggle(id: string) {
    localToggle(id)
    try {
      const res = await fetch('/api/progress/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: id }),
      })
      if (!res.ok) {
        localToggle(id) // revert optimistic update
      }
    } catch {
      localToggle(id) // revert on network error
    }
  }

  function handleToggleDone(e: React.MouseEvent) {
    e.stopPropagation()
    if (!user) {
      openAuthModal(() => syncToggle(question.id))
      return
    }
    void syncToggle(question.id)
  }

  return (
    <article
      className={cn(
        'rounded-2xl overflow-hidden transition-all duration-300 shadow-sm',
        'glass-card',
        done
          ? 'border border-emerald-300/60 dark:border-emerald-700/40 shadow-[0_4px_16px_rgba(16,185,129,0.08)]'
          : 'hover:shadow-[0_6px_24px_rgba(99,102,241,0.1)] dark:hover:shadow-[0_6px_24px_rgba(129,140,248,0.08)]',
      )}
      data-question-id={question.id}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-start gap-3 px-4 py-3.5 cursor-pointer select-none transition-colors duration-200',
          done
            ? 'bg-gradient-to-r from-emerald-50/80 to-teal-50/40 dark:from-emerald-950/20 dark:to-teal-950/10'
            : 'hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20',
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
            'flex-shrink-0 mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all duration-200',
            done
              ? 'bg-gradient-to-br from-emerald-400 to-green-500 border-emerald-400 shadow-[0_2px_8px_rgba(16,185,129,0.35)]'
              : 'border-border/60 hover:border-indigo-400 hover:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]',
          )}
          aria-label={done ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {done && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
        </button>

        {/* Title & tags */}
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              'text-sm font-medium leading-snug transition-colors',
              done
                ? 'text-emerald-700 dark:text-emerald-400 line-through opacity-60'
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
                className="inline-flex items-center gap-1 rounded-full bg-muted/80 border border-border/70 px-2 py-0.5 text-[11px] font-medium text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                Solve
              </a>
            )}
          </div>
        </div>

        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground shrink-0 mt-0.5 transition-transform duration-300',
            expanded && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </div>

      {/* Body */}
      {expanded && (
        <div
          id={`q-body-${question.id}`}
          className="border-t border-border/60 px-4 pb-5 pt-4 bg-gradient-to-b from-muted/20 to-transparent animate-scale-in"
        >
          <MarkdownRenderer content={question.content} />
        </div>
      )}
    </article>
  )
}
