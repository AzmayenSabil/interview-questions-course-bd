import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, ADMIN_COOKIE_TOKEN } from '@/lib/adminAuth'
import { updateTopic, deleteTopic } from '@/lib/courseDb'

export const dynamic = 'force-dynamic'

function isAdmin(req: NextRequest) {
  return req.cookies.get(ADMIN_COOKIE)?.value === ADMIN_COOKIE_TOKEN
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await params
    const body = await req.json()
    const topic = await updateTopic(id, body)
    return NextResponse.json(topic)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await params
    await deleteTopic(id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
