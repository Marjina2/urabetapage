import Head from 'next/head'
import Link from 'next/link'
import { FC, useEffect } from 'react'

const About: FC = () => {
  useEffect(() => {
    // Add animation classes after component mounts
    const elements = document.querySelectorAll('.fade-in-up')
    elements.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('show')
      }, i * 200) // Stagger the animations
    })
  }, [])

  return (
    <>
      <Head>
        <title>About Us | URA</title>
        <meta name="description" content="Learn about URA and Gorz Industries - Pioneering the future of AI-powered research assistance" />
        <meta property="og:title" content="About Us | URA" />
        <meta property="og:description" content="Learn about URA and Gorz Industries - Pioneering the future of AI-powered research assistance" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/uralogo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | URA" />
        <meta name="twitter:description" content="Learn about URA and Gorz Industries - Pioneering the future of AI-powered research assistance" />
      </Head>

      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <nav className="floating-nav">
          <Link href="/" className="logo hover:scale-110 transition-transform">URA</Link>
        </nav>

        {/* Animated background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-transparent"></div>

        <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 relative z-10">
          <h1 className="text-5xl font-bold mb-16 text-center fade-in-up">
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              About URA
            </span>
          </h1>

          <section aria-labelledby="team-heading">
            <h2 id="team-heading" className="text-3xl font-bold mb-16 text-center">
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Meet Our Team
              </span>
            </h2>

            {/* Main Team Section - Centered Layout */}
            <div className="flex flex-col items-center justify-center mb-32">
              {/* Founder & CEO */}
              <div className="text-center mb-16">
                <div className="relative w-40 h-40 mx-auto mb-6 group">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 
                              animate-pulse group-hover:animate-none group-hover:scale-105 transition-transform"></div>
                  <img 
                    src="/Shiraken12T.png" 
                    alt="Shiraken12T"
                    className="relative w-full h-full rounded-full object-cover border-4 border-purple-500
                            transform group-hover:scale-105 transition-all duration-500
                            hover:border-pink-500 hover:shadow-2xl hover:shadow-purple-500/50"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/150?text=S'
                    }}
                  />
                </div>
                <h2 className="text-2xl font-bold hover:text-purple-400 transition-colors">Shiraken12T</h2>
                <p className="text-purple-400/80 hover:text-pink-400 transition-colors">Founder & CEO</p>
              </div>

              {/* CEOs Row */}
              <div className="flex justify-center gap-32">
                {/* Aroike */}
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4 group">
                    <a 
                      href="https://www.instagram.com/obvention_abhi/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block relative cursor-pointer"
                    >
                      <img 
                        src="/aroike.jpg" 
                        alt="Aroike"
                        className="w-full h-full rounded-full object-cover border-4 border-purple-500/50
                                transform group-hover:scale-105 transition-all duration-500
                                hover:border-pink-500 hover:shadow-2xl hover:shadow-purple-500/50"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/150?text=A'
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 
                                  rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <i className="fab fa-instagram text-2xl text-white"></i>
                      </div>
                    </a>
                  </div>
                  <h3 className="text-xl font-semibold hover:text-purple-400 transition-colors">Aroike</h3>
                  <p className="text-purple-400/60 hover:text-pink-400 transition-colors">CEO</p>
                </div>

                {/* Coming Soon */}
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <div className="w-full h-full rounded-full bg-purple-900/20 flex items-center justify-center">
                      <span className="text-purple-400/50">TBA</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-400">Coming Soon</h3>
                  <p className="text-purple-400/60">CEO</p>
                </div>
              </div>
            </div>
          </section>

          <section aria-labelledby="partners-heading">
            <h2 id="partners-heading" className="text-3xl font-bold mb-16 text-center">
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Our Partners
              </span>
            </h2>
            <div className="flex justify-center">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4 group">
                  <a 
                    href="https://www.instagram.com/thevisionaryframe/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block relative cursor-pointer"
                  >
                    <img 
                      src="/thevisionaryframe.png" 
                      alt="The Visionary Frame"
                      className="w-full h-full rounded-full object-cover border-4 border-purple-500/50
                                transform group-hover:scale-105 transition-all duration-500
                                hover:border-pink-500 hover:shadow-2xl hover:shadow-purple-500/50"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/150?text=TVF'
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 
                                  rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <i className="fab fa-instagram text-2xl text-white"></i>
                    </div>
                  </a>
                </div>
                <h3 className="text-xl font-semibold hover:text-purple-400 transition-colors">The Visionary Frame</h3>
                <p className="text-purple-400/60 hover:text-pink-400 transition-colors">YouTube Partner</p>
              </div>
            </div>
          </section>
        </div>

        {/* Enhanced Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent animate-pulse"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(106,13,173,0.1),transparent_70%)]"></div>
        </div>
      </div>
    </>
  )
}

export default About 