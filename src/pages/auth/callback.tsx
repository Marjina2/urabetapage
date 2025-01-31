import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        if (!router.isReady) return;

        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (!session) {
          console.error('No session found');
          router.push('/');
          return;
        }

        // Check if profile exists
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        if (!profile) {
          // Create new profile
          const { error: createError } = await supabase
            .from('profiles')
            .insert({
              id: session.user.id,
              email: session.user.email,
              full_name: session.user.user_metadata.full_name,
              avatar_url: session.user.user_metadata.avatar_url,
              has_completed_setup: false,
              onboarding_completed: false,
              onboarding_status: 'not_started',
              created_at: new Date().toISOString()
            });

          if (createError) throw createError;
          
          // Redirect to onboarding if new user
          router.push('/onboarding');
          return;
        }

        // Check if onboarding is completed
        if (!profile.onboarding_completed) {
          router.push('/onboarding');
          return;
        }

        // If everything is set up, redirect to dashboard
        router.push('/dashboard');

      } catch (error) {
        console.error('Error:', error);
        router.push('/');
      }
    }

    handleAuthCallback()
  }, [router.isReady])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="animate-spin text-purple-500">
        <i className="fas fa-spinner text-2xl"></i>
      </div>
    </div>
  )
} 