import { NextResponse } from 'next/server'
import courseData from '@/data/course.json'

export const dynamic = 'force-static'

export function GET() {
  return NextResponse.json(courseData)
}
