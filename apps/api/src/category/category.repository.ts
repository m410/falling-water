import { Pool } from 'pg';
import { Category, CreateCategoryDTO, UpdateCategoryDTO } from './category';

export class CategoryService {
  constructor(private db: Pool) {}

  async findAll(): Promise<Category[]> {
    const result = await this.db.query<Category>('SELECT * FROM categories ORDER BY id');
    return result.rows;
  }

  async findById(id: number): Promise<Category | null> {
    const result = await this.db.query<Category>(
      'SELECT * FROM categories WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async create(data: CreateCategoryDTO): Promise<Category> {
    const result = await this.db.query<Category>(
      `INSERT INTO categories (name, parent_id)
       VALUES ($1, $2)
       RETURNING *`,
      [data.name, data.parent_id || null]
    );
    return result.rows[0];
  }

  async update(id: number, data: UpdateCategoryDTO): Promise<Category | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(data.name);
    }
    if (data.parent_id !== undefined) {
      fields.push(`parent_id = $${paramCount++}`);
      values.push(data.parent_id);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);

    const result = await this.db.query<Category>(
      `UPDATE categories SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.query('DELETE FROM categories WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
