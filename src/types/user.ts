export interface UserProfile {
  id: string;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  first_name?: string | null;
  last_name?: string | null;
  phone_number?: string | null;
  country_code?: string | null;
  postal_code?: string | null;
  research_interests?: string[];
  research_goals?: string | null;
  one_thing_to_find?: string | null;
  preferred_tools?: string[];
  onboarding_completed?: boolean;
  onboarding_step?: number;
  onboarding_status?: string;
  has_completed_setup?: boolean;
  updated_at?: string;
  onboarding_data?: {
    firstName?: string | null;
    lastName?: string | null;
    country?: string | null;
    postalCode?: string | null;
    phoneNumber?: string | null;
    countryCode?: string | null;
    researchInterests?: string[];
    researchGoals?: string | null;
    oneThingToFind?: string | null;
    preferredTools?: string[];
    apiKeys?: Record<string, string>;
  };
}
