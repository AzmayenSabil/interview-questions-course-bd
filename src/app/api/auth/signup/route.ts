import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sessionCookieOptions } from '@/lib/authUtils'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = (await req.json()) as { email?: unknown; password?: unknown }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { data: createData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (createError || !createData.user) {
      return NextResponse.json({ error: createError?.message ?? 'Signup failed' }, { status: 400 })
    }

    const userId = createData.user.id
    const displayName = email.charAt(0).toUpperCase()

    await supabase.from('profiles').insert({ id: userId, display_name: displayName })

    // Sign in immediately to get a session token
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError || !signInData.session) {
      return NextResponse.json({ error: 'Account created — please sign in' }, { status: 201 })
    }

    const user = { id: userId, email, displayName }
    const res = NextResponse.json({ user })
    res.cookies.set(sessionCookieOptions(signInData.session.access_token))
    return res
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
