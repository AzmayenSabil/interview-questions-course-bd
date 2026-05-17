import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabase } from './supabase'

export const SESSION_COOKIE = 'sb-token'
export const REFRESH_COOKIE = 'sb-refresh'

export async function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (!token) return null
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token)
  if (error || !user) return null
  return user
}

/**
 * Returns both the validated user and their raw JWT so callers can build a
 * user-scoped DB client via createUserClient().
 */
export async function getUserAndTokenFromRequest(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (!token) return null
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token)
  if (error || !user) return null
  return { user, token }
}

/**
 * Creates a Supabase client that sends the user's own JWT as the Authorization
 * header. PostgREST sets auth.uid() from this JWT, so user-scoped RLS policies
 * (USING auth.uid() = user_id) resolve correctly regardless of which API key
 * is stored in SUPABASE_SERVICE_ROLE_KEY.
 */
export function createUserClient(token: string) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  })
}

export function sessionCookieOptions(token: string) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  }
}

export function refreshCookieOptions(token: string) {
  return {
    name: REFRESH_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  }
}

export function clearCookieOptions(name: string) {
  return {
    name,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 0,
    path: '/',
  }
}
