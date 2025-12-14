import { Pool } from 'pg';
import { Payment, CreatePaymentDTO, UpdatePaymentDTO } from './payment';

export class PaymentService {
  constructor(private db: Pool) {}

  async findAll(): Promise<Payment[]> {
    const result = await this.db.query<Payment>('SELECT * FROM payments ORDER BY id');
    return result.rows;
  }

  async findById(id: number): Promise<Payment | null> {
    const result = await this.db.query<Payment>(
      'SELECT * FROM payments WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async create(data: CreatePaymentDTO): Promise<Payment> {
    const result = await this.db.query<Payment>(
      `INSERT INTO payments (order_id, payment_method, amount, status, paid_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        data.order_id || null,
        data.payment_method,
        data.amount,
        data.status || 'pending',
        data.paid_at || null,
      ]
    );
    return result.rows[0];
  }

  async update(id: number, data: UpdatePaymentDTO): Promise<Payment | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.order_id !== undefined) {
      fields.push(`order_id = $${paramCount++}`);
      values.push(data.order_id);
    }
    if (data.payment_method !== undefined) {
      fields.push(`payment_method = $${paramCount++}`);
      values.push(data.payment_method);
    }
    if (data.amount !== undefined) {
      fields.push(`amount = $${paramCount++}`);
      values.push(data.amount);
    }
    if (data.status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(data.status);
    }
    if (data.paid_at !== undefined) {
      fields.push(`paid_at = $${paramCount++}`);
      values.push(data.paid_at);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);

    const result = await this.db.query<Payment>(
      `UPDATE payments SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.query('DELETE FROM payments WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
