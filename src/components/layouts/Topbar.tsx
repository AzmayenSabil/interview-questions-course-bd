'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Moon, Sun, Menu, RotateCcw, LogOut, Loader2, Check, Pencil } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Button } from '@/components/ui/button'
import { useCourseUiStore } from '@/features/course/store/courseUiStore'
import { useProgressStore } from '@/features/course/store/progressStore'
import { useOverallProgress } from '@/features/course/hooks/useTopicProgress'
import { useCourseData } from '@/features/course/hooks/useCourseData'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/utils/cn'

function UserAvatar({ displayName }: { displayName: string }) {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white select-none">
      {displayName.charAt(0).toUpperCase()}
    </span>
  )
}

function DisplayNameEditor({
  initialName,
  onSave,
}: {
  initialName: string
  onSave: (name: string) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(initialName)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleSave() {
    const trimmed = value.trim()
    if (!trimmed || trimmed === initialName) {
      setEditing(false)
      return
    }
    setSaving(true)
    try {
      await onSave(trimmed)
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    } finally {
      setSaving(false)
      setEditing(false)
    }
  }

  if (!editing) {
    return (
      <button
        className="flex w-full items-center justify-between gap-2 rounded px-2 py-1 text-sm hover:bg-muted transition-colors"
        onClick={() => {
          setEditing(true)
          setTimeout(() => inputRef.current?.select(), 0)
        }}
      >
        <span className="font-medium truncate">{value || initialName}</span>
        {saved ? (
          <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
        ) : (
          <Pencil className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        )}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-1.5 px-2 py-1">
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSave()
          if (e.key === 'Escape') setEditing(false)
        }}
        className="flex-1 min-w-0 rounded border border-border bg-background px-2 py-0.5 text-sm outline-none focus:border-indigo-500"
        maxLength={50}
        autoFocus
      />
      <button
        onClick={handleSave}
        disabled={saving}
        className="shrink-0 rounded bg-indigo-600 px-2 py-0.5 text-xs text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Save'}
      </button>
    </div>
  )
}

export function Topbar() {
  const { theme, setTheme } = useTheme()
  const { toggleSidebar } = useCourseUiStore()
  const { resetProgress } = useProgressStore()
  const { data } = useCourseData()
  const { user, isLoading, openAuthModal, logout, updateDisplayName } = useAuth()

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

      {user && (
        <Button variant="danger" size="sm" onClick={handleReset} aria-label="Reset all progress">
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </Button>
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label="Toggle theme"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
      </Button>

      {/* Auth area */}
      {isLoading ? (
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
      ) : user ? (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              <UserAvatar displayName={user.displayName} />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className={cn(
                'z-50 min-w-[220px] rounded-xl border border-border bg-card p-1.5 shadow-lg',
                'data-[state=open]:animate-in data-[state=closed]:animate-out',
                'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                'data-[side=bottom]:slide-in-from-top-2',
              )}
            >
              <div className="px-2 py-1.5 mb-1">
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>

              <DropdownMenu.Label className="px-2 py-0.5 text-xs text-muted-foreground">
                Display name
              </DropdownMenu.Label>
              <DisplayNameEditor initialName={user.displayName} onSave={updateDisplayName} />

              <DropdownMenu.Separator className="my-1.5 h-px bg-border" />

              <DropdownMenu.Item
                onSelect={() => logout()}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 outline-none transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      ) : (
        <Button variant="ghost" size="sm" onClick={() => openAuthModal()}>
          Sign in
        </Button>
      )}
    </header>
  )
}
