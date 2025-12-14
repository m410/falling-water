export interface Address {
  id: number;
  user_id: number | null;
  type: string;
  street: string;
  city: string;
  state: string | null;
  postal_code: string;
  country: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateAddressDTO {
  user_id?: number;
  type: string;
  street: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
}

export interface UpdateAddressDTO {
  user_id?: number;
  type?: string;
  street?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}
