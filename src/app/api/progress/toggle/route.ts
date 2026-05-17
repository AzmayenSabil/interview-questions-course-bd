import { NextRequest, NextResponse } from 'next/server'
import { getUserAndTokenFromRequest, createUserClient } from '@/lib/authUtils'

export async function POST(req: NextRequest) {
  const auth = await getUserAndTokenFromRequest(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { questionId } = (await req.json()) as { questionId?: unknown }
  if (typeof questionId !== 'string' || !questionId) {
    return NextResponse.json({ error: 'Invalid questionId' }, { status: 400 })
  }

  const db = createUserClient(auth.token)

  const { data: existing, error: selectError } = await db
    .from('user_progress')
    .select('question_id')
    .eq('user_id', auth.user.id)
    .eq('question_id', questionId)
    .maybeSingle()

  if (selectError) {
    console.error('[POST /api/progress/toggle] select error:', selectError)
    return NextResponse.json({ error: selectError.message }, { status: 500 })
  }

  if (existing) {
    const { error: deleteError } = await db
      .from('user_progress')
      .delete()
      .eq('user_id', auth.user.id)
      .eq('question_id', questionId)
    if (deleteError) {
      console.error('[POST /api/progress/toggle] delete error:', deleteError)
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }
    return NextResponse.json({ completed: false })
  } else {
    const { error: insertError } = await db
      .from('user_progress')
      .insert({ user_id: auth.user.id, question_id: questionId })
    if (insertError) {
      console.error('[POST /api/progress/toggle] insert error:', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }
    return NextResponse.json({ completed: true })
  }
}
