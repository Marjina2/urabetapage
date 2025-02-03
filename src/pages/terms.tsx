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

        <div className="max-w-4xl mx-auto px-4 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#13131A] rounded-3xl p-10"
          >
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Terms of Service
            </h1>
            
            <div className="text-sm text-purple-300 mb-12">
              Effective Date: February 05, 2025
            </div>

            <div className="space-y-8 text-gray-300">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
                <p className="text-gray-400">
                  Welcome to URA, a research platform owned and operated by Gorz Industries. URA allows users to conduct 
                  AI-powered research, analyze topics, and generate reports. By accessing or using URA, you agree to these 
                  Terms of Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. Ownership & Eligibility</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-400">
                  <li>URA is owned by Gorz Industries.</li>
                  <li>You must be at least 10 years old to use URA.</li>
                  <li>No parental consent is required for users under 18.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. Account Registration & Security</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-400">
                  <li>Users must provide accurate and complete information.</li>
                  <li>Creating multiple accounts to exploit free plans is strictly prohibited.</li>
                  <li>Users are responsible for maintaining their account security.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Acceptable Use</h2>
                <p className="text-gray-400 mb-3">You agree NOT to:</p>
                <ul className="list-disc pl-5 space-y-2 text-gray-400">
                  <li>Use URA for illegal activities.</li>
                  <li>Abuse or exploit free-tier services by creating multiple accounts.</li>
                  <li>Reverse-engineer, scrape, or copy AI-generated content.</li>
                  <li>Exceed API request limits for non-permitted use.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Subscription & Payments</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-400">
                  <li>URA offers free and premium subscription plans.</li>
                  <li>Payments are processed via Cashfree and subject to their terms.</li>
                  <li>No refunds except in cases of double billing or technical issues.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Beta Program</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-400">
                  <li>Beta users understand that features may be experimental.</li>
                  <li>The first 100 beta users receive an extra 10% discount on paid plans upon launch.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Referral Program</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-400">
                  <li>Users can refer others and earn discounts on subscriptions.</li>
                  <li>Referral benefits apply only to eligible active users.</li>
                  <li>Gorz Industries reserves the right to modify or terminate the program.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Compliance with Government Laws</h2>
                <p className="text-gray-400">
                  URA follows applicable government laws and regulations regarding data privacy, security, and AI ethics.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. Limitation of Liability</h2>
                <p className="text-gray-400 mb-3">URA is provided "as is" without warranties. We are not liable for:</p>
                <ul className="list-disc pl-5 space-y-2 text-gray-400">
                  <li>AI-generated content inaccuracies.</li>
                  <li>Data loss due to third-party service failures.</li>
                  <li>Unauthorized access caused by user negligence.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">10. Termination of Service</h2>
                <p className="text-gray-400">
                  URA reserves the right to suspend or terminate accounts that violate these terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">11. Updates to the Terms</h2>
                <p className="text-gray-400">
                  URA may update these terms at any time. Continued use means you accept the changes.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default Terms 