import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(request: NextRequest) {
  try {
    // Don't run middleware on static files
    if (request.nextUrl.pathname.includes('.')) {
      return NextResponse.next()
    }

    const path = request.nextUrl.pathname
    const res = NextResponse.next()
    
    // Create Supabase client
    const supabase = createMiddlewareClient({ 
      req: request, 
      res 
    })

    // Check active session
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Middleware auth error:', error)
      // Clear invalid session
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Public paths that don't require authentication
    const publicPaths = ['/', '/auth/callback', '/login', '/register', '/terms', '/privacy']
    const isPublicPath = publicPaths.includes(path)

    // If public path, allow access
    if (isPublicPath) {
      return res
    }

    // If trying to access onboarding directly, allow it
    if (path === '/onboarding') {
      return res
    }

    // Protected paths that require authentication
    const protectedPaths = ['/dashboard', '/settings']
    const isProtectedPath = protectedPaths.some(p => path.startsWith(p))

    // If no session and trying to access protected route, redirect to home
    if (!session && isProtectedPath) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    // On error, allow the request to continue to avoid white pages
    return NextResponse.next()
  }
}

// Configure matcher to exclude static files
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
} 