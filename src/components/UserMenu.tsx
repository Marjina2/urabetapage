import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

const UserMenu: React.FC = () => {
  const { profile, loading } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  if (loading) return null;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="relative">
      {/* User button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-purple-500/10 transition-colors"
      >
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
        <span className="text-gray-300">
          {profile?.username || 'User'} 
        </span>
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} text-gray-400`} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 py-2 bg-[#1C1C1E] rounded-lg shadow-xl border border-purple-500/20">
          <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-800">
            Signed in as<br />
            <span className="font-medium text-white">{profile?.username || 'User'}</span>
          </div>

          <a 
            href="/dashboard" 
            className="block px-4 py-2 text-sm text-gray-300 hover:bg-purple-500/10 transition-colors"
          >
            <i className="fas fa-columns w-5" /> DASHBOARD
          </a>

          <a 
            href="/settings" 
            className="block px-4 py-2 text-sm text-gray-300 hover:bg-purple-500/10 transition-colors"
          >
            <i className="fas fa-cog w-5" /> SETTINGS
          </a>

          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-purple-500/10 transition-colors"
          >
            <i className="fas fa-sign-out-alt w-5" /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu; 