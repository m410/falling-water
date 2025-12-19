export interface Review {
  id: number;
  product_id: number | null;
  user_id: number | null;
  rating: number;
  comment: string | null;
  created_at: Date;
}
