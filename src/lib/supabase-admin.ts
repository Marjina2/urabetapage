import { createClient } from '@supabase/supabase-js'
import { ENV } from '@/utils/env'

// Create a Supabase client with the service role key for admin operations
const supabaseAdmin = ENV.SUPABASE_URL && ENV.SUPABASE_SERVICE_KEY
  ? createClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

export async function checkUserExists(email: string, username: string) {
  try {
    if (!supabaseAdmin) {
      console.error('Supabase admin client not initialized')
      return { exists: false, existingField: null }
    }

    // Check for existing email
    const { data: emailData, error: emailError } = await supabaseAdmin
      .from('users')
      .select('email')
      .eq('email', email)
      .single()

    if (emailError && emailError.code !== 'PGRST116') {
      throw emailError
    }

    // Check for existing username
    const { data: usernameData, error: usernameError } = await supabaseAdmin
      .from('users')
      .select('raw_user_meta_data->username')
      .eq('raw_user_meta_data->username', username)
      .single()

    if (usernameError && usernameError.code !== 'PGRST116') {
      throw usernameError
    }

    return {
      exists: !!(emailData || usernameData),
      existingField: emailData ? 'email' : usernameData ? 'username' : null
    }
  } catch (error) {
    console.error('Error checking user existence:', error)
    return { exists: false, existingField: null }
  }
} 