import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_PASSWORD, ADMIN_COOKIE_TOKEN, ADMIN_COOKIE } from '@/lib/adminAuth'

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { password?: unknown }

  if (body.password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, ADMIN_COOKIE_TOKEN, {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
  })
  return res
}
