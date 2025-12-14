export interface Category {
  id: number;
  name: string;
  parent_id: number | null;
}

export interface CreateCategoryDTO {
  name: string;
  parent_id?: number;
}

export interface UpdateCategoryDTO {
  name?: string;
  parent_id?: number;
}
