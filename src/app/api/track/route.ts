import { NextRequest, NextResponse } from 'next/server'
import { recordView } from '@/lib/analyticsStore'

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      pathname?: unknown
      referrer?: unknown
      userAgent?: unknown
      sessionId?: unknown
      visitorId?: unknown
      userId?: unknown
    }

    if (typeof body.pathname !== 'string') {
      return NextResponse.json({}, { status: 400 })
    }

    if (body.pathname.startsWith('/xadmin')) {
      return NextResponse.json({ ok: true })
    }

    await recordView({
      path: body.pathname,
      ref: typeof body.referrer === 'string' ? body.referrer.slice(0, 200) : '',
      ua: typeof body.userAgent === 'string' ? body.userAgent.slice(0, 200) : '',
      sid: typeof body.sessionId === 'string' ? body.sessionId : 'unknown',
      visitorId: typeof body.visitorId === 'string' ? body.visitorId : 'unknown',
      userId: typeof body.userId === 'string' ? body.userId : null,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({}, { status: 400 })
  }
}
