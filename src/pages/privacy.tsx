import { FC } from 'react'
import Head from 'next/head'
import Navigation from '@/components/Navigation'
import { motion } from 'framer-motion'

const Privacy: FC = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy | URA</title>
        <meta name="description" content="URA Privacy Policy - Learn how we protect your data" />
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
              Privacy Policy
            </h1>

            <div className="space-y-12 text-gray-300">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">Data Collection</h2>
                <p className="text-gray-400 mb-4">
                  We collect minimal personal information necessary to provide our services:
                </p>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span>
                    Name and email for account creation
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span>
                    Usage data to improve our services
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span>
                    Referral information for our rewards program
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">Data Protection</h2>
                <p className="text-gray-400 mb-4">
                  Your data is protected using industry-standard encryption and security measures:
                </p>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span>
                    End-to-end encryption for sensitive data
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span>
                    Regular security audits
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span>
                    Strict access controls
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">Your Rights</h2>
                <p className="text-gray-400 mb-4">
                  You have the right to:
                </p>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span>
                    Access your personal data
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span>
                    Request data deletion
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span>
                    Opt-out of marketing communications
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span>
                    Update your information
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">Contact Us</h2>
                <p className="text-gray-400 mb-4">
                  For privacy-related inquiries, contact us at:
                  <a href="mailto:privacy@ura.ai" className="text-purple-400 hover:text-purple-300 ml-2">
                    privacy@ura.ai
                  </a>
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default Privacy 