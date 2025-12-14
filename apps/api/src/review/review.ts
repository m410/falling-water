export interface Review {
  id: number;
  product_id: number | null;
  user_id: number | null;
  rating: number;
  comment: string | null;
  created_at: Date;
}

export interface CreateReviewDTO {
  product_id?: number;
  user_id?: number;
  rating: number;
  comment?: string;
}

export interface UpdateReviewDTO {
  product_id?: number;
  user_id?: number;
  rating?: number;
  comment?: string;
}
