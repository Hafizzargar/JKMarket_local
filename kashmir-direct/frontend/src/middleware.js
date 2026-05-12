import { NextResponse } from 'next/server'

export function middleware(request) {
  return NextResponse.next()
}

// 🛡️ PASSIVE SENTINEL: This middleware is currently in passive mode 
// to ensure route stability while authentication group folders are being resolved.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
