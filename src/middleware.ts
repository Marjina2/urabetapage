import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(request: NextRequest) {
  // Update publicPaths to explicitly include join routes
  const publicPaths = [
    '/_next',
    '/api',
    '/static',
    '/images',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap',
    '/join',  // Base join path
    '/terms',
    '/privacy',
    '/contact',
    '/index.html'
  ]

  // Special handling for join/[email] routes
  if (request.nextUrl.pathname.startsWith('/join/')) {
    return NextResponse.next()
  }

  if (publicPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Handle authentication
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res })
    const { data: { session } } = await supabase.auth.getSession()

    // Protected paths that require authentication
    const protectedPaths = ['/dashboard', '/settings', '/onboarding']
    const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))

    if (!session && isProtectedPath) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|static|api|join/.*|join).*)'
  ]
} 