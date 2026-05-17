import { NextRequest, NextResponse } from 'next/server'
import { getUserAndTokenFromRequest, createUserClient } from '@/lib/authUtils'

export async function GET(req: NextRequest) {
  const auth = await getUserAndTokenFromRequest(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createUserClient(auth.token)
  const { data, error } = await db
    .from('user_progress')
    .select('question_id')
    .eq('user_id', auth.user.id)

  if (error) {
    console.error('[GET /api/progress] fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }

  const completed = (data ?? []).map((r) => r.question_id as string)
  return NextResponse.json({ completed })
}
