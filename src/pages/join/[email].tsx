import { FC } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Navigation from '@/components/Navigation'

const JoinPage: FC = () => {
  const router = useRouter()
  const { email } = router.query

  return (
    <>
      <Head>
        <title>Join | URA</title>
        <meta name="description" content="Join URA" />
      </Head>

      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-400">Join page coming soon...</p>
        </div>
      </div>
    </>
  )
}

export default JoinPage 