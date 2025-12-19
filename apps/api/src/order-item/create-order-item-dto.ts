export interface CreateOrderItemDTO {
  order_id?: number;
  product_id?: number;
  quantity?: number;
  unit_price: number;
}
