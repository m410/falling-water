import { Pool } from 'pg';
import { ShoppingCartItem, CreateShoppingCartItemDTO, UpdateShoppingCartItemDTO } from './shopping-cart-item';

export class ShoppingCartItemRepository {
  constructor(private db: Pool) {}

  async findAll(): Promise<ShoppingCartItem[]> {
    const result = await this.db.query<ShoppingCartItem>('SELECT * FROM shopping_cart_items ORDER BY id');
    return result.rows;
  }

  async findById(id: number): Promise<ShoppingCartItem | null> {
    const result = await this.db.query<ShoppingCartItem>(
      'SELECT * FROM shopping_cart_items WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async create(data: CreateShoppingCartItemDTO): Promise<ShoppingCartItem> {
    const result = await this.db.query<ShoppingCartItem>(
      `INSERT INTO shopping_cart_items (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [
        data.user_id || null,
        data.product_id || null,
        data.quantity ?? 1,
      ]
    );
    return result.rows[0];
  }

  async update(id: number, data: UpdateShoppingCartItemDTO): Promise<ShoppingCartItem | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.user_id !== undefined) {
      fields.push(`user_id = $${paramCount++}`);
      values.push(data.user_id);
    }
    if (data.product_id !== undefined) {
      fields.push(`product_id = $${paramCount++}`);
      values.push(data.product_id);
    }
    if (data.quantity !== undefined) {
      fields.push(`quantity = $${paramCount++}`);
      values.push(data.quantity);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);

    const result = await this.db.query<ShoppingCartItem>(
      `UPDATE shopping_cart_items SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.query('DELETE FROM shopping_cart_items WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
