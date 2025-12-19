export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  stock_quantity?: number;
  category_id?: number;
  source?: string;
  images?: { id?: number; image_url: string; display_order?: number }[];
}
