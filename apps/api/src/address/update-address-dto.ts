export interface UpdateAddressDTO {
  user_id?: number;
  type?: string;
  street?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  lat?: number;
  log?: number;
}
