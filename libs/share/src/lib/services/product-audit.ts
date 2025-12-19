export interface ProductAudit {
  id: number;
  product_id: number;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  changed_fields: string[] | null;
  changed_by: number | null;
  changed_at: string;
  ip_address: string | null;
  user_agent: string | null;
  changed_by_username?: string;
}
