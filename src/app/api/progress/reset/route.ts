import { NextRequest, NextResponse } from 'next/server'
import { getUserAndTokenFromRequest, createUserClient } from '@/lib/authUtils'

export async function DELETE(req: NextRequest) {
  const auth = await getUserAndTokenFromRequest(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createUserClient(auth.token)
  const { error } = await db.from('user_progress').delete().eq('user_id', auth.user.id)

  if (error) {
    console.error('[DELETE /api/progress/reset] error:', error)
    return NextResponse.json({ error: 'Failed to reset progress' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
