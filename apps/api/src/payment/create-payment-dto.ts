export interface CreatePaymentDTO {
  order_id?: number;
  payment_method: string;
  amount: number;
  status?: string;
  paid_at?: Date;
}
