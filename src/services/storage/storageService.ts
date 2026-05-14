'use client'

export const storageService = {
  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : null
    } catch {
      return null
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage quota exceeded or security error — fail silently
    }
  },

  remove(key: string): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)
  },

  clear(): void {
    if (typeof window === 'undefined') return
    localStorage.clear()
  },
}
