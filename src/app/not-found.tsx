import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
        404 - Page Not Found
      </h1>
      <p className="text-gray-400 mb-8">
        The page you're looking for doesn't exist.
      </p>
      <Link 
        href="/"
        className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
      >
        Go Home
      </Link>
    </div>
  )
} 