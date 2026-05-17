import { NextRequest, NextResponse } from 'next/server'
import { getUserAndTokenFromRequest, createUserClient } from '@/lib/authUtils'

export async function GET(req: NextRequest) {
  const auth = await getUserAndTokenFromRequest(req)
  if (!auth) return NextResponse.json({ user: null })

  const db = createUserClient(auth.token)
  const { data: profile, error: profileError } = await db
    .from('profiles')
    .select('display_name')
    .eq('id', auth.user.id)
    .maybeSingle()

  if (profileError) console.error('[GET /api/auth/me] profiles read error:', profileError)
  const displayName = profile?.display_name || auth.user.email!.charAt(0).toUpperCase()
  return NextResponse.json({
    user: { id: auth.user.id, email: auth.user.email!, displayName },
  })
}

export async function PATCH(req: NextRequest) {
  const auth = await getUserAndTokenFromRequest(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { displayName } = (await req.json()) as { displayName?: unknown }
  if (typeof displayName !== 'string' || !displayName.trim()) {
    return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
  }

  const trimmed = displayName.trim().slice(0, 50)
  const db = createUserClient(auth.token)
  const { error } = await db
    .from('profiles')
    .upsert({ id: auth.user.id, display_name: trimmed }, { onConflict: 'id' })

  if (error) {
    console.error('[PATCH /api/auth/me] profiles upsert error:', error)
    return NextResponse.json({ error: error.message ?? 'Update failed' }, { status: 500 })
  }
  return NextResponse.json({ displayName: trimmed })
}
