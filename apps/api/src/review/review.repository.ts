import { Pool } from 'pg';
import { Review, CreateReviewDTO, UpdateReviewDTO } from './review';

export class ReviewService {
  constructor(private db: Pool) {}

  async findAll(): Promise<Review[]> {
    const result = await this.db.query<Review>('SELECT * FROM reviews ORDER BY id');
    return result.rows;
  }

  async findById(id: number): Promise<Review | null> {
    const result = await this.db.query<Review>(
      'SELECT * FROM reviews WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async create(data: CreateReviewDTO): Promise<Review> {
    const result = await this.db.query<Review>(
      `INSERT INTO reviews (product_id, user_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        data.product_id || null,
        data.user_id || null,
        data.rating,
        data.comment || null,
      ]
    );
    return result.rows[0];
  }

  async update(id: number, data: UpdateReviewDTO): Promise<Review | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.product_id !== undefined) {
      fields.push(`product_id = $${paramCount++}`);
      values.push(data.product_id);
    }
    if (data.user_id !== undefined) {
      fields.push(`user_id = $${paramCount++}`);
      values.push(data.user_id);
    }
    if (data.rating !== undefined) {
      fields.push(`rating = $${paramCount++}`);
      values.push(data.rating);
    }
    if (data.comment !== undefined) {
      fields.push(`comment = $${paramCount++}`);
      values.push(data.comment);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);

    const result = await this.db.query<Review>(
      `UPDATE reviews SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.query('DELETE FROM reviews WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
