import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(request: NextRequest) {
  try {
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
    return NextResponse.redirect(new URL('/', request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api (API routes)
     * 2. /_next (Next.js internals)
     * 3. /static (static files)
     * 4. /favicon.ico, /sitemap.xml (public files)
     */
    '/((?!api|_next|static|favicon.ico|sitemap.xml).*)',
  ],
} 