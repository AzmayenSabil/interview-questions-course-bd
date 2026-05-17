'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/utils/cn'

type Tab = 'login' | 'register'

function InputField({
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  hasError,
  required,
}: {
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  autoComplete?: string
  hasError?: boolean
  required?: boolean
}) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (show ? 'text' : 'password') : type
  const Icon = type === 'email' ? Mail : Lock

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
        <input
          type={inputType}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={cn(
            'w-full rounded-xl border bg-muted/60 pl-10 pr-10 py-2.5 text-sm outline-none',
            'placeholder:text-muted-foreground/50 transition-all duration-200',
            'focus:bg-card focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]',
            hasError
              ? 'border-rose-400 focus:border-rose-400'
              : 'border-border focus:border-indigo-400 dark:focus:border-indigo-500',
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            tabIndex={-1}
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    </div>
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
        {/* Backdrop */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Card */}
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-full max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-3xl p-7 shadow-2xl',
            'glass-card border border-white/60 dark:border-indigo-900/40',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=open]:shadow-[0_24px_80px_rgba(99,102,241,0.18)] dark:data-[state=open]:shadow-[0_24px_80px_rgba(129,140,248,0.14)]',
          )}
        >
          {/* Ambient glow */}
          <div
            className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full bg-indigo-500/20 dark:bg-indigo-400/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <Dialog.Close
            className="absolute right-4 top-4 rounded-xl p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Dialog.Close>

          {/* Header */}
          <div className="mb-6 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <Dialog.Title className="text-xl font-bold text-foreground tracking-tight">
              {tab === 'login' ? 'Welcome back' : 'Create account'}
            </Dialog.Title>
            <Dialog.Description className="text-sm text-muted-foreground mt-1">
              {tab === 'login'
                ? 'Sign in to sync your progress across devices.'
                : 'Sign up to track and save your progress.'}
            </Dialog.Description>
          </div>

          {/* Tab switcher */}
          <div className="relative z-10 flex rounded-xl border border-border/60 p-1 mb-5 bg-muted/60 text-sm gap-1">
            {(['login', 'register'] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => switchTab(t)}
                className={cn(
                  'flex-1 rounded-lg py-2 font-semibold transition-all duration-200 capitalize',
                  tab === t
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {t === 'login' ? 'Sign in' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 space-y-3.5">
            <InputField
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
            <InputField
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              required
            />
            {tab === 'register' && (
              <InputField
                label="Confirm password"
                type="password"
                value={confirm}
                onChange={setConfirm}
                placeholder="••••••••"
                autoComplete="new-password"
                hasError={!!confirm && confirm !== password}
                required
              />
            )}

            {error && (
              <p className="rounded-xl border border-rose-200 dark:border-rose-800/60 bg-rose-50 dark:bg-rose-950/30 px-3.5 py-2.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={cn(
                'w-full rounded-xl py-3 text-sm font-bold text-white mt-2 transition-all duration-200',
                'bg-gradient-to-r from-indigo-600 to-violet-600',
                'hover:from-indigo-500 hover:to-violet-500',
                'shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40',
                'disabled:opacity-60 disabled:cursor-not-allowed',
                'flex items-center justify-center gap-2',
                'active:scale-[0.98]',
              )}
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
