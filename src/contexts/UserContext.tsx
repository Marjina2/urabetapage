import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { UserProfile } from '@/types/user';

interface UserContextType {
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  profile: null,
  loading: true,
  refreshProfile: async () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          email,
          avatar_url,
          phone_number,
          onboarding_data,
          onboarding_completed,
          onboarding_step,
          onboarding_status,
          has_completed_setup,
          created_at,
          updated_at
        `)
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      // Transform the data to match our UserProfile interface
      const transformedProfile: UserProfile = {
        id: profile.id,
        username: profile.username,
        email: profile.email,
        avatar_url: profile.avatar_url,
        first_name: profile.onboarding_data?.firstName || null,
        last_name: profile.onboarding_data?.lastName || null,
        phone_number: profile.phone_number,
        country_code: profile.onboarding_data?.country || null,
        postal_code: profile.onboarding_data?.postalCode || null,
        research_interests: profile.onboarding_data?.researchInterests || [],
        research_goals: profile.onboarding_data?.researchGoals || null,
        one_thing_to_find: profile.onboarding_data?.oneThingToFind || null,
        preferred_tools: profile.onboarding_data?.preferredTools || [],
        onboarding_completed: profile.onboarding_completed,
        onboarding_step: profile.onboarding_step,
        onboarding_status: profile.onboarding_status,
        has_completed_setup: profile.has_completed_setup
      };

      setProfile(transformedProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    fetchProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        fetchProfile();
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ profile, loading, refreshProfile: fetchProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext); 