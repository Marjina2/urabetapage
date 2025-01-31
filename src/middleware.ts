import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(request: NextRequest) {
  // Skip middleware for static files and API routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/.netlify') ||
    request.nextUrl.pathname.includes('.') ||
    request.nextUrl.pathname === '/'
  ) {
    return NextResponse.next()
  }

  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res })
    const { data: { session } } = await supabase.auth.getSession()

    // Public paths that don't require authentication
    const publicPaths = ['/', '/auth/callback', '/login', '/register', '/terms', '/privacy']
    const isPublicPath = publicPaths.includes(request.nextUrl.pathname)

    if (isPublicPath) {
      return res
    }

    // Protected paths
    const protectedPaths = ['/dashboard', '/settings', '/onboarding']
    const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))

    if (!session && isProtectedPath) {
      const redirectUrl = new URL('/', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/|api/|.netlify/).*)'
  ]
} 