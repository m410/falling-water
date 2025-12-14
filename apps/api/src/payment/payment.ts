export interface Payment {
  id: number;
  order_id: number | null;
  payment_method: string;
  amount: number;
  status: string;
  paid_at: Date | null;
}

export interface CreatePaymentDTO {
  order_id?: number;
  payment_method: string;
  amount: number;
  status?: string;
  paid_at?: Date;
}

export interface UpdatePaymentDTO {
  order_id?: number;
  payment_method?: string;
  amount?: number;
  status?: string;
  paid_at?: Date;
}
