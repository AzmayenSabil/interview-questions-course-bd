import { NextResponse } from 'next/server'
import { getCourseData } from '@/lib/courseDb'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = await getCourseData()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
