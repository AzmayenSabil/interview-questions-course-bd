import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE } from '@/lib/adminAuth'
import { getQuestionsByTopic, createQuestion } from '@/lib/courseDb'

export const dynamic = 'force-dynamic'

function isAdmin(req: NextRequest) {
  return req.cookies.get(ADMIN_COOKIE)?.value === process.env.ADMIN_SESSION_TOKEN
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const topicId = req.nextUrl.searchParams.get('topicId')
  if (!topicId) return NextResponse.json({ error: 'topicId is required' }, { status: 400 })
  try {
    return NextResponse.json(await getQuestionsByTopic(topicId))
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = (await req.json()) as {
      id?: string
      topic_id?: string
      company?: string
      source_file?: string
      title?: string
      content?: string
      has_answer?: boolean
      difficulty?: string
      oj_url?: string
    }
    if (!body.id || !body.topic_id || !body.content) {
      return NextResponse.json({ error: 'id, topic_id, and content are required' }, { status: 400 })
    }
    const question = await createQuestion({
      id: body.id,
      topic_id: body.topic_id,
      company: body.company ?? '',
      source_file: body.source_file ?? '',
      title: body.title ?? null,
      content: body.content,
      has_answer: body.has_answer ?? false,
      difficulty: (body.difficulty as 'easy' | 'medium' | 'hard') ?? 'medium',
      oj_url: body.oj_url ?? null,
    })
    return NextResponse.json(question, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
