import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { ADMIN_COOKIE } from '@/lib/adminAuth'

function verifyPassword(plain: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(':')
  if (!saltHex || !hashHex) return false
  try {
    const salt = Buffer.from(saltHex, 'hex')
    const expected = Buffer.from(hashHex, 'hex')
    const derived = crypto.scryptSync(plain, salt, 64, { N: 16384, r: 8, p: 1 })
    return crypto.timingSafeEqual(derived, expected)
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { password?: unknown }
  if (typeof body.password !== 'string' || !body.password) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('admin_users')
    .select('password_hash')
    .limit(1)
    .single()

  if (error || !data?.password_hash) {
    return NextResponse.json({ error: 'Admin not configured' }, { status: 503 })
  }

  if (!verifyPassword(body.password, data.password_hash)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const sessionToken = process.env.ADMIN_SESSION_TOKEN
  if (!sessionToken) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 503 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === 'production',
  })
  return res
}
