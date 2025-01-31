import { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';
import { OnboardingModel, OnboardingStatus } from '@/models/OnboardingModel';
import { useUser } from '@/contexts/UserContext';

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserDropdown: FC<UserDropdownProps> = ({ isOpen, onClose }) => {
  const { profile, loading } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus>('not_started');

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const user = await OnboardingModel.getCurrentUser();
      if (!user) {
        router.push('/');
        return;
      }

      const status = await OnboardingModel.getStatus(user.id);
      if (!status) throw new Error('Failed to get status');

      setOnboardingStatus(status.status);
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
      setIsLoading(false);
    }
  };

  const handleDashboardClick = async () => {
    try {
      const user = await OnboardingModel.getCurrentUser();
      if (!user) {
        router.push('/');
        return;
      }

      if (onboardingStatus !== 'completed') {
        await router.push('/onboarding');
      } else {
        await router.push('/dashboard');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Something went wrong');
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

      // Close dropdown
      onClose();
      
      // Show success message
      toast.success('Signed out successfully');
      
      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="relative">
      <button className="flex items-center space-x-2 p-2 rounded-lg">
        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
          {profile?.avatar_url ? (
            <img 
              src={profile.avatar_url} 
              alt="Profile" 
              className="w-full h-full rounded-full"
            />
          ) : (
            <i className="fas fa-user text-purple-400" />
          )}
        </div>
        <span className="text-gray-300">{profile?.username || 'User'}</span>
      </button>
    </div>
  );
};

export default UserDropdown; 