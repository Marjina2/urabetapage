-- First check if the column exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'onboarding_completed'
    ) THEN
        ALTER TABLE profiles
        ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'research_interests'
    ) THEN
        ALTER TABLE profiles
        ADD COLUMN research_interests TEXT[] DEFAULT '{}';
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'preferred_tools'
    ) THEN
        ALTER TABLE profiles
        ADD COLUMN preferred_tools TEXT[] DEFAULT '{}';
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'goals'
    ) THEN
        ALTER TABLE profiles
        ADD COLUMN goals TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'username'
    ) THEN
        ALTER TABLE profiles
        ADD COLUMN username TEXT UNIQUE;
    END IF;

    -- Add new columns if they don't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'country_code'
    ) THEN
        ALTER TABLE profiles
        ADD COLUMN country_code TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'phone_number'
    ) THEN
        ALTER TABLE profiles
        ADD COLUMN phone_number TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'postal_code'
    ) THEN
        ALTER TABLE profiles
        ADD COLUMN postal_code TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'first_name'
    ) THEN
        ALTER TABLE profiles
        ADD COLUMN first_name TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'last_name'
    ) THEN
        ALTER TABLE profiles
        ADD COLUMN last_name TEXT;
    END IF;
END $$;

-- Make sure all existing profiles have the field set
UPDATE profiles 
SET onboarding_completed = FALSE 
WHERE onboarding_completed IS NULL;

-- Create an enum type for onboarding status
CREATE TYPE onboarding_status AS ENUM ('not_started', 'in_progress', 'completed');

-- Add necessary columns for onboarding tracking
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS onboarding_status TEXT DEFAULT 'not_started',
ADD COLUMN IF NOT EXISTS has_completed_setup BOOLEAN DEFAULT FALSE;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_status 
ON profiles(onboarding_status);

-- Add trigger to update has_completed_setup
CREATE OR REPLACE FUNCTION update_setup_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.onboarding_completed = TRUE THEN
    NEW.has_completed_setup := TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_setup_status
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_setup_status();

-- Add index for user lookups
CREATE INDEX IF NOT EXISTS idx_profiles_user_id 
ON profiles(id);

-- First ensure the profiles table exists
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    username TEXT UNIQUE,
    updated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    onboarding_step INTEGER DEFAULT 1,
    onboarding_status TEXT DEFAULT 'not_started',
    has_completed_setup BOOLEAN DEFAULT FALSE,
    onboarding_data JSONB DEFAULT '{}'::jsonb
);

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create new policies
CREATE POLICY "Users can update their own profile"
ON public.profiles 
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile"
ON public.profiles 
FOR SELECT
USING (auth.uid() = id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_country_code ON profiles(country_code);
CREATE INDEX IF NOT EXISTS idx_profiles_phone_number ON profiles(phone_number);

-- Create or update the function to handle new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, created_at)
    VALUES (NEW.id, NEW.email, NOW())
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_status 
ON profiles(onboarding_status);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id 
ON profiles(id);

-- Add new columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS country_code TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Update RLS policies for the new columns
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id); 