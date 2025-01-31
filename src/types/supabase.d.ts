export type Database = {
  public: {
    profiles: {
      id: string;
      username: string;
      avatar_url: string | null;
      first_name: string | null;
      last_name: string | null;
      phone_number: string | null;
      country_code: string | null;
      postal_code: string | null;
      email: string;
      onboarding_data: any | null;
      updated_at: string | null;
    }[];
  };
}; 