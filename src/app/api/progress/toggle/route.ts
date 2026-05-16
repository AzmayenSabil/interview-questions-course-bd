import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getUserFromRequest } from '@/lib/authUtils'

export async function POST(req: NextRequest) {
  const authUser = await getUserFromRequest(req)
  if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { questionId } = (await req.json()) as { questionId?: unknown }
  if (typeof questionId !== 'string' || !questionId) {
    return NextResponse.json({ error: 'Invalid questionId' }, { status: 400 })
  }

  const { data: existing } = await supabase
    .from('user_progress')
    .select('question_id')
    .eq('user_id', authUser.id)
    .eq('question_id', questionId)
    .single()

  if (existing) {
    await supabase
      .from('user_progress')
      .delete()
      .eq('user_id', authUser.id)
      .eq('question_id', questionId)
    return NextResponse.json({ completed: false })
  } else {
    await supabase.from('user_progress').insert({ user_id: authUser.id, question_id: questionId })
    return NextResponse.json({ completed: true })
  }
}
