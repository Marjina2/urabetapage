-- Add onboarding checkbox column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS has_completed_setup BOOLEAN DEFAULT FALSE;

-- Update existing rows
UPDATE profiles 
SET has_completed_setup = onboarding_completed 
WHERE has_completed_setup IS NULL; 