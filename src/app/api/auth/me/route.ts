import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getUserFromRequest } from '@/lib/authUtils'

export async function GET(req: NextRequest) {
  const authUser = await getUserFromRequest(req)
  if (!authUser) return NextResponse.json({ user: null })

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', authUser.id)
    .single()

  const displayName = profile?.display_name || authUser.email!.charAt(0).toUpperCase()
  return NextResponse.json({
    user: { id: authUser.id, email: authUser.email!, displayName },
  })
}

export async function PATCH(req: NextRequest) {
  const authUser = await getUserFromRequest(req)
  if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { displayName } = (await req.json()) as { displayName?: unknown }
  if (typeof displayName !== 'string' || !displayName.trim()) {
    return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
  }

  const trimmed = displayName.trim().slice(0, 50)
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: authUser.id, display_name: trimmed })

  if (error) return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  return NextResponse.json({ displayName: trimmed })
}
