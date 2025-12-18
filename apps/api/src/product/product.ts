export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  display_order: number;
  created_at: Date;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  category_id: number | null;
  created_at: Date;
  updated_at: Date;
  images: ProductImage[];
}

export interface CreateProductDTO {
  name: string;
  description?: string;
  price: number;
  stock_quantity?: number;
  category_id?: number;
  images?: { image_url: string; display_order?: number }[];
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  stock_quantity?: number;
  category_id?: number;
  images?: { id?: number; image_url: string; display_order?: number }[];
}