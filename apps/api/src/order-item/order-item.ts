export interface OrderItem {
  id: number;
  order_id: number | null;
  product_id: number | null;
  quantity: number;
  unit_price: number;
}

export interface CreateOrderItemDTO {
  order_id?: number;
  product_id?: number;
  quantity?: number;
  unit_price: number;
}

export interface UpdateOrderItemDTO {
  order_id?: number;
  product_id?: number;
  quantity?: number;
  unit_price?: number;
}
