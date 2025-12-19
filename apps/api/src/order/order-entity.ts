export interface Order {
  id: number;
  user_id: number | null;
  status: string;
  total_amount: number;
  created_at: Date;
  updated_at: Date;
}
