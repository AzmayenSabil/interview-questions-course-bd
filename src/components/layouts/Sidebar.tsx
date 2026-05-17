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
        'group flex items-center gap-2.5 px-3 py-2.5 mx-2 rounded-xl transition-all duration-200',
        isActive
          ? 'bg-gradient-to-r from-indigo-600/[0.12] to-violet-600/[0.08] dark:from-indigo-500/[0.18] dark:to-violet-500/[0.12] text-indigo-700 dark:text-indigo-300 font-semibold shadow-[inset_0_0_0_1px_rgba(99,102,241,0.2)]'
          : 'text-foreground hover:bg-muted/80 hover:text-foreground',
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* Active indicator bar */}
      <div
        className={cn(
          'absolute left-0 w-0.5 h-6 rounded-r-full transition-all duration-200',
          isActive ? 'bg-gradient-to-b from-indigo-500 to-violet-500 opacity-100' : 'opacity-0',
        )}
        aria-hidden="true"
      />

      <span className="text-base shrink-0 w-5 text-center">{topic.icon}</span>
      <span className="flex-1 text-sm truncate">{topic.name}</span>

      <div className="flex flex-col items-end gap-0.5 shrink-0">
        <ProgressRing percentage={progress.percentage} size={24} strokeWidth={2} />
      </div>

      {!unlocked && (
        <Lock
          className="h-3 w-3 text-muted-foreground/60 shrink-0"
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
  const overallPct = totalQuestions > 0 ? Math.round((totalDone / totalQuestions) * 100) : 0

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <nav
        className={cn(
          'fixed top-14 bottom-0 left-0 z-45 w-[268px] flex flex-col overflow-hidden',
          'glass-sidebar border-r border-border/60',
          'transition-transform duration-250 md:sticky md:top-14 md:translate-x-0 md:h-[calc(100vh-3.5rem)] md:shrink-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
        aria-label="Course navigation"
      >
        {/* Progress summary header */}
        <div className="px-5 py-4 border-b border-border/50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Progress
            </p>
            <span className="text-xs font-bold gradient-text tabular-nums">{overallPct}%</span>
          </div>
          <div className="h-1 w-full rounded-full bg-border/60 overflow-hidden">
            <div
              className="h-full gradient-progress rounded-full transition-all duration-700"
              style={{ width: `${overallPct}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground mt-1.5 tabular-nums">
            {totalDone} / {totalQuestions} questions
          </p>
        </div>

        {/* Nav links */}
        <div className="flex-1 overflow-y-auto py-2 relative">
          {/* Home */}
          <Link
            href="/"
            onClick={closeSidebar}
            className={cn(
              'relative flex items-center gap-2.5 px-3 py-2.5 mx-2 rounded-xl transition-all duration-200',
              pathname === '/'
                ? 'bg-gradient-to-r from-indigo-600/[0.12] to-violet-600/[0.08] dark:from-indigo-500/[0.18] dark:to-violet-500/[0.12] text-indigo-700 dark:text-indigo-300 font-semibold shadow-[inset_0_0_0_1px_rgba(99,102,241,0.2)]'
                : 'text-foreground hover:bg-muted/80',
            )}
            aria-current={pathname === '/' ? 'page' : undefined}
          >
            <div
              className={cn(
                'absolute left-0 w-0.5 h-5 rounded-r-full transition-opacity duration-200',
                'bg-gradient-to-b from-indigo-500 to-violet-500',
                pathname === '/' ? 'opacity-100' : 'opacity-0',
              )}
              aria-hidden="true"
            />
            <Home className="h-4 w-4 shrink-0" />
            <span className="text-sm">Home</span>
          </Link>

          {/* Topics section */}
          {topicsWithQuestions.length > 0 && (
            <div className="mt-3">
              <p className="px-5 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                Topics
              </p>
              {topicsWithQuestions.map((topic) => (
                <div key={topic.id} className="relative">
                  <SidebarTopicItem
                    topic={topic}
                    allTopics={topicsWithQuestions}
                    completed={completed}
                    isActive={pathname === `/topics/${topic.id}`}
                    onNavigate={closeSidebar}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Guides section */}
          {data?.guides && data.guides.length > 0 && (
            <div className="mt-4">
              <p className="px-5 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                Guides
              </p>
              {data.guides.map((guide) => (
                <Link
                  key={guide.id}
                  href={`/guides/${guide.id}`}
                  onClick={closeSidebar}
                  className={cn(
                    'relative flex items-center gap-2.5 px-3 py-2.5 mx-2 rounded-xl transition-all duration-200',
                    pathname === `/guides/${guide.id}`
                      ? 'bg-gradient-to-r from-indigo-600/[0.12] to-violet-600/[0.08] dark:from-indigo-500/[0.18] dark:to-violet-500/[0.12] text-indigo-700 dark:text-indigo-300 font-semibold shadow-[inset_0_0_0_1px_rgba(99,102,241,0.2)]'
                      : 'text-foreground hover:bg-muted/80',
                  )}
                >
                  <div
                    className={cn(
                      'absolute left-0 w-0.5 h-5 rounded-r-full bg-gradient-to-b from-indigo-500 to-violet-500 transition-opacity duration-200',
                      pathname === `/guides/${guide.id}` ? 'opacity-100' : 'opacity-0',
                    )}
                    aria-hidden="true"
                  />
                  <BookOpen className="h-4 w-4 shrink-0" />
                  <span className="text-sm truncate">{guide.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
