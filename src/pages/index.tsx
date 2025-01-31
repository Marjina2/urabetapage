import Head from 'next/head'
import { FC, useState } from 'react'
import Link from 'next/link'
import RegisterModal from '@/components/RegisterModal'
import { useRouter } from 'next/router'
import Navigation from '@/components/Navigation'
import { motion, AnimatePresence } from 'framer-motion'

const Home: FC = () => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [showComingSoon, setShowComingSoon] = useState(false)
  const router = useRouter()

  const handleRegisterClick = () => {
    setIsRegisterOpen(true)
  }

  const handleCommunityClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowComingSoon(true)
    // Auto-hide after 3 seconds
    setTimeout(() => setShowComingSoon(false), 3000)
  }

  return (
    <>
      <Head>
        <title>URA</title>
        <meta name="description" content="Next generation digital innovation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="animated-background">
        <div className="grid"></div>
        <div className="particles"></div>
        <div className="streaks"></div>
      </div>

      <div className="noise-overlay"></div>

      <Navigation />

      <header id="home">
        <div className="hero">
          <div className="hero-text">
            <h1>
              U<span className="middle">R</span>A
            </h1>
            <div className="glitch-line"></div>
          </div>
          <div className="hero-subtitle">
            <span className="word-1">RESEARCH</span>
            <span className="word-2">LEARN</span>
            <span className="word-3">CREATE</span>
          </div>
        </div>
        <div className="cyber-grid">
          {[...Array(100)].map((_, i) => (
            <div key={i} className="grid-cell"></div>
          ))}
        </div>
      </header>

      <section className="feature-showcase">
        <div className="showcase-container">
          <div className="showcase-track">
            <div className="showcase-item">
              <div className="showcase-icon">
                <i className="fas fa-cloud"></i>
              </div>
              <div className="showcase-content">
                <h3>Seamless API Integration</h3>
                <p>Integrate any API with ease. Customize your research experience without any limits.</p>
              </div>
            </div>

            <div className="showcase-item">
              <div className="showcase-icon">
                <i className="fas fa-search"></i>
              </div>
              <div className="showcase-content">
                <h3>Instant Search & Recommendations</h3>
                <p>Get instant recommendations based on your research topics. The more you search, the smarter it gets!</p>
              </div>
            </div>

            <div className="showcase-item">
              <div className="showcase-icon">
                <i className="fas fa-cogs"></i>
              </div>
              <div className="showcase-content">
                <h3>Collaborative Research</h3>
                <p>Collaborate effortlessly with team members in real-time, sharing research, notes, and insights.</p>
              </div>
            </div>

            <div className="showcase-item">
              <div className="showcase-icon">
                <i className="fas fa-robot"></i>
              </div>
              <div className="showcase-content">
                <h3>Superior AI Model</h3>
                <p>Better than other AI models, get what you want in details</p>
              </div>
            </div>

            <div className="showcase-item">
              <div className="showcase-icon">
                <i className="fas fa-database"></i>
              </div>
              <div className="showcase-content">
                <h3>Up-to-Date Knowledge</h3>
                <p>More reliable, using the latest data to keep up with the world</p>
              </div>
            </div>

            <div className="showcase-item">
              <div className="showcase-icon">
                <i className="fas fa-bolt"></i>
              </div>
              <div className="showcase-content">
                <h3>Lightning Fast</h3>
                <p>Using AI to make everything faster</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="community-section">
        <div className="community-container">
          <h2>Join the community</h2>
          <p className="community-subtitle">Discover what our community has to say about their URA experience.</p>
          
          <div className="community-buttons">
            <a href="#" className="community-btn github" onClick={handleCommunityClick}>
              <i className="fab fa-github"></i> GitHub discussions
            </a>
            <a href="#" className="community-btn discord" onClick={handleCommunityClick}>
              <i className="fab fa-discord"></i> Discord
            </a>
          </div>

          {/* Coming Soon Popup */}
          <AnimatePresence>
            {showComingSoon && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="fixed inset-0 z-50 flex items-center justify-center px-4"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="bg-[#1C1C1E]/90 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20
                             shadow-2xl shadow-purple-500/20 max-w-md w-full
                             relative overflow-hidden"
                  >
                    {/* Background gradient effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
                    
                    {/* Animated dots */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 
                                  rounded-full blur-xl animate-pulse" />
                    <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 
                                  rounded-full blur-xl animate-pulse delay-300" />

                    <div className="relative">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          type: "spring",
                          stiffness: 260,
                          damping: 20 
                        }}
                        className="flex justify-center mb-6"
                      >
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 
                                    rounded-2xl flex items-center justify-center
                                    border border-purple-500/20 shadow-lg shadow-purple-500/10">
                          <span className="text-3xl">🚀</span>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-center space-y-4"
                      >
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 
                                   bg-clip-text text-transparent">
                          Community Coming Soon
                        </h3>
                        <p className="text-gray-400 text-sm">
                          We're building something amazing for our community.
                          <br />Stay tuned for the launch!
                        </p>
                      </motion.div>

                      {/* Progress bar */}
                      <motion.div 
                        className="mt-6 h-1 bg-purple-500/20 rounded-full overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <motion.div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ 
                            duration: 3,
                            ease: "easeInOut"
                          }}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                  onClick={() => setShowComingSoon(false)}
                />
              </>
            )}
          </AnimatePresence>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="user-info">
                <i className="fab fa-discord"></i>
                <span>@cyberdev.eth</span>
              </div>
              <p className="testimonial-text">
                "My next SaaS app and basically my whole job straight out vibing with URA. The integration capabilities are mind-blowing!"
              </p>
            </div>

            <div className="testimonial-card">
              <div className="user-info">
                <i className="fab fa-twitter"></i>
                <span>@0xAlice_</span>
              </div>
              <p className="testimonial-text">
                "Working with URA has been one of the best dev experiences I've had lately. Incredibly easy to set up, great documentation, and so many fewer hoops to jump through than the competition."
              </p>
            </div>

            <div className="testimonial-card">
              <div className="user-info">
                <i className="fab fa-instagram"></i>
                <span>@tech.samurai</span>
              </div>
              <p className="testimonial-text">
                "Using URA I'm really pleased on the power of research. Despite being a bit dubious about the whole backend as a service thing I have to say I really don't miss anything."
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-parallax">
        <div className="floating-elements">
          <div className="float-item research"></div>
          <div className="float-item graph"></div>
          <div className="float-item tech"></div>
        </div>
        
        <div className="cta-content">
          <h2>Ready to Dive In?</h2>
          <p>Take full control of your research. Explore, analyze, and make discoveries at your own pace.</p>
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl
                     font-bold text-white shadow-lg hover:shadow-purple-500/25
                     transform hover:scale-105 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/betaregistrations')}
          >
            JOIN BETA
          </motion.button>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">URA</div>
          <div className="footer-links">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/about">Team</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div className="social-links">
            <a 
              href="#" 
              className="hover:text-purple-400 transition-colors"
              onClick={handleCommunityClick}
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a 
              href="#" 
              className="hover:text-purple-400 transition-colors"
              onClick={handleCommunityClick}
            >
              <i className="fab fa-discord"></i>
            </a>
            <a 
              href="#" 
              className="hover:text-purple-400 transition-colors"
              onClick={handleCommunityClick}
            >
              <i className="fab fa-github"></i>
            </a>
            <a 
              href="#" 
              className="hover:text-purple-400 transition-colors"
              onClick={handleCommunityClick}
            >
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 GORZ INDUSTRIES</p>
          <p className="made-with-love">Made with ❤️ in India</p>
        </div>
      </footer>

      <RegisterModal 
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </>
  )
}

export default Home
