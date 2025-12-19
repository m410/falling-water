export interface OrderItem {
  id: number;
  order_id: number | null;
  product_id: number | null;
  quantity: number;
  unit_price: number;
}
