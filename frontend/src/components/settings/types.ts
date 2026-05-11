export type BusinessProfile = {
  id: string;
  user_id: string;
  business_name: string | null;
  description: string | null;
  logo_url: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  updated_at?: string | null;
};

export type OperatingHourRow = {
  id?: string;
  profile_id: string;
  day: string;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
};

