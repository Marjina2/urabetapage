import { FC, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Navigation from '@/components/Navigation'
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'

const AboutURA: FC = () => {
  const router = useRouter()
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const features = [
    {
      icon: "🧠",
      title: "AI-Powered Research",
      description: "Advanced AI models working together to accelerate your research",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: "🔄",
      title: "Real-Time Collaboration",
      description: "Work seamlessly with your team in real-time",
      gradient: "from-blue-500 to-purple-500"
    },
    {
      icon: "📊",
      title: "Smart Analytics",
      description: "Visualize and analyze data with cutting-edge tools",
      gradient: "from-green-500 to-blue-500"
    },
    {
      icon: "🎯",
      title: "Precision Search",
      description: "Find exactly what you need with contextual understanding",
      gradient: "from-orange-500 to-red-500"
    }
  ]

  const values = [
    {
      title: "Innovation",
      description: "Pushing boundaries with cutting-edge AI research",
      icon: "💡",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      title: "Collaboration",
      description: "Building bridges between researchers worldwide",
      icon: "🤝",
      gradient: "from-green-500 to-teal-500"
    },
    {
      title: "Security",
      description: "Your research data, protected and private",
      icon: "🔒",
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      title: "Accessibility",
      description: "Making advanced research tools available to all",
      icon: "🌍",
      gradient: "from-purple-500 to-pink-500"
    }
  ]

  const handleGetStarted = () => {
    router.push('/')
  }

  return (
    <>
      <Head>
        <title>About URA | Next-Gen Research Assistant</title>
        <meta name="description" content="Learn about URA - The next generation AI-powered research assistant" />
      </Head>

      <div className="min-h-screen bg-black text-white relative overflow-hidden" ref={containerRef}>
        <Navigation />
        
        {/* Hero Section with Parallax */}
        <motion.section 
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1), transparent 60%)"
          }}
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          
          <motion.div 
            className="text-center z-10 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-6xl md:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Meet <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">URA</span>
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              The next generation AI-powered research assistant that transforms how you discover, analyze, and collaborate.
            </motion.p>
          </motion.div>

          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-purple-500 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: 0.2
                }}
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>
        </motion.section>

        {/* Features Grid */}
        <section className="py-20 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="bg-[#1C1C1E]/50 backdrop-blur-xl rounded-xl p-8 border border-purple-500/20
                           hover:border-purple-500/40 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`text-4xl mb-4 bg-gradient-to-r ${feature.gradient} bg-clip-text`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Values Section with Hover Effects */}
        <section className="py-20 px-4 relative bg-[#1C1C1E]/30">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              className="text-4xl font-bold text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Our Values
              </span>
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  className="relative group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 
                                rounded-xl blur-xl group-hover:opacity-100 opacity-0 transition-opacity"></div>
                  <div className="relative bg-[#1C1C1E]/50 backdrop-blur-xl rounded-xl p-6 border 
                                border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                    <div className={`text-4xl mb-4 bg-gradient-to-r ${value.gradient} bg-clip-text`}>
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                    <p className="text-gray-400">{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Research Tools Section */}
        <section className="py-20 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              className="text-4xl font-bold text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Powerful Research Tools
              </span>
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🔍",
                  title: "Smart Search",
                  description: "AI-powered search across multiple databases and sources",
                  gradient: "from-blue-500 to-cyan-500"
                },
                {
                  icon: "📊",
                  title: "Data Analysis",
                  description: "Advanced analytics and visualization tools",
                  gradient: "from-green-500 to-emerald-500"
                },
                {
                  icon: "🤖",
                  title: "AI Integration",
                  description: "Seamless integration with leading AI models",
                  gradient: "from-purple-500 to-pink-500"
                }
              ].map((tool, index) => (
                <motion.div
                  key={tool.title}
                  className="relative group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="relative bg-[#1C1C1E]/50 backdrop-blur-xl rounded-xl p-8 border 
                               border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                    <div className={`text-4xl mb-4 bg-gradient-to-r ${tool.gradient} bg-clip-text`}>
                      {tool.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{tool.title}</h3>
                    <p className="text-gray-400">{tool.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Add Stats Section */}
        <section className="py-20 px-4 relative bg-[#1C1C1E]/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { number: "10M+", label: "Research Papers" },
                { number: "50K+", label: "Active Users" },
                { number: "100+", label: "AI Models" },
                { number: "24/7", label: "Support" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                    {stat.number}
                  </h3>
                  <p className="text-gray-400 mt-2">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Add Testimonials Section */}
        <section className="py-20 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              className="text-4xl font-bold text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                What Researchers Say
              </span>
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "URA has revolutionized how I conduct research. The AI integration is seamless.",
                  author: "Dr. Sarah Chen",
                  role: "Research Scientist"
                },
                {
                  quote: "The collaboration features have made team research incredibly efficient.",
                  author: "Prof. James Miller",
                  role: "University Professor"
                },
                {
                  quote: "Data analysis that used to take weeks now takes hours with URA.",
                  author: "Dr. Michael Park",
                  role: "Data Scientist"
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={testimonial.author}
                  className="bg-[#1C1C1E]/50 backdrop-blur-xl rounded-xl p-8 border border-purple-500/20"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-bold text-white">{testimonial.author}</p>
                    <p className="text-purple-400">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 relative">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-8">
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Ready to Transform Your Research?
              </span>
            </h2>
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl
                       font-bold text-white shadow-lg hover:shadow-purple-500/25
                       transform hover:scale-105 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
            >
              Join Beta
            </motion.button>
          </motion.div>
        </section>
      </div>
    </>
  )
}

export default AboutURA 