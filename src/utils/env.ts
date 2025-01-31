const isBrowser = typeof window !== 'undefined'

// Define required environment variables
const REQUIRED_ENV_VARS = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
} as const

// Check environment variables only on server side
if (!isBrowser) {
  Object.entries(REQUIRED_ENV_VARS).forEach(([key, value]) => {
    if (!value) {
      console.warn(`Warning: ${key} environment variable is not set`)
    }
  })
}

export const ENV = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
} as const

// Helper function to validate environment
export function validateEnv() {
  const missing = Object.entries(ENV).filter(([_, value]) => !value)
  if (missing.length > 0) {
    const missingVars = missing.map(([key]) => key).join(', ')
    console.warn(`Warning: Missing environment variables: ${missingVars}`)
    return false
  }
  return true
} 