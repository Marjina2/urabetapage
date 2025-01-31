import { FC, useState } from 'react'
import Head from 'next/head'
import Navigation from '@/components/Navigation'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'

const Contact: FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Message sent successfully!')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Head>
        <title>Contact Us | URA</title>
        <meta name="description" content="Contact URA - Get in touch with our team" />
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
              Contact Us
            </h1>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">Get in Touch</h2>
                  <p className="text-gray-400">
                    Have questions? We'd love to hear from you. Send us a message
                    and we'll respond as soon as possible.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-gray-400">
                    <span className="text-purple-400">📧</span>
                    <a href="mailto:support@ura.ai" className="hover:text-purple-400 transition-colors">
                      support@ura.ai
                    </a>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-400">
                    <span className="text-purple-400">🌐</span>
                    <a href="https://ura.ai" className="hover:text-purple-400 transition-colors">
                      ura.ai
                    </a>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#1C1C1E] border-none rounded-lg px-4 py-3
                             focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#1C1C1E] border-none rounded-lg px-4 py-3
                             focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#1C1C1E] border-none rounded-lg px-4 py-3
                             focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full bg-[#1C1C1E] border-none rounded-lg px-4 py-3
                             focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 
                           rounded-lg text-white font-medium transition-all duration-300
                           hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default Contact 