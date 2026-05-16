import { NextRequest, NextResponse } from 'next/server'
import { getStats } from '@/lib/analyticsStore'
import { ADMIN_COOKIE_TOKEN, ADMIN_COOKIE } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const session = req.cookies.get(ADMIN_COOKIE)
  if (session?.value !== ADMIN_COOKIE_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json(await getStats())
}
