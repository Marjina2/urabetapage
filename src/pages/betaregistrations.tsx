import { FC, useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Navigation from '@/components/Navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabaseClient'

interface BetaRegistration {
  full_name: string;
  email: string;
}

interface ReferralData {
  referrer_email: string;
  beta_registrations: BetaRegistration;
}

interface ReferralCount {
  full_name: string;
  email: string;
  count: number;
}

interface LeaderboardItem {
  rank: number;
  full_name: string;
  email: string;
  referral_count: number;
}

// Add this type for better error handling
interface SupabaseError {
  code: string;
  message: string;
  details?: any;
}

const BetaRegistrations: FC = () => {
  const router = useRouter()
  const { ref } = router.query
  const [isLoading, setIsLoading] = useState(false)
  const [currentField, setCurrentField] = useState(0)
  const [formData, setFormData] = useState({
    fullName: '',
    country: '',
    heardFrom: '',
    organization: '',
    email: ''
  })
  const [countdown, setCountdown] = useState(60);
  const [referrer, setReferrer] = useState<string | null>(null)
  const [referralStats, setReferralStats] = useState({ total: 0, completed: 0 })
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardItem[]>([])
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [referralCount, setReferralCount] = useState(0)

  const heardFromOptions = [
    'Instagram',
    'Facebook',
    'Search Engine',
    'YouTube',
    'Friend'
  ]

  useEffect(() => {
    const loadReferrer = async () => {
      const storedReferrer = localStorage.getItem('referrer')
      const urlRef = router.query.ref

      // Prioritize URL ref over stored ref
      const referrerToUse = urlRef || storedReferrer

      if (referrerToUse && typeof referrerToUse === 'string') {
        // Verify referrer exists in database
        const { data, error } = await supabase
          .from('beta_registrations')
          .select('email')
          .eq('email', referrerToUse.toLowerCase())
          .single()

        if (!error && data) {
          setReferrer(data.email)
          // Update URL if needed
          if (!urlRef) {
            router.replace(`/betaregistrations?ref=${encodeURIComponent(data.email)}`, undefined, { shallow: true })
          }
        }
      }
    }

    if (router.isReady) {
      loadReferrer()
    }
  }, [router.isReady, router.query.ref])

  const startCountdown = () => {
    let timeLeft = 60;
    const newTimer = setInterval(() => {
      if (!showLeaderboard) {
        timeLeft -= 1;
        setCountdown(timeLeft);
        
        if (timeLeft === 0) {
          if (timer) clearInterval(timer);
          router.push('/');
        }
      }
    }, 1000);
    
    setTimer(newTimer);
  };

  const handleSubmit = async () => {
    const toastId = toast.loading('Processing registration...')
    setIsLoading(true)

    try {
      // First check if email exists
      const { data: existingUser, error: checkError } = await supabase
        .from('beta_registrations')
        .select('email')
        .eq('email', formData.email.toLowerCase())
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking user:', checkError)
        toast.error('Something went wrong', { id: toastId })
        return
      }

      // If user doesn't exist, create registration
      if (!existingUser) {
        const { error: registrationError } = await supabase
          .from('beta_registrations')
          .insert([{
            full_name: formData.fullName,
            country: formData.country,
            heard_from: formData.heardFrom,
            organization: formData.organization,
            email: formData.email.toLowerCase(),
            status: 'pending',
            registered_at: new Date().toISOString()
          }])

        if (registrationError) {
          throw registrationError
        }
      }

      // Handle referral if exists
      if (referrer) {
        // Check if referral already exists
        const { data: existingReferral, error: referralCheckError } = await supabase
          .from('referrals')
          .select('*')
          .eq('referrer_email', referrer)
          .eq('referred_email', formData.email.toLowerCase())
          .single()

        if (referralCheckError && referralCheckError.code !== 'PGRST116') {
          console.error('Error checking referral:', referralCheckError)
        }

        // Only create referral if it doesn't exist
        if (!existingReferral) {
          const { error: referralError } = await supabase
            .from('referrals')
            .insert([{
              referrer_email: referrer,
              referred_email: formData.email.toLowerCase(),
              status: 'completed',
              created_at: new Date().toISOString()
            }])

          if (referralError) {
            console.error('Referral error:', referralError)
            // Don't fail the registration if referral fails
          } else {
            // Trigger leaderboard update
            fetchLeaderboard()
          }
        }
      }

      setCurrentField(5)
      startCountdown()
      toast.success('Registration successful!', { id: toastId })

    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Something went wrong', { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

  const getReferralLink = () => {
    const baseUrl = window.location.origin
    return `${baseUrl}/join/${formData.email}`
  }

  const checkReferralStats = async (email: string) => {
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_email', email)

    if (error) {
      console.error('Error fetching referral stats:', error)
      return { total: 0, completed: 0 }
    }

    const total = data.length
    const completed = data.filter(ref => ref.status === 'completed').length

    return { total, completed }
  }

  const isCurrentFieldValid = () => {
    const field = formFields[currentField].field
    const value = formData[field as keyof typeof formData]
    
    switch (field) {
      case 'fullName':
        return value.trim().length >= 2
      case 'country':
        return value.trim().length >= 2
      case 'heardFrom':
        return value.trim().length > 0
      case 'organization':
        if (value.startsWith('Student') || value.startsWith('Hobby')) {
          return true
        }
        if (value.startsWith('Team:') || value.startsWith('Organization:')) {
          return value.split(':')[1]?.trim().length >= 2
        }
        return false
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      default:
        return false
    }
  }

  const formFields = [
    {
      label: "What's your name?",
      field: "fullName",
      type: "text",
      placeholder: "Enter your full name",
      component: (
        <input
          type="text"
          required
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className="w-full bg-[#2C2C2E] border border-purple-500/20 rounded-lg px-4 py-3
                   hover:border-purple-500/40 focus:border-purple-500 
                   transition-all duration-300 text-white"
          placeholder="Enter your full name"
        />
      )
    },
    {
      label: "Where are you from?",
      field: "country",
      type: "text",
      placeholder: "Enter your country",
      component: (
        <input
          type="text"
          required
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          className="w-full bg-[#2C2C2E] border border-purple-500/20 rounded-lg px-4 py-3
                   hover:border-purple-500/40 focus:border-purple-500 
                   transition-all duration-300 text-white"
          placeholder="Enter your country"
        />
      )
    },
    {
      label: "How did you find us?",
      field: "heardFrom",
      type: "select",
      component: (
        <motion.div
          className="grid grid-cols-2 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {heardFromOptions.map((option) => (
            <motion.button
              key={option}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-lg border ${
                formData.heardFrom === option 
                  ? 'border-purple-500 bg-purple-500/20' 
                  : 'border-purple-500/20 hover:border-purple-500/40'
              } transition-all duration-300`}
              onClick={() => setFormData({ ...formData, heardFrom: option })}
            >
              {option}
            </motion.button>
          ))}
        </motion.div>
      )
    },
    {
      label: "What's your organization?",
      field: "organization",
      type: "select",
      component: (
        <div className="space-y-6">
          <motion.div
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {['Student', 'Hobby', 'Team', 'Organization'].map((option) => (
              <motion.button
                key={option}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-lg border ${
                  formData.organization.startsWith(option)
                    ? 'border-purple-500 bg-purple-500/20' 
                    : 'border-purple-500/20 hover:border-purple-500/40'
                } transition-all duration-300`}
                onClick={() => {
                  if (option === 'Student' || option === 'Hobby') {
                    setFormData({ ...formData, organization: option })
                  } else {
                    setFormData({ ...formData, organization: `${option}:` })
                  }
                }}
              >
                {option}
              </motion.button>
            ))}
          </motion.div>

          <AnimatePresence>
            {(formData.organization.startsWith('Team:') || 
              formData.organization.startsWith('Organization:')) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <input
                  type="text"
                  required
                  value={formData.organization.split(':')[1] || ''}
                  onChange={(e) => {
                    const prefix = formData.organization.split(':')[0]
                    setFormData({ 
                      ...formData, 
                      organization: `${prefix}:${e.target.value}` 
                    })
                  }}
                  className="w-full bg-[#2C2C2E] border border-purple-500/20 rounded-lg px-4 py-3
                           hover:border-purple-500/40 focus:border-purple-500 
                           transition-all duration-300 text-white"
                  placeholder={`Enter your ${formData.organization.split(':')[0].toLowerCase()} name`}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )
    },
    {
      label: "What's your email?",
      field: "email",
      type: "email",
      placeholder: "Enter your email address",
      component: (
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full bg-[#2C2C2E] border border-purple-500/20 rounded-lg px-4 py-3
                   hover:border-purple-500/40 focus:border-purple-500 
                   transition-all duration-300 text-white"
          placeholder="Enter your email address"
        />
      )
    }
  ]

  const fetchLeaderboard = async () => {
    try {
      const { data: referralData, error: referralError } = await supabase
        .from('referrals')
        .select(`
          referrer_email,
          beta_registrations!referrals_referrer_email_fkey (
            full_name,
            email
          )
        `)
        .eq('status', 'completed')

      if (referralError) {
        console.error('Error fetching referrals:', referralError)
        return
      }

      if (!referralData?.length) {
        setLeaderboardData([])
        return
      }

      // Process referrals with proper type checking
      const referralMap = new Map<string, { full_name: string; count: number }>()
      
      referralData.forEach((referral: any) => {
        const email = referral.referrer_email
        const referrerInfo = referral.beta_registrations

        if (!referralMap.has(email) && referrerInfo && typeof referrerInfo.full_name === 'string') {
          referralMap.set(email, {
            full_name: referrerInfo.full_name || email,
            count: 0
          })
        }

        const current = referralMap.get(email)
        if (current) {
          current.count++
          referralMap.set(email, current)
        }
      })

      // Convert to leaderboard format
      const leaderboard = Array.from(referralMap.entries())
        .map(([email, data]) => ({
          email,
          full_name: data.full_name,
          referral_count: data.count,
          rank: 0
        }))
        .sort((a, b) => b.referral_count - a.referral_count)
        .map((item, index) => ({
          ...item,
          rank: index + 1
        }))

      setLeaderboardData(leaderboard)
    } catch (error) {
      console.error('Error processing leaderboard:', error)
    }
  }

  useEffect(() => {
    if (showLeaderboard) {
      fetchLeaderboard()
    }
  }, [showLeaderboard])

  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  return (
    <>
      <Head>
        <title>Join URA Beta | Next-Gen Research Assistant</title>
        <meta name="description" content="Register for URA's beta program and be among the first to experience the future of research" />
      </Head>

      <div className="h-screen overflow-hidden bg-black text-white relative">
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20" />
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-500 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 2, 1],
                opacity: [0.1, 0.5, 0.1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        <div className="relative z-50">
          <Navigation />
        </div>

        <div className="relative z-10 h-screen flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-xl bg-[#1C1C1E]/50 backdrop-blur-xl rounded-[2rem] p-8 border border-purple-500/20
                     shadow-xl shadow-purple-500/10"
          >
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                if (currentField === formFields.length - 1) {
                  handleSubmit()
                }
              }} 
              className="space-y-6"
            >
              <AnimatePresence mode="wait">
                {currentField < 5 ? (
                  <motion.div
                    key={currentField}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <motion.label
                      className="block text-2xl font-medium text-white mb-4 text-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {formFields[currentField].label}
                    </motion.label>
                    
                    {formFields[currentField].component}

                    <div className="flex justify-between mt-8">
                      {currentField > 0 && (
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-2 rounded-full border border-purple-500/20 
                                   hover:border-purple-500/40 transition-all duration-300"
                          onClick={() => setCurrentField(Math.max(0, currentField - 1))}
                        >
                          Back
                        </motion.button>
                      )}
                      
                      <motion.button
                        type="button"
                        whileHover={{ scale: isCurrentFieldValid() ? 1.05 : 1 }}
                        whileTap={{ scale: isCurrentFieldValid() ? 0.95 : 1 }}
                        className={`px-6 py-2 rounded-full transition-all duration-300 ${
                          isCurrentFieldValid()
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/25'
                            : 'bg-gray-600 cursor-not-allowed opacity-50'
                        } ${currentField === 0 ? 'ml-auto' : ''}`}
                        onClick={() => {
                          if (!isCurrentFieldValid()) return
                          
                          if (currentField === formFields.length - 1) {
                            handleSubmit()
                          } else {
                            setCurrentField(currentField + 1)
                          }
                        }}
                        disabled={!isCurrentFieldValid() || isLoading}
                      >
                        {isLoading ? 'Submitting...' : currentField === formFields.length - 1 ? 'Submit' : 'Next'}
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="text-4xl mb-4"
                    >
                      🎉
                    </motion.div>
                    <h2 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                      Thank you for joining!
                    </h2>
                    <div className="space-y-3">
                      <p className="text-gray-400 text-sm">We'll be in touch soon.</p>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 p-4 rounded-xl bg-[#1C1C2E] border border-purple-500/20"
                      >
                        <div className="text-base font-medium text-purple-400 mb-3 flex items-center justify-center gap-2">
                          <span>🎁</span>
                          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Rewards
                          </span>
                        </div>
                        <div className="space-y-2 text-gray-200 text-center text-sm">
                          <p className="flex items-center justify-center gap-2">
                            <span className="text-purple-400">✧</span>
                            <span className="font-light">7-Day Free Trial of Premium</span>
                          </p>
                          <p className="flex items-center justify-center gap-2">
                            <span className="text-purple-400">✧</span>
                            <span className="font-light">20% Off Monthly & Yearly Plans</span>
                          </p>
                          <p className="flex items-center justify-center gap-2">
                            <span className="text-purple-400">✧</span>
                            <span className="font-light">Exclusive "Founding Member" Badge</span>
                          </p>
                          <p className="flex items-center justify-center gap-2">
                            <span className="text-purple-400">✧</span>
                            <span className="font-light">Early Access to New Features</span>
                          </p>
                        </div>
                        <p className="mt-3 text-xs text-purple-300 italic text-center font-light">
                          "Only the top 100 referrers will unlock these rewards!"
                        </p>

                        {/* Referral Link Section */}
                        <div className="mt-4 p-3 bg-purple-500/5 rounded-lg border border-purple-500/20">
                          <p className="text-xs text-purple-300 mb-2">Your Unique Referral Link:</p>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              readOnly
                              value={getReferralLink()}
                              className="flex-1 bg-[#1C1C2E] border border-purple-500/20 rounded px-2 py-1.5 text-xs text-gray-300 font-mono"
                            />
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(getReferralLink());
                                toast.success('Referral link copied!');
                              }}
                              className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 rounded text-purple-300 text-xs transition-colors"
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      </motion.div>
                      
                      {/* Countdown Timer */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-4 text-xs text-gray-400"
                      >
                        {showLeaderboard ? (
                          'Timer paused while viewing leaderboard'
                        ) : (
                          <>Redirecting to home in <span className="text-purple-400">{countdown}</span> seconds</>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {currentField < 5 && (
                <motion.div className="h-1 bg-purple-500/20 rounded-full mt-8">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                    animate={{ width: `${(currentField / formFields.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowLeaderboard(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#1C1C2E] rounded-xl p-6 w-full max-w-md border border-purple-500/20
                      shadow-xl shadow-purple-500/10 max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                URA Referral Leaderboard
              </h3>
              <button
                onClick={() => setShowLeaderboard(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white mb-6">
                URA Referral Leaderboard
              </h2>

              <div className="space-y-3">
                {leaderboardData.length > 0 ? (
                  leaderboardData.map((item) => (
                    <div
                      key={item.email}
                      className={`flex items-center gap-4 p-4 rounded-lg 
                        ${item.email === formData.email 
                          ? 'bg-purple-500/20 border border-purple-500/30' 
                          : 'bg-purple-500/5 border border-purple-500/10'}`}
                    >
                      <div className="text-lg font-bold text-purple-400 w-8">
                        #{item.rank}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">
                          {item.full_name}
                          {item.email === formData.email && (
                            <span className="ml-2 text-sm text-purple-400">(You)</span>
                          )}
                        </div>
                      </div>
                      <div className="text-purple-300 font-medium">
                        {item.referral_count} {item.referral_count === 1 ? 'referral' : 'referrals'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    No referrals yet. Be the first to refer!
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

export default BetaRegistrations 