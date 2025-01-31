import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { useUser } from '@/contexts/UserContext';

const Header: React.FC = () => {
  const { profile, loading } = useUser();

  return (
    <header className="bg-[#1C1C1E] border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-white">URA</Link>
        
        <div className="flex items-center space-x-4">
          {/* Add direct onboarding link */}
          <Link 
            href="/onboarding"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            Go to Onboarding
          </Link>
          
          {/* ... other header items ... */}
        </div>

        <div>
          Signed in as {profile?.username || 'User'}
        </div>
      </div>
    </header>
  );
};

export default Header; 