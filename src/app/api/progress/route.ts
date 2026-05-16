import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getUserFromRequest } from '@/lib/authUtils'

export async function GET(req: NextRequest) {
  const authUser = await getUserFromRequest(req)
  if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('user_progress')
    .select('question_id')
    .eq('user_id', authUser.id)

  if (error) return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })

  const completed = (data ?? []).map((r) => r.question_id as string)
  return NextResponse.json({ completed })
}
