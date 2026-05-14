'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Lock } from 'lucide-react'
import { cn } from '@/utils/cn'
import { ProgressRing } from '@/components/shared/ProgressRing'
import { useCourseUiStore } from '@/features/course/store/courseUiStore'
import { useCourseData } from '@/features/course/hooks/useCourseData'
import { useProgressStore } from '@/features/course/store/progressStore'
import { calcTopicProgress, isTopicUnlocked } from '@/features/course/utils/progress'
import { UNLOCK_THRESHOLD } from '@/features/course/constants/course.constants'
import type { Topic } from '@/features/course/types/course.types'

function SidebarTopicItem({
  topic,
  allTopics,
  completed,
  isActive,
  onNavigate,
}: {
  topic: Topic
  allTopics: Topic[]
  completed: Record<string, boolean>
  isActive: boolean
  onNavigate: () => void
}) {
  const progress = calcTopicProgress(topic, completed)
  const unlocked = isTopicUnlocked(topic, allTopics, completed, UNLOCK_THRESHOLD)

  return (
    <Link
      href={`/topics/${topic.id}`}
      onClick={onNavigate}
      className={cn(
        'flex items-center gap-2.5 px-4 py-2.5 border-l-2 transition-colors group',
        isActive
          ? 'border-indigo-500 bg-background text-indigo-600 dark:text-indigo-400 font-semibold'
          : 'border-transparent hover:bg-background text-foreground',
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className="text-base shrink-0 w-5 text-center">{topic.icon}</span>
      <span className="flex-1 text-sm truncate">{topic.name}</span>
      <div className="flex flex-col items-end gap-0.5 shrink-0">
        <ProgressRing percentage={progress.percentage} size={26} strokeWidth={2} />
        <span className="text-[10px] text-muted-foreground tabular-nums">
          {progress.completed}/{progress.total}
        </span>
      </div>
      {!unlocked && (
        <Lock
          className="h-3 w-3 text-muted-foreground shrink-0"
          aria-label="Recommended to unlock"
        />
      )}
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, closeSidebar } = useCourseUiStore()
  const { data } = useCourseData()
  const completed = useProgressStore((s) => s.completed)

  const topicsWithQuestions = data?.topics.filter((t) => t.questions.length > 0) ?? []
  const totalDone = Object.keys(completed).length
  const totalQuestions = data?.stats.totalQuestions ?? 0

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <nav
        className={cn(
          'fixed top-14 bottom-0 left-0 z-45 w-[270px] bg-muted border-r border-border flex flex-col overflow-hidden transition-transform duration-250 md:sticky md:top-14 md:translate-x-0 md:h-[calc(100vh-3.5rem)] md:shrink-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
        aria-label="Course navigation"
      >
        <div className="px-4 py-3 border-b border-border">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Topics
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {totalDone} / {totalQuestions} questions done
          </p>
        </div>

        <div className="flex-1 overflow-y-auto py-1">
          <Link
            href="/"
            onClick={closeSidebar}
            className={cn(
              'flex items-center gap-2.5 px-4 py-2.5 border-l-2 transition-colors',
              pathname === '/'
                ? 'border-indigo-500 bg-background text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-transparent hover:bg-background text-foreground',
            )}
            aria-current={pathname === '/' ? 'page' : undefined}
          >
            <Home className="h-4 w-4 shrink-0" />
            <span className="text-sm">Home</span>
          </Link>

          {topicsWithQuestions.map((topic) => (
            <SidebarTopicItem
              key={topic.id}
              topic={topic}
              allTopics={topicsWithQuestions}
              completed={completed}
              isActive={pathname === `/topics/${topic.id}`}
              onNavigate={closeSidebar}
            />
          ))}

          {data?.guides && data.guides.length > 0 && (
            <>
              <div className="px-4 pt-4 pb-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Guides
                </p>
              </div>
              {data.guides.map((guide) => (
                <Link
                  key={guide.id}
                  href={`/guides/${guide.id}`}
                  onClick={closeSidebar}
                  className={cn(
                    'flex items-center gap-2.5 px-4 py-2.5 border-l-2 transition-colors',
                    pathname === `/guides/${guide.id}`
                      ? 'border-indigo-500 bg-background text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'border-transparent hover:bg-background text-foreground',
                  )}
                >
                  <BookOpen className="h-4 w-4 shrink-0" />
                  <span className="text-sm">{guide.title}</span>
                </Link>
              ))}
            </>
          )}
        </div>
      </nav>
    </>
  )
}
