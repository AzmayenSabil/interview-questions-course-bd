'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

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

  useEffect(() => {
    const sessionId = getSessionId()
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        sessionId,
      }),
    }).catch(() => {})
  }, [pathname])

  return null
}
