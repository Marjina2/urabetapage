import { FC, useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface UserProfile {
  id: string;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  first_name?: string | null;
  last_name?: string | null;
  phone_number?: string | null;
  country_code?: string | null;
  postal_code?: string | null;
  research_interests?: string[];
  research_goals?: string | null;
  one_thing_to_find?: string | null;
  preferred_tools?: string[];
  onboarding_completed?: boolean;
  onboarding_step?: number;
  onboarding_status?: string;
  has_completed_setup?: boolean;
  updated_at?: string;
  onboarding_data?: {
    firstName?: string | null;
    lastName?: string | null;
    country?: string | null;
    postalCode?: string | null;
    researchInterests?: string[];
    researchGoals?: string | null;
    oneThingToFind?: string | null;
    preferredTools?: string[];
    apiKeys?: Record<string, string>;
  };
}

type SettingsSection = 'profile' | 'research' | 'security' | 'privacy' | 'apis' | 'notifications' | 'billing';

const sidebarItems = [
  { id: 'profile', icon: 'user', label: 'Profile Settings' },
  { id: 'research', icon: 'microscope', label: 'Research Preferences' },
  { id: 'security', icon: 'shield-alt', label: 'Security' },
  { id: 'privacy', icon: 'lock', label: 'Privacy' },
  { id: 'apis', icon: 'code', label: 'API Management' },
  { id: 'notifications', icon: 'bell', label: 'Notifications' },
  { id: 'billing', icon: 'credit-card', label: 'Billing & Plans' },
] as const;

// Add this interface for handling file uploads
interface FileInputEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & {
    files: FileList;
  };
}

