-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    username TEXT UNIQUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Add these columns
    first_name TEXT,
    last_name TEXT,
    country_code TEXT,
    phone_number TEXT,
    postal_code TEXT,
    
    -- Onboarding fields
    onboarding_completed BOOLEAN DEFAULT FALSE,
    onboarding_step INTEGER DEFAULT 1,
    onboarding_status TEXT DEFAULT 'not_started',
    has_completed_setup BOOLEAN DEFAULT FALSE,
    onboarding_data JSONB DEFAULT '{}'::jsonb,
    
    -- Profile fields
    date_of_birth DATE,
    country TEXT,
    research_interests TEXT[] DEFAULT '{}',
    preferred_tools TEXT[] DEFAULT '{}',
    goals TEXT,
    challenges TEXT
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id 
    ON profiles(id);

CREATE INDEX IF NOT EXISTS idx_profiles_username 
    ON profiles(username);

CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_status 
    ON profiles(onboarding_status);

-- Add indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_profiles_country_code ON profiles(country_code);
CREATE INDEX IF NOT EXISTS idx_profiles_phone_number ON profiles(phone_number);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, created_at)
    VALUES (NEW.id, NEW.email, NOW())
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add these if they don't exist
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS onboarding_status TEXT DEFAULT 'not_started',
ADD COLUMN IF NOT EXISTS has_completed_setup BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS onboarding_data JSONB DEFAULT '{}'::jsonb;

-- Update any null values
UPDATE profiles 
SET 
  onboarding_completed = FALSE,
  onboarding_status = 'not_started',
  has_completed_setup = FALSE,
  onboarding_data = '{}'::jsonb
WHERE 
  onboarding_completed IS NULL 
  OR onboarding_status IS NULL 
  OR has_completed_setup IS NULL
  OR onboarding_data IS NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_status 
ON profiles(onboarding_status);

CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_completed 
ON profiles(onboarding_completed); 