import { supabase } from './supabase'

export interface PageView {
  ts: number
  path: string
  ref: string
  ua: string
  sid: string
}

export async function recordView(view: Omit<PageView, 'ts'>): Promise<void> {
  await supabase.from('page_views').insert({
    ts: Date.now(),
    path: view.path,
    ref: view.ref,
    ua: view.ua,
    sid: view.sid,
  })
}

export async function getStats() {
  const now = Date.now()
  const DAY = 86_400_000

  const { data, error } = await supabase
    .from('page_views')
    .select('ts, path, sid, ua')
    .order('ts', { ascending: false })
    .limit(5000)

  const views: PageView[] = error
    ? []
    : (data ?? []).map((r) => ({
        ts: r.ts as number,
        path: r.path as string,
        sid: r.sid as string,
        ua: r.ua as string,
        ref: '',
      }))

  const todayViews = views.filter((v) => v.ts > now - DAY)
  const weekViews = views.filter((v) => v.ts > now - 7 * DAY)

  const pageCounts: Record<string, number> = {}
  for (const v of views) pageCounts[v.path] = (pageCounts[v.path] ?? 0) + 1

  const topPages = Object.entries(pageCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([page, count]) => ({ page, count }))

  return {
    total: views.length,
    today: todayViews.length,
    thisWeek: weekViews.length,
    uniqueSessions: new Set(views.map((v) => v.sid)).size,
    uniqueSessionsToday: new Set(todayViews.map((v) => v.sid)).size,
    topPages,
    recent: views.slice(0, 30),
  }
}

export type Stats = Awaited<ReturnType<typeof getStats>>
