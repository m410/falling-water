import { Pool } from 'pg';
import { User, CreateUserDTO } from './user';


export class UserService {
  constructor(private db: Pool) {}

  async findAll(): Promise<User[]> {
    const result = await this.db.query<User>('SELECT * FROM users');
    return result.rows;
  }

  async findById(id: number): Promise<User | null> {
    const result = await this.db.query<User>(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async create(userData: CreateUserDTO): Promise<User> {
    const result = await this.db.query<User>(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [userData.name, userData.email]
    );
    return result.rows[0];
  }

  async update(id: number, userData: Partial<CreateUserDTO>): Promise<User | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (userData.name) {
      fields.push(`name = $${paramCount++}`);
      values.push(userData.name);
    }
    if (userData.email) {
      fields.push(`email = $${paramCount++}`);
      values.push(userData.email);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const result = await this.db.query<User>(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.query('DELETE FROM users WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
