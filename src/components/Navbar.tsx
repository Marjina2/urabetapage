import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useUser } from '@/contexts/UserContext';

const Navbar: React.FC = () => {
  const { profile, loading } = useUser();

  return (
    <div>
      Signed in as {profile?.username || 'User'}
    </div>
  );
};

export default Navbar; 