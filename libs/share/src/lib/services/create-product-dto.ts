export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: number | null;
  source?: string;
  images?: { image_url: string; display_order?: number }[];
}
