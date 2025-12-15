export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  user_id: number | null;
  status: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface AccountProfile {
  user: User;
  orders: Order[];
}
