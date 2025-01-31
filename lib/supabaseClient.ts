import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  return 'http://localhost:3000';
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    // redirectTo: `${getBaseUrl()}/auth/callback`, // Commented out
    // cookieOptions: {
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'Lax'
    // }
  }
}) 