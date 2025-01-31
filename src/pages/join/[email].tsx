import { FC } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Navigation from '@/components/Navigation'
import { GetStaticProps, GetStaticPaths } from 'next'

interface Props {
  email: string
}

const JoinPage: FC<Props> = ({ email: initialEmail }) => {
  const router = useRouter()
  
  // Handle fallback state
  if (router.isFallback) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const { email = initialEmail } = router.query

  return (
    <>
      <Head>
        <title>Join | URA</title>
        <meta name="description" content="Join URA" />
      </Head>

      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-4xl font-bold mb-8">Welcome!</h1>
          <p className="text-gray-400">
            {email ? `Joining with email: ${email}` : 'Loading...'}
          </p>
        </div>
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Pre-render these paths at build time
  const paths = [
    { params: { email: 'default' } },
    { params: { email: 'signup' } }
  ]

  return {
    paths,
    // Return 404 for non-existent paths
    fallback: false
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const email = params?.email as string

  return {
    props: {
      email
    }
  }
}

export default JoinPage 