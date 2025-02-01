import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(request: NextRequest) {
  // Skip middleware for static files and public routes
  const publicPaths = [
    '/_next',
    '/api',
    '/static',
    '/images',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap',
    '/join',
    '/',
    '/auth',
    '/login',
    '/register',
    '/terms',
    '/privacy',
    '/contact',
    '/index.html'
  ]

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
    '/((?!_next/static|_next/image|favicon.ico|images|static|api).*)'
  ]
} 