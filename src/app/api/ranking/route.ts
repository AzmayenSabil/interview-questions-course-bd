import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { RankingEntry } from '@/features/course/types/course.types'

export async function GET() {
  const [{ data: progressRows }, { data: profileRows }, { count: totalQuestions }] =
    await Promise.all([
      supabase.from('user_progress').select('user_id, question_id'),
      supabase.from('profiles').select('id, display_name'),
      supabase.from('questions').select('*', { count: 'exact', head: true }),
    ])

  const userCounts: Record<string, number> = {}
  for (const row of progressRows ?? []) {
    userCounts[row.user_id] = (userCounts[row.user_id] ?? 0) + 1
  }

  const profileMap: Record<string, string> = {}
  for (const p of profileRows ?? []) {
    if (p.display_name) profileMap[p.id] = p.display_name
  }

  const total = totalQuestions ?? 0

  const ranking: RankingEntry[] = Object.entries(userCounts)
    .map(([userId, completed], _i) => ({
      rank: 0,
      displayName: profileMap[userId] || 'Anonymous',
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    }))
    .sort((a, b) => b.completed - a.completed || a.displayName.localeCompare(b.displayName))
    .map((entry, i) => ({ ...entry, rank: i + 1 }))

  return NextResponse.json({ ranking })
}
