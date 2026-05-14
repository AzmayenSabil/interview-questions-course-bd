'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Moon, Sun, Menu, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCourseUiStore } from '@/features/course/store/courseUiStore'
import { useProgressStore } from '@/features/course/store/progressStore'
import { useOverallProgress } from '@/features/course/hooks/useTopicProgress'
import { useCourseData } from '@/features/course/hooks/useCourseData'

export function Topbar() {
  const { theme, setTheme } = useTheme()
  const { toggleSidebar } = useCourseUiStore()
  const { resetProgress } = useProgressStore()
  const { data } = useCourseData()

  const topicsWithQuestions = data?.topics.filter((t) => t.questions.length > 0) ?? []
  const progress = useOverallProgress(topicsWithQuestions)

  function handleReset() {
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      resetProgress()
    }
  }

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-3 border-b border-border bg-card px-4 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={toggleSidebar}
        aria-label="Toggle navigation"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <Link href="/" className="font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
        Interview BD <span className="font-normal text-muted-foreground text-sm">· Course</span>
      </Link>

      <div className="flex-1" />

      {data && (
        <div className="hidden sm:flex items-center gap-2 rounded-full bg-muted border border-border px-3 py-1 text-sm">
          <span className="font-bold text-indigo-600 dark:text-indigo-400">
            {progress.percentage}%
          </span>
          <span className="text-muted-foreground text-xs">overall</span>
          <div
            className="h-1.5 w-24 rounded-full bg-border overflow-hidden"
            role="progressbar"
            aria-valuenow={progress.percentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      )}

      <Button variant="danger" size="sm" onClick={handleReset} aria-label="Reset all progress">
        <RotateCcw className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Reset</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label="Toggle theme"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
      </Button>
    </header>
  )
}
