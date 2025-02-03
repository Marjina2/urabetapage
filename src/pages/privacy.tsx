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

        <div className="max-w-4xl mx-auto px-4 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#13131A] rounded-3xl p-10"
          >
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Privacy Policy
            </h1>

            <div className="text-sm text-purple-300 mb-12">
              Effective Date: February 05, 2025
            </div>

            <div className="space-y-8 text-gray-300">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
                <p className="text-gray-400">
                  This Privacy Policy explains how URA, owned by Gorz Industries, collects, uses, and protects your data.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-400">
                  <li>Account Data: Name, email, country.</li>
                  <li>Usage Data: Research queries, API usage logs.</li>
                  <li>Payment Data: Handled by Cashfree, URA does not store card details.</li>
                  <li>Analytics Data: Collected to improve services.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Data</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-400">
                  <li>To provide AI-powered research services.</li>
                  <li>To process payments and subscriptions.</li>
                  <li>To send automated newsletters (users can opt out).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-400">
                  <li>Data is securely stored in Supabase with encryption.</li>
                  <li>Strict access controls protect user information.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Sharing of Data</h2>
                <p className="text-gray-400 mb-3">URA DOES NOT sell or share user data, except:</p>
                <ul className="list-disc pl-5 space-y-2 text-gray-400">
                  <li>With payment processors (Cashfree) for transactions.</li>
                  <li>If legally required by government authorities.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies & Tracking</h2>
                <p className="text-gray-400">
                  URA uses cookies for login sessions and analytics.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. User Rights</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-400">
                  <li>Access & Correction: Users can view and update their data.</li>
                  <li>Opt-Out: Users can unsubscribe from newsletters.</li>
                  <li>Account Deletion: Users can request account deletion.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Compliance with Laws</h2>
                <p className="text-gray-400">
                  URA adheres to government regulations on data privacy and security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. Changes to This Policy</h2>
                <p className="text-gray-400">
                  URA may update this policy. Users will be notified of significant changes.
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