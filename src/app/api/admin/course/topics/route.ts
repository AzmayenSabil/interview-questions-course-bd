import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE } from '@/lib/adminAuth'
import { getTopicsWithCount, createTopic } from '@/lib/courseDb'

export const dynamic = 'force-dynamic'

function isAdmin(req: NextRequest) {
  return req.cookies.get(ADMIN_COOKIE)?.value === process.env.ADMIN_SESSION_TOKEN
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    return NextResponse.json(await getTopicsWithCount())
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = (await req.json()) as {
      id?: string
      name?: string
      icon?: string
      display_order?: number
      description?: string
      keywords?: string[]
    }
    if (!body.id || !body.name) {
      return NextResponse.json({ error: 'id and name are required' }, { status: 400 })
    }
    const topic = await createTopic({
      id: body.id,
      name: body.name,
      icon: body.icon ?? '📚',
      display_order: body.display_order ?? 999,
      description: body.description ?? '',
      keywords: body.keywords ?? [],
    })
    return NextResponse.json(topic, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
