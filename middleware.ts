import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const hasSession = request.cookies.getAll().some(
    c => c.name.includes('-auth-token') && c.value.length > 0
  )

  if (path.startsWith('/internal') && !path.startsWith('/internal/login')) {
    if (!hasSession) {
      return NextResponse.redirect(new URL('/internal/login', request.url))
    }
  }

  if (path.startsWith('/vip') && !path.startsWith('/vip/login')) {
    if (!hasSession) {
      return NextResponse.redirect(new URL('/vip/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/internal/:path*', '/vip/:path*'],
}
