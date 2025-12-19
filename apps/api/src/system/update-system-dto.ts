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
