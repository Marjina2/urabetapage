import { FC, useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';
import Head from 'next/head';
import type { UserProfile } from '@/types/user';

interface FormData {
  firstName: string;
  lastName: string;
  username: string;
  phoneNumber: string;
  countryCode: string;
  postalCode: string;
  email: string;
  notifications: {
    email: boolean;
    push: boolean;
    research: boolean;
    updates: boolean;
  };
  theme: 'dark' | 'light' | 'system';
  language: string;
}

const SettingsPage: FC = () => {
  const { profile, loading, refreshProfile } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    username: '',
    phoneNumber: '',
    countryCode: '',
    postalCode: '',
    email: '',
    notifications: {
      email: true,
      push: true,
      research: true,
      updates: true
    },
    theme: 'dark',
    language: 'en'
  });

  useEffect(() => {
    if (profile) {
      const onboardingData = profile.onboarding_data || {};
      
      setFormData(prev => ({
        ...prev,
        firstName: profile.first_name || onboardingData.firstName || '',
        lastName: profile.last_name || onboardingData.lastName || '',
        username: profile.username || '',
        phoneNumber: profile.phone_number || onboardingData.phoneNumber || '',
        countryCode: profile.country_code || onboardingData.countryCode || '+1',
        postalCode: profile.postal_code || onboardingData.postalCode || '',
        email: profile.email || ''
      }));
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please sign in to update settings');
        return;
      }

      const updateData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        username: formData.username,
        phone_number: formData.phoneNumber,
        country_code: formData.countryCode,
        postal_code: formData.postalCode,
        updated_at: new Date().toISOString(),
        onboarding_data: {
          ...(profile?.onboarding_data || {}),
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          countryCode: formData.countryCode,
          postalCode: formData.postalCode
        }
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (profileError) throw profileError;

      await refreshProfile();
      toast.success('Settings updated successfully');
    } catch (error: any) {
      console.error('Error updating settings:', error);
      toast.error(error.message || 'Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Settings | URA</title>
      </Head>

      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Settings
            </span>
          </h1>

          <div className="space-y-8">
            {/* Profile Section */}
            <section className="bg-[#1C1C1E] border border-purple-500/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                Profile Settings
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full bg-[#1C1C1E] border border-purple-500/20 rounded-lg px-4 py-3
                             hover:border-purple-500/40 focus:border-purple-500 
                             transition-all duration-300 ease-in-out text-white"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full bg-[#1C1C1E] border border-purple-500/20 rounded-lg px-4 py-3
                             hover:border-purple-500/40 focus:border-purple-500 
                             transition-all duration-300 ease-in-out text-white"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full bg-[#1C1C1E] border border-purple-500/20 rounded-lg px-4 py-3
                             hover:border-purple-500/40 focus:border-purple-500 
                             transition-all duration-300 ease-in-out text-white"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formData.countryCode}
                      onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
                      className="w-24 bg-[#1C1C1E] border border-purple-500/20 rounded-lg px-2 py-3
                               hover:border-purple-500/40 focus:border-purple-500 
                               transition-all duration-300 ease-in-out text-white"
                    >
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+91">+91</option>
                      {/* Add more country codes as needed */}
                    </select>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => {
                        // Only allow numbers and basic formatting characters
                        const value = e.target.value.replace(/[^\d\s()-]/g, '')
                        setFormData({...formData, phoneNumber: value})
                      }}
                      className="flex-1 bg-[#1C1C1E] border border-purple-500/20 rounded-lg px-4 py-3
                               hover:border-purple-500/40 focus:border-purple-500 
                               transition-all duration-300 ease-in-out text-white"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Postal/ZIP Code
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => {
                      // Allow letters and numbers for international postal codes
                      const value = e.target.value.replace(/[^a-zA-Z0-9\s-]/g, '')
                      setFormData({...formData, postalCode: value.toUpperCase()})
                    }}
                    className="w-full bg-[#1C1C1E] border border-purple-500/20 rounded-lg px-4 py-3
                             hover:border-purple-500/40 focus:border-purple-500 
                             transition-all duration-300 ease-in-out text-white"
                    placeholder="Enter postal/ZIP code"
                  />
                </div>
              </div>
            </section>

            {/* Notification Preferences */}
            <section className="bg-[#1C1C1E] border border-purple-500/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                Notification Settings
              </h2>
              
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.notifications.email}
                    onChange={(e) => setFormData({
                      ...formData,
                      notifications: {
                        ...formData.notifications,
                        email: e.target.checked
                      }
                    })}
                    className="form-checkbox text-purple-500 rounded border-gray-600 bg-gray-800"
                  />
                  <span className="text-gray-300">Email Notifications</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.notifications.push}
                    onChange={(e) => setFormData({
                      ...formData,
                      notifications: {
                        ...formData.notifications,
                        push: e.target.checked
                      }
                    })}
                    className="form-checkbox text-purple-500 rounded border-gray-600 bg-gray-800"
                  />
                  <span className="text-gray-300">Push Notifications</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.notifications.research}
                    onChange={(e) => setFormData({
                      ...formData,
                      notifications: {
                        ...formData.notifications,
                        research: e.target.checked
                      }
                    })}
                    className="form-checkbox text-purple-500 rounded border-gray-600 bg-gray-800"
                  />
                  <span className="text-gray-300">Research Updates</span>
                </label>
              </div>
            </section>

            {/* Appearance Settings */}
            <section className="bg-[#1C1C1E] border border-purple-500/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                Appearance
              </h2>
              
              <div className="space-y-6">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Theme
                  </label>
                  <select
                    value={formData.theme}
                    onChange={(e) => setFormData({...formData, theme: e.target.value as 'dark' | 'light' | 'system'})}
                    className="w-full bg-[#1C1C1E] border border-purple-500/20 rounded-lg px-4 py-3
                             hover:border-purple-500/40 focus:border-purple-500 
                             transition-all duration-300 ease-in-out text-white"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="system">System</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Language
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({...formData, language: e.target.value})}
                    className="w-full bg-[#1C1C1E] border border-purple-500/20 rounded-lg px-4 py-3
                             hover:border-purple-500/40 focus:border-purple-500 
                             transition-all duration-300 ease-in-out text-white"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 
                         rounded-lg font-medium text-white hover:opacity-90 
                         transition-opacity disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage; 