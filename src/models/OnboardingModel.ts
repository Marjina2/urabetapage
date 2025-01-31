import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

export type OnboardingStatus = 'not_started' | 'in_progress' | 'completed';

export interface OnboardingData {
  step: number;
  status: OnboardingStatus;
  data: {
    research_interests?: string[];
    preferred_tools?: string[];
    goals?: string;
    [key: string]: any;
  };
}

// Add event emitter for onboarding completion
export const onboardingEvents = {
  subscribers: new Set<() => void>(),
  
  subscribe(callback: () => void) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  },
  
  emit() {
    this.subscribers.forEach(callback => callback());
  }
};

export class OnboardingModel {
  static async getStatus(userId: string): Promise<OnboardingData | null> {
    try {
      console.log('Getting status for user:', userId);
      
      // First check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // If no profile exists, create one
      if (profileError && profileError.code === 'PGRST116') {
        console.log('No profile found, creating new profile');
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        // Create new profile
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: user.email,
            onboarding_step: 1,
            onboarding_completed: false,
            onboarding_status: 'not_started',
            created_at: new Date().toISOString()
          });

        if (createError) {
          console.error('Error creating profile:', createError);
          throw createError;
        }

        console.log('New profile created');
        return {
          step: 1,
          status: 'not_started',
          data: {}
        };
      }

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw profileError;
      }

      console.log('Existing profile found:', profile);
      return {
        step: profile.onboarding_step || 1,
        status: profile.onboarding_completed ? 'completed' : 
                (profile.onboarding_status || 'not_started'),
        data: profile.onboarding_data || {}
      };

    } catch (error) {
      console.error('Error in getStatus:', error);
      throw error;
    }
  }

  static async updateStatus(
    userId: string, 
    status: OnboardingStatus, 
    step: number, 
    data: any
  ) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          onboarding_status: status,
          onboarding_step: step,
          onboarding_data: data,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      return { error };
    } catch (error) {
      console.error('Error updating status:', error);
      return { error };
    }
  }

  static async completeOnboarding(userId: string, finalData: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          onboarding_completed: true,
          has_completed_setup: true,
          onboarding_status: 'completed',
          onboarding_data: finalData,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error completing onboarding:', error);
        throw new Error(`Failed to complete onboarding: ${error.message}`);
      }
      
      onboardingEvents.emit();
      return true;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return false;
    }
  }

  static async checkSetupStatus(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('has_completed_setup')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return !!data?.has_completed_setup;
    } catch (error) {
      console.error('Error checking setup status:', error);
      return false;
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }
} 