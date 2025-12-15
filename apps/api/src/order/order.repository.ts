import { Pool } from 'pg';
import { Order, CreateOrderDTO, UpdateOrderDTO } from './order';

export class OrderRepository {
  constructor(private db: Pool) {}

  async findAll(): Promise<Order[]> {
    const result = await this.db.query<Order>('SELECT * FROM orders ORDER BY id');
    return result.rows;
  }

  async findById(id: number): Promise<Order | null> {
    const result = await this.db.query<Order>(
      'SELECT * FROM orders WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async findByUserId(userId: number): Promise<Order[]> {
    const result = await this.db.query<Order>(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  }

  async create(data: CreateOrderDTO): Promise<Order> {
    const result = await this.db.query<Order>(
      `INSERT INTO orders (user_id, status, total_amount)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [
        data.user_id || null,
        data.status || 'pending',
        data.total_amount,
      ]
    );
    return result.rows[0];
  }

  async update(id: number, data: UpdateOrderDTO): Promise<Order | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.user_id !== undefined) {
      fields.push(`user_id = $${paramCount++}`);
      values.push(data.user_id);
    }
    if (data.status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(data.status);
    }
    if (data.total_amount !== undefined) {
      fields.push(`total_amount = $${paramCount++}`);
      values.push(data.total_amount);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await this.db.query<Order>(
      `UPDATE orders SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.query('DELETE FROM orders WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
