import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sessionCookieOptions } from '@/lib/authUtils'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = (await req.json()) as { email?: unknown; password?: unknown }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error || !data.session) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', data.user.id)
      .single()

    const displayName = profile?.display_name || email.charAt(0).toUpperCase()
    const user = { id: data.user.id, email: data.user.email!, displayName }

    const res = NextResponse.json({ user })
    res.cookies.set(sessionCookieOptions(data.session.access_token))
    return res
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
