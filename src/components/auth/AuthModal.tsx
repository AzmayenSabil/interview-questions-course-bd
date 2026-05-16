'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/utils/cn'

type Tab = 'login' | 'register'

function inputCls(hasError?: boolean) {
  return cn(
    'w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors',
    'placeholder:text-muted-foreground',
    hasError ? 'border-red-400 focus:border-red-500' : 'border-border focus:border-indigo-500',
  )
}

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth()

  const [tab, setTab] = useState<Tab>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function reset() {
    setEmail('')
    setPassword('')
    setConfirm('')
    setError('')
    setLoading(false)
  }

  function switchTab(t: Tab) {
    setTab(t)
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Email and password are required.')
      return
    }

    if (tab === 'register') {
      if (password.length < 6) {
        setError('Password must be at least 6 characters.')
        return
      }
      if (password !== confirm) {
        setError('Passwords do not match.')
        return
      }
    }

    setLoading(true)
    try {
      if (tab === 'login') {
        await login(email, password)
      } else {
        await register(email, password)
      }
      reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog.Root
      open={isAuthModalOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeAuthModal()
          reset()
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <Dialog.Close
            className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Dialog.Close>

          <Dialog.Title className="text-lg font-semibold text-foreground mb-1">
            {tab === 'login' ? 'Welcome back' : 'Create an account'}
          </Dialog.Title>
          <Dialog.Description className="text-sm text-muted-foreground mb-5">
            {tab === 'login'
              ? 'Sign in to save your progress across devices.'
              : 'Sign up to track and sync your progress.'}
          </Dialog.Description>

          {/* Tabs */}
          <div className="flex rounded-lg border border-border p-0.5 mb-5 bg-muted text-sm">
            {(['login', 'register'] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => switchTab(t)}
                className={cn(
                  'flex-1 rounded-md py-1.5 font-medium transition-colors capitalize',
                  tab === t
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {t === 'login' ? 'Sign in' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Email</label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputCls()}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Password
              </label>
              <input
                type="password"
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputCls()}
                required
              />
            </div>

            {tab === 'register' && (
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Confirm password
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className={inputCls(!!confirm && confirm !== password)}
                  required
                />
              </div>
            )}

            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 px-3 py-2 text-xs text-red-600 dark:text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {tab === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
