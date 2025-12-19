export interface Address {
  id: number;
  user_id: number | null;
  type: string;
  street: string;
  city: string;
  state: string | null;
  postal_code: string;
  country: string;
  lat: number | null;
  log: number | null;
  created_at: Date;
  updated_at: Date;
}
