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
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white select-none shadow-md shadow-indigo-500/30">
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
        className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted transition-colors"
        onClick={() => {
          setEditing(true)
          setTimeout(() => inputRef.current?.select(), 0)
        }}
      >
        <span className="font-medium truncate">{value || initialName}</span>
        {saved ? (
          <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
        ) : (
          <Pencil className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        )}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-1.5 px-2 py-1.5">
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSave()
          if (e.key === 'Escape') setEditing(false)
        }}
        className="flex-1 min-w-0 rounded-lg border border-border bg-background px-2 py-1 text-sm outline-none focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors"
        maxLength={50}
        autoFocus
      />
      <button
        onClick={handleSave}
        disabled={saving}
        className="shrink-0 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-2.5 py-1 text-xs font-semibold text-white hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 transition-all"
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

  async function handleReset() {
    if (!window.confirm('Reset all progress? This cannot be undone.')) return
    if (user) {
      await fetch('/api/progress/reset', { method: 'DELETE' }).catch(() => {})
    }
    resetProgress()
  }

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-3 px-4 glass-nav border-b border-border/50 shadow-[0_1px_0_0_rgba(99,102,241,0.07)]">
      {/* Mobile menu */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={toggleSidebar}
        aria-label="Toggle navigation"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 whitespace-nowrap group">
        <span className="font-extrabold text-base tracking-tight gradient-text">Interview BD</span>
        <span className="font-normal text-muted-foreground text-sm hidden sm:inline transition-colors group-hover:text-foreground">
          · Course
        </span>
      </Link>

      <div className="flex-1" />

      {/* Progress pill */}
      {data && (
        <div className="hidden sm:flex items-center gap-2.5 rounded-full border border-border/60 bg-muted/60 backdrop-blur px-3.5 py-1.5 text-sm">
          <span className="font-extrabold gradient-text text-sm tabular-nums">
            {progress.percentage}%
          </span>
          <div
            className="h-1.5 w-20 rounded-full bg-border overflow-hidden"
            role="progressbar"
            aria-valuenow={progress.percentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full gradient-progress rounded-full transition-all duration-700"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          <span className="text-muted-foreground text-[11px] font-medium">overall</span>
        </div>
      )}

      {/* Reset button */}
      {user && (
        <Button variant="danger" size="sm" onClick={handleReset} aria-label="Reset all progress">
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </Button>
      )}

      {/* Theme toggle */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label="Toggle theme"
        className="relative h-9 w-9 rounded-xl border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
      </button>

      {/* Auth area */}
      {isLoading ? (
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-200 to-violet-200 dark:from-indigo-900 dark:to-violet-900 animate-pulse" />
      ) : user ? (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-transform hover:scale-105 active:scale-95"
              aria-label="User menu"
            >
              <UserAvatar displayName={user.displayName} />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={10}
              className={cn(
                'z-50 min-w-[230px] rounded-2xl border border-border/60 bg-card/95 p-2 shadow-xl backdrop-blur-xl',
                'data-[state=open]:animate-in data-[state=closed]:animate-out',
                'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                'data-[side=bottom]:slide-in-from-top-2',
                'shadow-[0_16px_48px_rgba(0,0,0,0.12),0_0_0_1px_rgba(99,102,241,0.08)]',
              )}
            >
              <div className="px-3 py-2 mb-1">
                <p className="text-[11px] text-muted-foreground truncate font-medium">
                  {user.email}
                </p>
              </div>

              <DropdownMenu.Label className="px-3 py-0.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Display name
              </DropdownMenu.Label>
              <DisplayNameEditor initialName={user.displayName} onSave={updateDisplayName} />

              <DropdownMenu.Separator className="my-2 h-px bg-border/60" />

              <DropdownMenu.Item
                onSelect={() => logout()}
                className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 outline-none transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      ) : (
        <Button variant="subtle" size="sm" onClick={() => openAuthModal()}>
          Sign in
        </Button>
      )}
    </header>
  )
}
