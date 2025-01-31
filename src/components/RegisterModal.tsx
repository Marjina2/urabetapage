import { FC, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { Session } from '@supabase/supabase-js'

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
}

const RegisterModal: FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open')
      document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`
    } else {
      document.body.classList.remove('modal-open')
      document.body.style.paddingRight = ''
    }
    
    return () => {
      document.body.classList.remove('modal-open')
      document.body.style.paddingRight = ''
    }
  }, [isOpen])

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (!isLogin) {
        // Register
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        })

        if (error) {
          if (error.message.toLowerCase().includes('email already registered')) {
            setError('This email is already registered. Please sign in instead.')
            setIsLogin(true)
          } else {
            setError(error.message)
          }
          return
        }

        onClose()
        // Check if user exists in profiles table
        const { data: sessionData } = await supabase.auth.getSession()
        const session = sessionData?.session

        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('has_completed_onboarding')
            .eq('id', session.user.id)
            .single()

          if (profile) {
            if (!profile.has_completed_onboarding) {
              router.push('/onboarding')
            } else {
              router.push('/dashboard')
            }
          }
        } else {
          console.error('No valid session found')
          toast.error('You need to be logged in to register.')
        }
      } else {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        if (error) {
          setError(error.message)
          return
        }

        onClose()
        // Check onboarding status after login
        const { data: sessionData } = await supabase.auth.getSession()
        const session = sessionData?.session

        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('has_completed_onboarding')
            .eq('id', session.user.id)
            .single()

          if (profile) {
            if (!profile.has_completed_onboarding) {
              router.push('/onboarding')
            } else {
              router.push('/dashboard')
            }
          }
        }
      }
    } catch (err) {
      console.error('Auth error:', err)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      
      if (error) throw error
      
      if (data?.url) {
        onClose()
        window.location.href = data.url
      }
    } catch (err) {
      console.error('Google sign in error:', err)
      setError('Failed to sign in with Google')
      toast.error('Failed to sign in with Google')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white 
                    transition-colors text-xl"
          onClick={onClose}
        >
          <i className="fas fa-times"></i>
        </button>

        <h2 className="text-2xl font-bold mb-2 text-center">
          <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            {isLogin ? 'Welcome Back' : 'Join URA'}
          </span>
        </h2>
        
        <p className="text-gray-400 text-center mb-6">
          {isLogin ? 'Sign in to continue' : 'Join our community and explore the future of AI'}
        </p>

        <div className="space-y-6">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-[#2C2C2E] text-white rounded-xl px-4 py-3 hover:bg-[#3C3C3E] transition-all duration-300 border border-purple-500/20 hover:border-purple-500/40 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </div>
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-purple-500/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#1C1C1E] text-gray-400 font-medium">or</span>
            </div>
          </div>

          <form onSubmit={handleEmailSignIn} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3">
                <p className="text-red-500 text-sm text-center">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/5 border border-purple-500/20 rounded-lg px-4 py-3
                           text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50
                           focus:bg-white/10 transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-[#2C2C2E] border border-purple-500/20 rounded-xl px-4 py-3 hover:border-purple-500/40 focus:border-purple-500 transition-all duration-300 ease-in-out text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                placeholder="Create a password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-500 text-white rounded-xl px-4 py-3 hover:bg-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
                setFormData({ email: '', password: '' })
              }}
              className="text-purple-400 hover:text-purple-300 text-sm"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>

          <div className="text-center text-xs text-gray-400">
            By continuing, you agree to our
            <a href="/terms" className="text-purple-400 hover:text-purple-300 ml-1">
              Terms of Service
            </a>
            {' '}and{' '}
            <a href="/privacy" className="text-purple-400 hover:text-purple-300">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterModal 