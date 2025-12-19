import { Pool } from 'pg';
import { Address, CreateAddressDTO, UpdateAddressDTO } from './address';

export class AddressRepository {
  constructor(private db: Pool) {}

  async findAll(): Promise<Address[]> {
    const result = await this.db.query<Address>('SELECT * FROM addresses ORDER BY id');
    return result.rows;
  }

  async findById(id: number): Promise<Address | null> {
    const result = await this.db.query<Address>(
      'SELECT * FROM addresses WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async findByUserId(userId: number): Promise<Address[]> {
    const result = await this.db.query<Address>(
      'SELECT * FROM addresses WHERE user_id = $1 ORDER BY id',
      [userId]
    );
    return result.rows;
  }

  async create(data: CreateAddressDTO): Promise<Address> {
    const result = await this.db.query<Address>(
      `INSERT INTO addresses (user_id, type, street, city, state, postal_code, country)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        data.user_id || null,
        data.type,
        data.street,
        data.city,
        data.state || null,
        data.postal_code,
        data.country,
      ]
    );
    return result.rows[0];
  }

  async update(id: number, data: UpdateAddressDTO): Promise<Address | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.user_id !== undefined) {
      fields.push(`user_id = $${paramCount++}`);
      values.push(data.user_id);
    }
    if (data.type !== undefined) {
      fields.push(`type = $${paramCount++}`);
      values.push(data.type);
    }
    if (data.street !== undefined) {
      fields.push(`street = $${paramCount++}`);
      values.push(data.street);
    }
    if (data.city !== undefined) {
      fields.push(`city = $${paramCount++}`);
      values.push(data.city);
    }
    if (data.state !== undefined) {
      fields.push(`state = $${paramCount++}`);
      values.push(data.state);
    }
    if (data.postal_code !== undefined) {
      fields.push(`postal_code = $${paramCount++}`);
      values.push(data.postal_code);
    }
    if (data.country !== undefined) {
      fields.push(`country = $${paramCount++}`);
      values.push(data.country);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await this.db.query<Address>(
      `UPDATE addresses SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.query('DELETE FROM addresses WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
