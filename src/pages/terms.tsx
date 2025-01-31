import { FC } from 'react'
import Head from 'next/head'
import Navigation from '@/components/Navigation'
import { motion } from 'framer-motion'

const Terms: FC = () => {
  return (
    <>
      <Head>
        <title>Terms of Service | URA</title>
        <meta name="description" content="URA Terms of Service - Read our terms and conditions" />
      </Head>

      <div className="min-h-screen bg-black text-white">
        <div className="relative z-50">
          <Navigation />
        </div>

        <div className="max-w-4xl mx-auto px-4 pt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#13131A] rounded-3xl p-10"
          >
            <h1 className="text-4xl font-bold mb-12 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Terms of Service
            </h1>

            <div className="space-y-12 text-gray-300">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">1. Service Usage</h2>
                <p className="text-gray-400 mb-4">
                  By using URA, you agree to:
                </p>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span>
                    Use the service for lawful purposes only
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span>
                    Not attempt to bypass security measures
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span>
                    Maintain accurate account information
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">2. Account Responsibilities</h2>
                <p className="text-gray-400 mb-4">
                  You are responsible for:
                </p>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span>
                    Maintaining account security
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span>
                    All activities under your account
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span>
                    Reporting unauthorized access
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">3. Service Modifications</h2>
                <p className="text-gray-400 mb-4">
                  URA reserves the right to:
                </p>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span>
                    Modify or discontinue services
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span>
                    Update terms and conditions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span>
                    Change pricing with notice
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">4. Referral Program</h2>
                <p className="text-gray-400 mb-4">
                  Our referral program terms:
                </p>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span>
                    Rewards are subject to verification
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span>
                    Limited to one account per user
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span>
                    May be modified or terminated
                  </li>
                </ul>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default Terms 