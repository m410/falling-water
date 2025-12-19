import { ProductImage } from './product-image';

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  category_id: number | null;
  source: string | null;
  created_at: Date;
  updated_at: Date;
  images: ProductImage[];
}
