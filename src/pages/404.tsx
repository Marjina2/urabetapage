import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

export default function Custom404() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home page after a short delay
    const timeout = setTimeout(() => {
      router.push('/')
    }, 3000)

    return () => clearTimeout(timeout)
  }, [router])

  return (
    <>
      <Head>
        <title>404 - Page Not Found | URA</title>
        <meta name="description" content="Page not found" />
      </Head>

      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            404 - Page Not Found
          </h1>
          <p className="text-gray-400 mb-8">
            Redirecting to home page...
          </p>
          <Link 
            href="/"
            className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
          >
            Go Home
          </Link>
        </div>
      </div>
    </>
  )
} 