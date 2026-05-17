import { NextResponse } from 'next/server'
import { SESSION_COOKIE, REFRESH_COOKIE } from '@/lib/authUtils'

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set({ name: SESSION_COOKIE, value: '', maxAge: 0, path: '/' })
  res.cookies.set({ name: REFRESH_COOKIE, value: '', maxAge: 0, path: '/' })
  return res
}
