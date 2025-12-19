export interface ShoppingCartItem {
  id: number;
  user_id: number | null;
  product_id: number | null;
  quantity: number;
  added_at: Date;
}
