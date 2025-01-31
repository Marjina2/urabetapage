import { FC } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Navigation from '@/components/Navigation'

const NotFound: FC = () => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Page Not Found | URA</title>
      </Head>

      <div className="min-h-screen bg-black text-white">
        <div className="relative z-50">
          <Navigation />
        </div>

        <div className="max-w-4xl mx-auto px-4 pt-32 text-center">
          <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
          <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    </>
  )
}

export default NotFound 