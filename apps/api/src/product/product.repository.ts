import { Pool } from 'pg';
import { Product, CreateProductDTO, UpdateProductDTO } from './product';

export class ProductService {
  constructor(private db: Pool) {}

  async findAll(): Promise<Product[]> {
    const result = await this.db.query<Product>('SELECT * FROM products ORDER BY id');
    return result.rows;
  }

  async findById(id: number): Promise<Product | null> {
    const result = await this.db.query<Product>(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async create(productData: CreateProductDTO): Promise<Product> {
    const result = await this.db.query<Product>(
      `INSERT INTO products (name, description, price, stock_quantity, category_id, image_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        productData.name,
        productData.description || null,
        productData.price,
        productData.stock_quantity ?? 0,
        productData.category_id || null,
        productData.image_url || null,
      ]
    );
    return result.rows[0];
  }

  async update(id: number, productData: UpdateProductDTO): Promise<Product | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (productData.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(productData.name);
    }
    if (productData.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(productData.description);
    }
    if (productData.price !== undefined) {
      fields.push(`price = $${paramCount++}`);
      values.push(productData.price);
    }
    if (productData.stock_quantity !== undefined) {
      fields.push(`stock_quantity = $${paramCount++}`);
      values.push(productData.stock_quantity);
    }
    if (productData.category_id !== undefined) {
      fields.push(`category_id = $${paramCount++}`);
      values.push(productData.category_id);
    }
    if (productData.image_url !== undefined) {
      fields.push(`image_url = $${paramCount++}`);
      values.push(productData.image_url);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await this.db.query<Product>(
      `UPDATE products SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.query('DELETE FROM products WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