// Update the canChangeUsername helper function
const canChangeUsername = (lastUpdated: string | null | undefined): boolean => {
  if (!lastUpdated) return true;
  const daysSinceLastUpdate = Math.floor(
    (Date.now() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysSinceLastUpdate >= 90;
};

// Add this interface for API keys
interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  last_used?: string;
  is_active: boolean;
}

// Update the ApiKeys interface
interface ApiKeys {
  semantic_scholar?: string;
  openai?: string;
  deepl?: string;
  opencorporates?: string;
  serpapi?: string;
  claude?: string;
  deepseek?: string;
  core?: string;
  arxiv?: string;
  pubmed?: string;
  openaire?: string;
  datagov?: string;
  europeandata?: string;
  canadadata?: string;
  census?: string;
  worldbank?: string;
  undata?: string;
  wayback?: string;
  gdelt?: string;
  ciafactbook?: string;
  opensecrets?: string;
  huggingface?: string;
  shodan?: string;
}

// Update the ApiKeyInput component props
interface ApiKeyInputProps {
  name: keyof ApiKeys;
  value?: string;
  onChange: (name: keyof ApiKeys, value: string) => void;
  onSave: (name: keyof ApiKeys, value: string) => void;
}

const AccountSettingsPage: FC = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    semantic_scholar: '',
    openai: '',
    deepl: '',
    opencorporates: '',
    serpapi: '',
    claude: '',
    deepseek: '',
    core: ''
  });
  const [isLoadingKeys, setIsLoadingKeys] = useState(false);
  const [activeChatbot, setActiveChatbot] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/');
          return;
        }

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

        // Transform the profile data
        const transformedProfile: UserProfile = {
          id: profile.id,
          username: profile.username || null,
          email: profile.email || null,
          avatar_url: profile.avatar_url || null,
          first_name: profile.onboarding_data?.firstName || null,
          last_name: profile.onboarding_data?.lastName || null,
          phone_number: profile.phone_number || null,
          country_code: profile.onboarding_data?.country || null,
          postal_code: profile.onboarding_data?.postalCode || null,
          research_interests: profile.onboarding_data?.researchInterests || [],
          research_goals: profile.onboarding_data?.researchGoals || null,
          one_thing_to_find: profile.onboarding_data?.oneThingToFind || null,
          preferred_tools: profile.onboarding_data?.preferredTools || [],
          onboarding_completed: profile.onboarding_completed || false,
          onboarding_step: profile.onboarding_step || 1,
          onboarding_status: profile.onboarding_status || 'not_started',
          has_completed_setup: profile.has_completed_setup || false,
          onboarding_data: profile.onboarding_data || {},
          updated_at: profile.updated_at || new Date().toISOString()
        };

        console.log('Loaded profile:', transformedProfile); // Add this for debugging
        setProfile(transformedProfile);
        setFormData(transformedProfile);

        // Load API keys if they exist
        if (profile.onboarding_data?.apiKeys) {
          setApiKeys(profile.onboarding_data.apiKeys);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !formData) return;

      const updateData = {
        username: formData.username,
        phone_number: formData.phone_number,
        onboarding_data: {
          ...(profile?.onboarding_data || {}),
          firstName: formData.first_name,
          lastName: formData.last_name,
          country: formData.country_code,
          postalCode: formData.postal_code,
          researchInterests: formData.research_interests,
          researchGoals: formData.research_goals,
          oneThingToFind: formData.one_thing_to_find,
          preferredTools: formData.preferred_tools
        },
        updated_at: new Date().toISOString()
      };

      console.log('Updating profile with:', updateData); // Add this for debugging

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', session.user.id);

      if (error) throw error;

      setProfile(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update the handleAvatarChange function
  const handleAvatarChange = async (event: FileInputEvent) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;

      // First, remove existing avatar if any
      if (profile?.avatar_url) {
        const oldFileName = profile.avatar_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('avatars')
            .remove([oldFileName]);
        }
      }

      // Upload new file
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      // Update local state
      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
      setFormData(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setIsLoading(false);
    }
  };

  // Update the handleUsernameChange function
  const handleUsernameChange = async (newUsername: string) => {
    try {
      if (!canChangeUsername(profile?.updated_at)) {
        toast.error('Username can only be changed once every 90 days');
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          username: newUsername,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.user.id);

      if (error) throw error;

      // Update local state
      setProfile(prev => prev ? { ...prev, username: newUsername, updated_at: new Date().toISOString() } : null);
      toast.success('Username updated successfully');
    } catch (error) {
      console.error('Error updating username:', error);
      toast.error('Failed to update username');
    }
  };

  // Update the handleApiKeyChange function
  const handleApiKeyChange = (name: keyof ApiKeys, value: string) => {
    setApiKeys(prev => ({ ...prev, [name]: value }));
  };

  // Update the handleApiKeyUpdate function
  const handleApiKeyUpdate = async (name: keyof ApiKeys, value: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_data')
        .eq('id', session.user.id)
        .single();

      const updatedApiKeys = {
        ...(profile?.onboarding_data?.apiKeys || {}),
        [name]: value
      };

      const { error } = await supabase
        .from('profiles')
        .update({
          onboarding_data: {
            ...(profile?.onboarding_data || {}),
            apiKeys: updatedApiKeys
          }
        })
        .eq('id', session.user.id);

      if (error) throw error;

      setApiKeys(prev => ({ ...prev, [name]: value }));
      toast.success(`${name} API key updated successfully`);
    } catch (error) {
      console.error('Error updating API key:', error);
      toast.error('Failed to update API key');
    }
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Header without edit button */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Profile Settings
              </h2>
            </div>

            {/* Profile Picture */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center overflow-hidden">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.username || 'Profile'}
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = 'https://via.placeholder.com/200?text=URA'; // Fallback image
                      }}
                    />
                  ) : (
                    <i className="fas fa-user text-2xl text-purple-400"></i>
                  )}
                </div>
                {isEditing && !profile?.avatar_url?.includes('googleusercontent.com') && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 
                                 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 
                                 transition-opacity">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <i className="fas fa-camera text-white"></i>
                  </label>
                )}
              </div>
              {isEditing && !profile?.avatar_url?.includes('googleusercontent.com') && (
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                    className="text-purple-400 hover:text-purple-300 transition-colors text-sm"
                  >
                    Change Picture
                  </button>
                  {profile?.avatar_url && (
                    <button 
                      onClick={async () => {
                        try {
                          const { data: { session } } = await supabase.auth.getSession();
                          if (!session) return;

                          const { error } = await supabase
                            .from('profiles')
                            .update({ avatar_url: null })
                            .eq('id', session.user.id);

                          if (error) throw error;

                          setProfile(prev => prev ? { ...prev, avatar_url: null } : null);
                          setFormData(prev => prev ? { ...prev, avatar_url: null } : null);
                          toast.success('Profile picture removed');
                        } catch (error) {
                          console.error('Error removing avatar:', error);
                          toast.error('Failed to remove profile picture');
                        }
                      }}
                      className="text-red-400 hover:text-red-300 transition-colors text-sm"
                    >
                      Remove Picture
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Username
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={formData?.username || ''}
                    disabled={!canChangeUsername(profile?.updated_at)}
                    className={`w-full bg-[#252544] border border-purple-500/20 rounded-lg px-4 py-3
                              text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#1C1C1E] 
                              ${!canChangeUsername(profile?.updated_at) 
                                ? 'opacity-50 cursor-not-allowed bg-[#1C1C1E]' 
                                : 'hover:border-purple-500/40'}`}
                  />
                  {!canChangeUsername(profile?.updated_at) && (
                    <div className="absolute inset-0" style={{ cursor: 'not-allowed' }}></div>
                  )}
                </div>
                <div className="mt-1 text-sm">
                  {!canChangeUsername(profile?.updated_at) && (
                    <p className="text-yellow-400">
                      Username can be changed again in {
                        90 - Math.floor(
                          (Date.now() - new Date(profile?.updated_at || '').getTime()) / (1000 * 60 * 60 * 24)
                        )
                      } days.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData?.email || ''}
                  readOnly
                  className="w-full bg-[#252544] border border-purple-500/20 rounded-lg px-4 py-3
                           text-white opacity-75"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData?.first_name || ''}
                  readOnly
                  className="w-full bg-[#252544] border border-purple-500/20 rounded-lg px-4 py-3
                           text-white opacity-75"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData?.last_name || ''}
                  readOnly
                  className="w-full bg-[#252544] border border-purple-500/20 rounded-lg px-4 py-3
                           text-white opacity-75"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  value={formData?.phone_number || ''}
                  readOnly
                  className="w-full bg-[#252544] border border-purple-500/20 rounded-lg px-4 py-3
                           text-white opacity-75"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={formData?.country_code || ''}
                  readOnly
                  className="w-full bg-[#252544] border border-purple-500/20 rounded-lg px-4 py-3
                           text-white opacity-75"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={formData?.postal_code || ''}
                  readOnly
                  className="w-full bg-[#252544] border border-purple-500/20 rounded-lg px-4 py-3
                           text-white opacity-75"
                />
              </div>
            </div>
          </motion.div>
        );

      case 'research':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Research Preferences
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Edit Preferences
                </button>
              )}
            </div>

            {/* Research Interests */}
            <div className="bg-[#252544]/50 backdrop-blur-md rounded-lg p-6 border border-purple-500/20">
              <h3 className="text-lg font-semibold text-white mb-4">Research Interests</h3>
              <div className="flex flex-wrap gap-2">
                {formData?.research_interests?.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-purple-500/20 border border-purple-500/40 
                             rounded-full text-sm text-purple-300"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Research Goals */}
            <div className="bg-[#252544]/50 backdrop-blur-md rounded-lg p-6 border border-purple-500/20">
              <h3 className="text-lg font-semibold text-white mb-4">Research Goals</h3>
              <p className="text-gray-300">{formData?.research_goals}</p>
            </div>

            {/* One Thing to Find */}
            <div className="bg-[#252544]/50 backdrop-blur-md rounded-lg p-6 border border-purple-500/20">
              <h3 className="text-lg font-semibold text-white mb-4">Primary Research Focus</h3>
              <p className="text-gray-300">{formData?.one_thing_to_find}</p>
            </div>

            {/* Preferred Tools */}
            <div className="bg-[#252544]/50 backdrop-blur-md rounded-lg p-6 border border-purple-500/20">
              <h3 className="text-lg font-semibold text-white mb-4">Preferred Research Tools</h3>
              <div className="flex flex-wrap gap-2">
                {formData?.preferred_tools?.map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1 bg-purple-500/20 border border-purple-500/40 
                             rounded-full text-sm text-purple-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-[#252544]/50 backdrop-blur-md rounded-lg p-6 border border-purple-500/20">
              <h3 className="text-lg font-semibold text-white mb-4">Location Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData?.country_code || ''}
                    readOnly={!isEditing}
                    className={`w-full bg-[#1C1C1E] border border-purple-500/20 rounded-lg px-4 py-3
                             text-white ${!isEditing && 'opacity-75'}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={formData?.postal_code || ''}
                    readOnly={!isEditing}
                    className={`w-full bg-[#1C1C1E] border border-purple-500/20 rounded-lg px-4 py-3
                             text-white ${!isEditing && 'opacity-75'}`}
                  />
                </div>
              </div>
            </div>

            {/* Add action buttons at the bottom when editing */}
            {isEditing && (
              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={() => {
                    setFormData(profile);
                    setIsEditing(false);
                  }}
                  className="px-6 py-3 border border-gray-700 rounded-lg font-medium 
                           text-gray-300 hover:border-purple-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-purple-500 text-white rounded-lg 
                           hover:bg-purple-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </motion.div>
        );

      case 'security':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Security Settings
            </h2>
            
            {/* Two-Factor Authentication */}
            <div className="bg-[#252544]/50 backdrop-blur-md rounded-lg p-6 border border-purple-500/20">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Two-Factor Authentication</h3>
                  <p className="text-gray-400">Add an extra layer of security to your account</p>
                </div>
                <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                  Enable 2FA
                </button>
              </div>
            </div>

            {/* Password Settings */}
            <div className="bg-[#252544]/50 backdrop-blur-md rounded-lg p-6 border border-purple-500/20">
              <h3 className="text-lg font-semibold text-white mb-4">Password Settings</h3>
              <div className="space-y-4">
                <button className="w-full px-4 py-3 bg-[#1C1C1E] text-white rounded-lg hover:bg-purple-500/10 transition-colors text-left">
                  Change Password
                </button>
                <button className="w-full px-4 py-3 bg-[#1C1C1E] text-white rounded-lg hover:bg-purple-500/10 transition-colors text-left">
                  Set up Recovery Email
                </button>
              </div>
            </div>
          </motion.div>
        );

      case 'privacy':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Privacy Settings
            </h2>
            
            {/* Privacy Controls */}
            <div className="bg-[#252544]/50 backdrop-blur-md rounded-lg p-6 border border-purple-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white">Profile Visibility</h3>
                  <p className="text-sm text-gray-400">Control who can see your profile</p>
                </div>
                <select className="bg-[#1C1C1E] text-white rounded-lg px-4 py-2 border border-purple-500/20">
                  <option>Public</option>
                  <option>Private</option>
                  <option>Friends Only</option>
                </select>
              </div>
              
              {/* Add more privacy controls */}
            </div>
          </motion.div>
        );

      case 'apis':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              API Management
            </h2>

            {/* Research Papers & Academic Sources */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <i className="fas fa-book-open text-purple-400"></i>
                Research Papers & Academic Sources
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    name: 'core',
                    label: 'CORE API',
                    description: 'Free and open access research papers',
                    docUrl: 'https://core.ac.uk/documentation',
                    placeholder: 'Enter your CORE API key'
                  },
                  {
                    name: 'semantic_scholar',
                    label: 'Semantic Scholar API',
                    description: 'Free for research purposes',
                    docUrl: 'https://www.semanticscholar.org/product/api',
                    placeholder: 'Enter your Semantic Scholar API key'
                  },
                  {
                    name: 'arxiv',
                    label: 'arXiv API',
                    description: 'Completely free access to research papers',
                    docUrl: 'https://arxiv.org/help/api',
                    placeholder: 'Enter your arXiv API key'
                  },
                  {
                    name: 'pubmed',
                    label: 'PubMed API',
                    description: 'Biomedical and life sciences data',
                    docUrl: 'https://www.ncbi.nlm.nih.gov/home/develop/api/',
                    placeholder: 'Enter your PubMed API key'
                  },
                  {
                    name: 'openaire',
                    label: 'OpenAIRE API',
                    description: 'EU-funded research outputs',
                    docUrl: 'https://develop.openaire.eu/',
                    placeholder: 'Enter your OpenAIRE API key'
                  }
                ].map((api) => (
                  <div key={api.name} className="bg-[#1C1C1E]/50 border border-purple-500/20 rounded-lg p-6 hover:border-purple-500/40 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-white">{api.label}</h4>
                        <p className="text-sm text-gray-400">{api.description}</p>
                      </div>
                      <a
                        href={api.docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
                      >
                        <span>Docs</span>
                        <i className="fas fa-external-link-alt"></i>
                      </a>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={apiKeys[api.name as keyof ApiKeys] || ''}
                        onChange={(e) => handleApiKeyChange(api.name as keyof ApiKeys, e.target.value)}
                        className="flex-1 bg-black/30 border border-purple-500/20 rounded-lg px-4 py-3
                                 text-white placeholder-gray-500 focus:border-purple-500/50 transition-colors"
                        placeholder={api.placeholder}
                      />
                      <button
                        onClick={() => handleApiKeyUpdate(api.name as keyof ApiKeys, apiKeys[api.name as keyof ApiKeys] || '')}
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 
                                 transition-colors flex items-center gap-2"
                      >
                        <i className="fas fa-save"></i>
                        Save
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Government Data & Files */}
            <div className="space-y-6 mt-8">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <i className="fas fa-landmark text-purple-400"></i>
                Government Data & Files
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    name: 'datagov',
                    label: 'Data.gov API',
                    description: 'U.S. Government open data',
                    docUrl: 'https://www.data.gov/developers/',
                    placeholder: 'Enter your Data.gov API key'
                  },
                  {
                    name: 'europeandata',
                    label: 'European Data Portal',
                    description: 'EU open data portal',
                    docUrl: 'https://data.europa.eu/en/developers',
                    placeholder: 'Enter your European Data Portal API key'
                  },
                  // Add more government APIs...
                ].map((api) => (
                  <div key={api.name} className="bg-[#1C1C1E]/50 border border-purple-500/20 rounded-lg p-6 hover:border-purple-500/40 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-white">{api.label}</h4>
                        <p className="text-sm text-gray-400">{api.description}</p>
                      </div>
                      <a
                        href={api.docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
                      >
                        <span>Docs</span>
                        <i className="fas fa-external-link-alt"></i>
                      </a>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={apiKeys[api.name as keyof ApiKeys] || ''}
                        onChange={(e) => handleApiKeyChange(api.name as keyof ApiKeys, e.target.value)}
                        className="flex-1 bg-black/30 border border-purple-500/20 rounded-lg px-4 py-3
                                 text-white placeholder-gray-500 focus:border-purple-500/50 transition-colors"
                        placeholder={api.placeholder}
                      />
                      <button
                        onClick={() => handleApiKeyUpdate(api.name as keyof ApiKeys, apiKeys[api.name as keyof ApiKeys] || '')}
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 
                                 transition-colors flex items-center gap-2"
                      >
                        <i className="fas fa-save"></i>
                        Save
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Public Files & Open Data */}
            <div className="space-y-6 mt-8">
              <h3 className="text-xl font-bold text-white">Public Files & Open Data</h3>
              <div className="space-y-4">
                {/* OpenCorporates API */}
                <div className="form-group">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-400">
                      OpenCorporates API
                    </label>
                    <a href="https://api.opencorporates.com/documentation/API-Reference" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-purple-400 hover:text-purple-300 text-sm">
                      Documentation <i className="fas fa-external-link-alt ml-1"></i>
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={apiKeys.opencorporates || ''}
                      onChange={(e) => handleApiKeyChange('opencorporates', e.target.value)}
                      className="flex-1 bg-[#1C1C1E] border border-purple-500/20 rounded-lg px-4 py-3
                               text-white placeholder-gray-500"
                      placeholder="Enter your OpenCorporates API key"
                    />
                    <button
                      onClick={() => handleApiKeyUpdate('opencorporates', apiKeys.opencorporates || '')}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 
                               transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* AI-Specific Research Tools */}
            <div className="space-y-6 mt-8">
              <h3 className="text-xl font-bold text-white">AI-Specific Research Tools</h3>
              <div className="space-y-4">
                {/* Add blocks for Hugging Face, Shodan */}
              </div>
            </div>
          </motion.div>
        );

      // Add more sections as needed...

      default:
        return null;
    }
  };

  // Update the ApiKeyInput component
  const ApiKeyInput: FC<ApiKeyInputProps> = ({ name, value, onChange, onSave }) => {
    const [inputValue, setInputValue] = useState(value || '');
    const [isVisible, setIsVisible] = useState(false);

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          {name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} API Key
        </label>
        <div className="flex gap-2">
          <input
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              onChange(name, e.target.value);
            }}
            className={`bg-black/30 border border-purple-500/20 rounded px-3 py-2 text-sm flex-1
                      ${inputValue ? 'font-mono' : ''}`}
            type={isVisible ? "text" : "password"}
            placeholder={`Enter your ${name} API key`}
          />
          <button
            onClick={() => setIsVisible(!isVisible)}
            type="button"
            className="px-3 text-gray-400 hover:text-white transition-colors"
          >
            <i className={`fas fa-${isVisible ? 'eye-slash' : 'eye'}`}></i>
          </button>
          <button
            onClick={() => onSave(name, inputValue)}
            type="button"
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    );
  };

  // Add this component for the info button with documentation link
  const ApiInfoButton: FC<{ url: string }> = ({ url }) => (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="ml-2 text-gray-400 hover:text-purple-400 transition-colors"
      title="View Documentation"
    >
      <i className="fas fa-info-circle"></i>
    </a>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Account Settings | URA</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-black to-[#1C1C1E] text-white">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-grid-pattern opacity-5"></div>
        <div className="fixed inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-transparent"></div>

        <div className="relative z-10 flex">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-64 min-h-screen bg-[#1C1C1E]/50 backdrop-blur-xl border-r border-purple-500/20"
          >
            <div className="p-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center overflow-hidden">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.username || 'Profile'}
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = 'https://via.placeholder.com/120?text=URA'; // Fallback image
                      }}
                    />
                  ) : (
                    <i className="fas fa-user text-xl text-purple-400"></i>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-white">{profile?.username || 'User'}</h3>
                  <p className="text-sm text-gray-400">{profile?.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                              ${activeSection === item.id
                                ? 'bg-purple-500 text-white'
                                : 'text-gray-400 hover:bg-purple-500/10 hover:text-white'
                              }`}
                  >
                    <i className={`fas fa-${item.icon} w-5`}></i>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            <AnimatePresence mode="wait">
              {renderSectionContent()}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountSettingsPage; 