export interface ShoppingCartItem {
  id: number;
  user_id: number | null;
  product_id: number | null;
  quantity: number;
  added_at: Date;
}

export interface CreateShoppingCartItemDTO {
  user_id?: number;
  product_id?: number;
  quantity?: number;
}

export interface UpdateShoppingCartItemDTO {
  user_id?: number;
  product_id?: number;
  quantity?: number;
}
