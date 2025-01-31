-- Add necessary columns if they don't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS has_completed_setup BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS onboarding_status TEXT DEFAULT 'not_started',
ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS onboarding_data JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Update existing rows
UPDATE profiles 
SET has_completed_setup = FALSE,
    onboarding_completed = FALSE,
    onboarding_status = 'not_started',
    onboarding_step = 1
WHERE has_completed_setup IS NULL; 