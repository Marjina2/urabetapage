import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing environment variables for Supabase')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Remove the redirectTo property if it's not supported
    // flowType: 'pkce', // Uncomment if needed based on your version
    // cookieOptions: {
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'Lax'
    // }
  }
}) 