'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react'
import { useProgressStore } from '@/features/course/store/progressStore'

export interface AuthUser {
  id: string
  email: string
  displayName: string
}

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  isAuthModalOpen: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateDisplayName: (name: string) => Promise<void>
  openAuthModal: (afterAuth?: () => void) => void
  closeAuthModal: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const afterAuthRef = useRef<(() => void) | undefined>(undefined)

  const syncProgressFromDb = useCallback(async () => {
    const res = await fetch('/api/progress')
    if (!res.ok) {
      console.error('[syncProgressFromDb] failed:', res.status)
      return
    }
    const { completed } = (await res.json()) as { completed: string[] }
    useProgressStore.getState().setCompleted(completed)
  }, [])

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then(async (data: { user: AuthUser | null } | null) => {
        if (data?.user) {
          setUser(data.user)
          await syncProgressFromDb()
        }
      })
      .finally(() => setIsLoading(false))
  }, [syncProgressFromDb])

  const handleAuthSuccess = useCallback(
    (newUser: AuthUser) => {
      setUser(newUser)
      setIsAuthModalOpen(false)
      const callback = afterAuthRef.current
      afterAuthRef.current = undefined
      syncProgressFromDb().then(() => callback?.())
    },
    [syncProgressFromDb],
  )

  const openAuthModal = useCallback((afterAuth?: () => void) => {
    afterAuthRef.current = afterAuth
    setIsAuthModalOpen(true)
  }, [])

  const closeAuthModal = useCallback(() => {
    afterAuthRef.current = undefined
    setIsAuthModalOpen(false)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = (await res.json()) as { user?: AuthUser; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Login failed')
      handleAuthSuccess(data.user!)
    },
    [handleAuthSuccess],
  )

  const register = useCallback(
    async (email: string, password: string) => {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = (await res.json()) as { user?: AuthUser; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Registration failed')
      handleAuthSuccess(data.user!)
    },
    [handleAuthSuccess],
  )

  const logout = useCallback(async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    setUser(null)
    useProgressStore.getState().resetProgress()
  }, [])

  const updateDisplayName = useCallback(async (name: string) => {
    const res = await fetch('/api/auth/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName: name }),
    })
    const data = (await res.json()) as { displayName?: string; error?: string }
    if (!res.ok) throw new Error(data.error ?? 'Update failed')
    setUser((prev) => (prev ? { ...prev, displayName: data.displayName! } : prev))
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthModalOpen,
        login,
        register,
        logout,
        updateDisplayName,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
