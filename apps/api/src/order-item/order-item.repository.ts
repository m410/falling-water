import { Pool } from 'pg';
import { OrderItem, CreateOrderItemDTO, UpdateOrderItemDTO } from './order-item';

export class OrderItemRepository {
  constructor(private db: Pool) {}

  async findAll(): Promise<OrderItem[]> {
    const result = await this.db.query<OrderItem>('SELECT * FROM order_items ORDER BY id');
    return result.rows;
  }

  async findById(id: number): Promise<OrderItem | null> {
    const result = await this.db.query<OrderItem>(
      'SELECT * FROM order_items WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async create(data: CreateOrderItemDTO): Promise<OrderItem> {
    const result = await this.db.query<OrderItem>(
      `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        data.order_id || null,
        data.product_id || null,
        data.quantity ?? 1,
        data.unit_price,
      ]
    );
    return result.rows[0];
  }

  async update(id: number, data: UpdateOrderItemDTO): Promise<OrderItem | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.order_id !== undefined) {
      fields.push(`order_id = $${paramCount++}`);
      values.push(data.order_id);
    }
    if (data.product_id !== undefined) {
      fields.push(`product_id = $${paramCount++}`);
      values.push(data.product_id);
    }
    if (data.quantity !== undefined) {
      fields.push(`quantity = $${paramCount++}`);
      values.push(data.quantity);
    }
    if (data.unit_price !== undefined) {
      fields.push(`unit_price = $${paramCount++}`);
      values.push(data.unit_price);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);

    const result = await this.db.query<OrderItem>(
      `UPDATE order_items SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.query('DELETE FROM order_items WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
