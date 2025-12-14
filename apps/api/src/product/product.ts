export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  category_id: number | null;
  image_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateProductDTO {
  name: string;
  description?: string;
  price: number;
  stock_quantity?: number;
  category_id?: number;
  image_url?: string;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  stock_quantity?: number;
  category_id?: number;
  image_url?: string;
}
