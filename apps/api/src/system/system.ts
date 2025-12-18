export interface System {
  id: number;
  name: string;
  description: string;
  min_flow_rate_cms: number;
  max_flow_rate_cms: number;
  min_head_mt: number;
  max_head_mt: number;
  status: string;
  created_at: Date;
  updated_at: Date;
  product_ids: number[];
}

export interface CreateSystemDTO {
  name: string;
  description: string;
  min_flow_rate_cms: number;
  max_flow_rate_cms: number;
  min_head_mt: number;
  max_head_mt: number;
  status?: string;
  product_ids?: number[];
}

export interface UpdateSystemDTO {
  name?: string;
  description?: string;
  min_flow_rate_cms?: number;
  max_flow_rate_cms?: number;
  min_head_mt?: number;
  max_head_mt?: number;
  status?: string;
  product_ids?: number[];
}
