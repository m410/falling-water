export interface Supplier {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ProductSupplier {
  id: number;
  product_id: number;
  supplier_id: number;
  cost_price: number | null;
  supplier_sku: string | null;
  is_preferred: boolean;
  created_at: Date;
}
