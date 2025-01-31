import { FC, useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from "framer-motion";
import ApiSettingsPopup from '@/components/ApiSettingsPopup';
import styles from '@/styles/Dashboard.module.css';
import Navigation from '@/components/Navigation';

const DashboardPage: FC = () => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<any>(null)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isApiPopupOpen, setIsApiPopupOpen] = useState(false)
  const [hasConfiguredApis, setHasConfiguredApis] = useState(false)
  const [showApiPrompt, setShowApiPrompt] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.push('/')
          return
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', session.user.id)
          .single()

        if (!profile?.onboarding_completed) {
          router.push('/onboarding')
          return
        }

        // Check API configuration
        const { data: apiKeys } = await supabase
          .from('api_keys')
          .select('*')
          .eq('user_id', session.user.id)

        setHasConfiguredApis((apiKeys || []).length > 0)
        setIsLoading(false)
      } catch (error) {
        console.error('Error checking auth:', error)
        router.push('/')
      }
    }

    checkAuth()
  }, [router])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    try {
      const data = await fetchResults(searchQuery)
      setResults(data)
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Search failed')
    }
  }

  const handleTextHighlight = () => {
    const selection = window.getSelection()?.toString();
    if (selection) {
      setHighlightedText(selection);
      setIsPanelOpen(true); // Open explanation panel
    }
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setHighlightedText("");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openApiPopup = () => {
    setIsApiPopupOpen(true);
    setIsDropdownOpen(false); // Close dropdown when opening popup
  };

  const closeApiPopup = () => {
    setIsApiPopupOpen(false);
  };

  const handleSearchBarClick = () => {
    if (!hasConfiguredApis) {
      setShowApiPrompt(true);
      toast.error(
        <div className="flex flex-col gap-2">
          <p>Please configure at least one AI model API to start searching</p>
          <button
            onClick={() => {
              setIsApiPopupOpen(true);
              toast.dismiss();
            }}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Configure APIs
          </button>
        </div>,
        {
          duration: 5000,
          style: {
            background: '#1C1C1E',
            color: '#fff',
            border: '1px solid rgba(139, 92, 246, 0.2)',
          }
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Let the useEffect redirect handle this
  }

  return (
    <>
      <Head>
        <title>Dashboard | URA</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-black to-[#1C1C1E] text-white relative">
        <Navigation />
        
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-transparent"></div>

        {/* Settings Button */}
        <div className="absolute top-6 right-6 z-50">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-purple-400 hover:text-purple-300 transition-colors p-3 rounded-full bg-[#252544] border border-purple-500/20"
          >
            <i className="fas fa-cog fa-lg"></i>
          </motion.button>
          
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-[#1C1C1E] rounded-lg shadow-xl border border-purple-500/20 overflow-hidden"
              >
                <a href="/account-settings" className="block px-4 py-3 text-sm text-gray-300 hover:bg-purple-500/20 transition-all duration-300">
                  Account Settings
                </a>
                <a onClick={openApiPopup} className="block px-4 py-3 text-sm text-gray-300 hover:bg-purple-500/20 transition-all duration-300 cursor-pointer">
                  API Key
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
          <motion.div 
            className="w-full max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.h1 
              variants={itemVariants}
              className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
            >
              Ask Anything
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-lg mb-8 text-gray-400"
            >
              Your AI-powered research assistant
            </motion.p>

            {/* Search Bar */}
            <motion.div
              variants={itemVariants}
              className={styles.searchBar}
              onClick={handleSearchBarClick}
            >
              <input
                type="text"
                placeholder={hasConfiguredApis ? "Ask something..." : "Configure AI model APIs to start searching"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={!hasConfiguredApis}
                className={`${styles.searchInput} ${
                  !hasConfiguredApis ? 'cursor-not-allowed opacity-75' : ''
                }`}
              />
              <motion.button
                whileHover={hasConfiguredApis ? { scale: 1.05 } : {}}
                whileTap={hasConfiguredApis ? { scale: 0.95 } : {}}
                onClick={handleSearch}
                disabled={!hasConfiguredApis || !searchQuery.trim()}
                className={`${styles.searchButton} ${
                  !hasConfiguredApis ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-600'
                }`}
              >
                Search
              </motion.button>
            </motion.div>

            {/* API Configuration Prompt */}
            <AnimatePresence>
              {showApiPrompt && !hasConfiguredApis && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-[#252544] border border-purple-500/20 rounded-lg p-6 mb-8"
                >
                  <h3 className="text-xl font-bold mb-2">Configure AI Models</h3>
                  <p className="text-gray-400 mb-4">
                    To start searching, please configure at least one of the following AI models:
                  </p>
                  <ul className="text-left space-y-2 mb-4">
                    <li className="flex items-center gap-2">
                      <i className="fas fa-check text-green-400"></i>
                      <span>Gemini Flash API (Free)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-check text-green-400"></i>
                      <span>OpenAI GPT-4 (Premium)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-check text-green-400"></i>
                      <span>Claude (Anthropic)</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => setIsApiPopupOpen(true)}
                    className="bg-purple-500 text-white px-6 py-3 rounded-full hover:bg-purple-600 transition-colors"
                  >
                    Configure APIs
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results */}
            <AnimatePresence>
              {results && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="w-full space-y-4"
                >
                  {['Sources', 'Report', 'Citations', 'Related Topics'].map((section, index) => (
                    <motion.div
                      key={section}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-[#252544] border border-purple-500/20 rounded-lg p-6 shadow-lg hover:border-purple-500/40 transition-all duration-300"
                    >
                      <h2 className="text-xl font-bold mb-4 text-white">{section}</h2>
                      {/* Render section content */}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* API Settings Popup */}
        <AnimatePresence>
          {isApiPopupOpen && (
            <ApiSettingsPopup 
              onClose={() => {
                setIsApiPopupOpen(false)
                setShowApiPrompt(false)
              }}
              onApiConfigured={() => setHasConfiguredApis(true)}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

// Mock function to simulate fetching results
const fetchResults = async (query: string) => {
  // Replace this with actual API calls
  return {
    sources: ['Source 1', 'Source 2', 'Source 3'],
    report: 'This is a generated summary based on your query.',
    citations: ['Citation 1', 'Citation 2'],
    relatedTopics: ['Related Topic 1', 'Related Topic 2'],
  };
};

export default DashboardPage 