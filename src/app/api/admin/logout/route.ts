import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE } from '@/lib/adminAuth'

export function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/xadmin', req.url))
  res.cookies.delete(ADMIN_COOKIE)
  return res
}
