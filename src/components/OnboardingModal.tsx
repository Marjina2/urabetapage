import { FC } from 'react';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';
import { onboardingEvents } from '@/models/OnboardingModel';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const OnboardingModal: FC<OnboardingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const handleCompleteOnboarding = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No user found');
      }

      // Update both onboarding_completed and has_completed_setup
      const { error } = await supabase
        .from('profiles')
        .update({ 
          onboarding_completed: true,
          has_completed_setup: true,
          onboarding_status: 'completed'
        })
        .eq('id', user.id);

      if (error) throw error;

      // Emit the completion event
      onboardingEvents.emit();
      
      toast.success('Onboarding completed!');
      onComplete();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete onboarding');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">
          <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Welcome to URA
          </span>
        </h2>

        {/* Add onboarding steps here */}
        <div className="space-y-6">
          <div className="p-4 border border-purple-500/20 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Step 1: Complete Your Profile</h3>
            <p className="text-gray-400">Add your details and preferences to get started</p>
          </div>

          <div className="p-4 border border-purple-500/20 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Step 2: Choose Your Interests</h3>
            <p className="text-gray-400">Select topics you're interested in</p>
          </div>

          <div className="p-4 border border-purple-500/20 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Step 3: Set Your Goals</h3>
            <p className="text-gray-400">Tell us what you want to achieve</p>
          </div>

          <button 
            className="w-full bg-purple-600 text-white rounded-lg px-4 py-3 hover:bg-purple-700 transition-all duration-300"
            onClick={handleCompleteOnboarding}
          >
            Complete Onboarding
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal; 