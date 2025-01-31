import { FC } from 'react'
import Head from 'next/head'
import Navigation from '@/components/Navigation'

const Dashboard: FC = () => {
  return (
    <>
      <Head>
        <title>Dashboard | URA</title>
      </Head>

      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-400">Coming soon...</p>
        </div>
      </div>
    </>
  )
}

export default Dashboard 