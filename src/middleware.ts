import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE = 'sb-token'
const REFRESH_COOKIE = 'sb-refresh'

function jwtExpiresAt(token: string): number | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const { exp } = JSON.parse(atob(payload)) as { exp?: number }
    return exp ? exp * 1000 : null
  } catch {
    return null
  }
}

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get(SESSION_COOKIE)?.value
  const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value

  // Nothing to refresh if no tokens present
  if (!accessToken || !refreshToken) return NextResponse.next()

  const expiresAt = jwtExpiresAt(accessToken)
  // If token is valid for more than 60 seconds, pass through
  if (expiresAt && expiresAt - Date.now() > 60_000) return NextResponse.next()

  // Token expired or about to — attempt refresh via Supabase REST
  try {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !supabaseKey) return NextResponse.next()

    const refreshRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!refreshRes.ok) return NextResponse.next()

    const data = (await refreshRes.json()) as {
      access_token?: string
      refresh_token?: string
    }
    if (!data.access_token || !data.refresh_token) return NextResponse.next()

    const res = NextResponse.next()
    const isProduction = process.env.NODE_ENV === 'production'

    res.cookies.set({
      name: SESSION_COOKIE,
      value: data.access_token,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    res.cookies.set({
      name: REFRESH_COOKIE,
      value: data.refresh_token,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })
    return res
  } catch {
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/api/:path*'],
}
