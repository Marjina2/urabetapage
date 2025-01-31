import { FC, useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import RegisterModal from '@/components/RegisterModal'
import UserDropdown from '@/components/UserDropdown'
import { OnboardingModel, onboardingEvents } from '@/models/OnboardingModel'
import { toast } from 'react-hot-toast'

interface UserProfile {
  avatar_url: string | null
  username: string | null
}

const Navigation: FC = () => {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showFinishSetup, setShowFinishSetup] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setIsLoggedIn(true)
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('avatar_url, username')
            .eq('id', session.user.id)
            .single()
            
          if (profile) {
            setUserProfile(profile)
          }
        } else {
          setIsLoggedIn(false)
          setUserProfile(null)
        }
      } catch (error) {
        console.error('Error checking auth status:', error)
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsLoggedIn(true)
        const { data: profile } = await supabase
          .from('profiles')
          .select('avatar_url, username')
          .eq('id', session.user.id)
          .single()
          
        if (profile) {
          setUserProfile(profile)
        }
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false)
        setUserProfile(null)
      }
    })

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      subscription.unsubscribe()
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const updateNavbar = async () => {
      try {
        const user = await OnboardingModel.getCurrentUser();
        if (!user) {
          setShowFinishSetup(false);
          setIsLoggedIn(false);
          return;
        }

        setIsLoggedIn(true);

        const { data, error } = await supabase
          .from('profiles')
          .select('onboarding_completed, has_completed_setup')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching onboarding status:', error);
          return;
        }

        setShowFinishSetup(!data?.onboarding_completed && !data?.has_completed_setup);

      } catch (error) {
        console.error('Error updating navbar:', error);
      }
    };

    updateNavbar();

    // Subscribe to onboarding completion events
    const unsubscribe = onboardingEvents.subscribe(() => {
      updateNavbar();
    });

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      updateNavbar();
    });

    return () => {
      unsubscribe();
      subscription.unsubscribe();
    };
  }, []);

  const handleFinishSetup = async () => {
    try {
      setIsLoading(true);
      const user = await OnboardingModel.getCurrentUser();
      if (!user) {
        toast.error('Please sign in to complete setup');
        return;
      }

      // Create profile if it doesn't exist
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        const { error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            onboarding_step: 1,
            onboarding_completed: false,
            onboarding_status: 'not_started',
            created_at: new Date().toISOString()
          });

        if (createError) throw createError;
      }

      await router.push('/onboarding');
    } catch (error) {
      console.error('Error handling finish setup:', error);
      toast.error('Failed to start setup process');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      // Clear any stored onboarding data
      sessionStorage.removeItem('onboardingData');
      sessionStorage.removeItem('onboardingStep');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Reset local state
      setIsLoggedIn(false);
      setShowDropdown(false);
      setUserProfile(null);
      
      // Redirect to home page
      router.push('/');
      
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Toggling dropdown');
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const closeDropdown = () => setIsDropdownOpen(false);
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, []);

  const handleDashboardClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please sign in to access dashboard')
        return
      }

      // Check if onboarding is completed
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', session.user.id)
        .single()

      if (profileError) {
        console.error('Error checking profile:', profileError)
        return
      }

      if (!profile?.onboarding_completed) {
        await router.push('/onboarding')
        return
      }

      // Use window.location for hard navigation to dashboard
      window.location.href = '/dashboard'
      setIsDropdownOpen(false)
    } catch (error) {
      console.error('Navigation error:', error)
      toast.error('Failed to navigate to dashboard')
    }
  }

  return (
    <nav className="relative z-50 floating-nav">
      <Link href="/" className="logo hover:scale-110 transition-transform">URA</Link>
      <div className="nav-links">
        <Link 
          href="/plans"
          className={`nav-link hover:text-purple-400 transition-colors ${router.pathname === '/plans' ? 'bg-purple-500/10 text-white' : ''}`}
        >
          Plans
        </Link>
        <Link 
          href="/aboutura" 
          className="nav-link hover:text-purple-400 transition-colors"
        >
          About
        </Link>
        
        {isLoggedIn ? (
          <>
            {showFinishSetup && (
              <button
                onClick={handleFinishSetup}
                disabled={isLoading}
                className="finish-setup-button bg-gradient-to-r from-purple-600 to-pink-600 
                         text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity
                         disabled:opacity-50 flex items-center gap-2 relative group"
                title="Complete your profile setup to access all features"
              >
                {isLoading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-tasks"></i>
                )}
                Finish Setup
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                               px-3 py-1 text-sm bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 
                               transition-opacity whitespace-nowrap">
                  Complete setup to unlock all features
                </span>
              </button>
            )}

            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={toggleDropdown}
                className="user-profile-btn group"
              >
                <div className="relative">
                  {userProfile?.avatar_url ? (
                    <img 
                      src={userProfile.avatar_url} 
                      alt={userProfile.username || 'User'} 
                      className="w-8 h-8 rounded-full ring-2 ring-transparent 
                               group-hover:ring-purple-500/50 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 
                                  flex items-center justify-center text-purple-400
                                  ring-2 ring-transparent group-hover:ring-purple-500/50 
                                  transition-all duration-300">
                      <i className="fas fa-user"></i>
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 
                                rounded-full border-2 border-black"></div>
                </div>
                <span className="text-sm font-medium text-gray-300 
                               group-hover:text-white transition-colors">
                  {userProfile?.username || 'User'}
                </span>
                <i className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'} text-xs 
                             text-gray-400 group-hover:text-white transition-colors`}></i>
              </button>

              {isDropdownOpen && (
                <div onClick={e => e.stopPropagation()} className="dropdown-menu">
                  <div className="px-4 py-3 border-b border-purple-500/20">
                    <p className="text-sm text-gray-400">Signed in as</p>
                    <p className="text-sm font-medium text-white truncate">
                      {userProfile?.username || 'User'}
                    </p>
                  </div>
                  <Link 
                    href="/dashboard"
                    className="dropdown-item flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDropdownOpen(false);
                    }}
                  >
                    <i className="fas fa-columns w-5"></i>
                    Dashboard
                  </Link>
                  <Link 
                    href="/settings"
                    className="dropdown-item"
                  >
                    <i className="fas fa-cog w-5"></i>
                    Settings
                  </Link>
                  <div className="border-t border-purple-500/20">
                    <button
                      onClick={handleSignOut}
                      className="dropdown-item text-red-400 hover:bg-red-500/20"
                    >
                      <i className="fas fa-sign-out-alt w-5"></i>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <button 
            className="register-btn"
            onClick={() => router.push('/betaregistrations')}
          >
            JOIN BETA
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navigation 