'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

const VID_KEY = '_vid'
const VID_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

function getVisitorId(): string {
  try {
    const match = document.cookie.match(new RegExp(`(?:^|; )${VID_KEY}=([^;]+)`))
    if (match?.[1]) return match[1]
    const id = Math.random().toString(36).slice(2) + Date.now().toString(36)
    document.cookie = `${VID_KEY}=${id}; max-age=${VID_MAX_AGE}; path=/; SameSite=Lax`
    return id
  } catch {
    return 'unknown'
  }
}

function getSessionId(): string {
  const key = '_sess_id'
  try {
    let id = sessionStorage.getItem(key)
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36)
      sessionStorage.setItem(key, id)
    }
    return id
  } catch {
    return 'unknown'
  }
}

export function PageTracker() {
  const pathname = usePathname()
  const { user } = useAuth()
  // Use a ref so the effect doesn't re-fire on auth state changes
  const userRef = useRef(user)
  useEffect(() => {
    userRef.current = user
  }, [user])

  useEffect(() => {
    const sessionId = getSessionId()
    const visitorId = getVisitorId()
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        sessionId,
        visitorId,
        userId: userRef.current?.id ?? null,
      }),
    }).catch(() => {})
  }, [pathname])

  return null
}
