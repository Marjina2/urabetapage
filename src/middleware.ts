import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(request: NextRequest) {
  try {
    // Skip middleware for static files and API routes
    if (
      request.nextUrl.pathname.includes('.') ||
      request.nextUrl.pathname.startsWith('/_next/') ||
      request.nextUrl.pathname.startsWith('/api/') ||
      request.nextUrl.pathname.startsWith('/.netlify/')
    ) {
      return NextResponse.next()
    }

    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res })
    const { data: { session } } = await supabase.auth.getSession()

    // Public paths that don't require authentication
    const publicPaths = ['/', '/auth/callback', '/login', '/register', '/terms', '/privacy']
    if (publicPaths.includes(request.nextUrl.pathname)) {
      return res
    }

    // If no session, only allow public paths
    if (!session) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/|api/|.netlify/).*)',
  ],
} 