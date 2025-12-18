import { Pool } from 'pg';
import { System, CreateSystemDTO, UpdateSystemDTO } from './system';
import { PagedResult } from '../shared/types';

interface SystemRow {
  id: number;
  name: string;
  desciption: string; // Note: typo in database column name
  min_flow_rate_cms: number;
  max_flow_rate_cms: number;
  min_head_mt: number;
  max_head_mt: number;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export class SystemRepository {
  constructor(private db: Pool) {}

  private mapRowToSystem(row: SystemRow, productIds: number[]): System {
    return {
      id: row.id,
      name: row.name,
      description: row.desciption, // Map from typo column name
      min_flow_rate_cms: Number(row.min_flow_rate_cms),
      max_flow_rate_cms: Number(row.max_flow_rate_cms),
      min_head_mt: Number(row.min_head_mt),
      max_head_mt: Number(row.max_head_mt),
      status: row.status,
      created_at: row.created_at,
      updated_at: row.updated_at,
      product_ids: productIds,
    };
  }

  async findAll(): Promise<System[]> {
    const systemsResult = await this.db.query<SystemRow>(
      'SELECT * FROM systems ORDER BY id'
    );

    const systemIds = systemsResult.rows.map((s) => s.id);
    if (systemIds.length === 0) return [];

    const productsResult = await this.db.query<{ system_id: number; product_id: number }>(
      'SELECT system_id, product_id FROM system_products WHERE system_id = ANY($1)',
      [systemIds]
    );

    const productsBySystemId = new Map<number, number[]>();
    for (const row of productsResult.rows) {
      const products = productsBySystemId.get(row.system_id) || [];
      products.push(row.product_id);
      productsBySystemId.set(row.system_id, products);
    }

    return systemsResult.rows.map((row) =>
      this.mapRowToSystem(row, productsBySystemId.get(row.id) || [])
    );
  }

  async findPage(page: number = 1, pageSize: number = 10): Promise<PagedResult<System>> {
    const offset = (page - 1) * pageSize;

    const countResult = await this.db.query<{ count: string }>('SELECT COUNT(*) FROM systems');
    const total = parseInt(countResult.rows[0].count, 10);

    const systemsResult = await this.db.query<SystemRow>(
      'SELECT * FROM systems ORDER BY id LIMIT $1 OFFSET $2',
      [pageSize, offset]
    );

    const systemIds = systemsResult.rows.map((s) => s.id);
    if (systemIds.length === 0) {
      return {
        data: [],
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    }

    const productsResult = await this.db.query<{ system_id: number; product_id: number }>(
      'SELECT system_id, product_id FROM system_products WHERE system_id = ANY($1)',
      [systemIds]
    );

    const productsBySystemId = new Map<number, number[]>();
    for (const row of productsResult.rows) {
      const products = productsBySystemId.get(row.system_id) || [];
      products.push(row.product_id);
      productsBySystemId.set(row.system_id, products);
    }

    return {
      data: systemsResult.rows.map((row) =>
        this.mapRowToSystem(row, productsBySystemId.get(row.id) || [])
      ),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findById(id: number): Promise<System | null> {
    const systemResult = await this.db.query<SystemRow>(
      'SELECT * FROM systems WHERE id = $1',
      [id]
    );

    if (!systemResult.rows[0]) return null;

    const productsResult = await this.db.query<{ product_id: number }>(
      'SELECT product_id FROM system_products WHERE system_id = $1',
      [id]
    );

    const productIds = productsResult.rows.map((r) => r.product_id);

    return this.mapRowToSystem(systemResult.rows[0], productIds);
  }

  async create(data: CreateSystemDTO): Promise<System> {
    const client = await this.db.connect();
    try {
      await client.query('BEGIN');

      const systemResult = await client.query<SystemRow>(
        `INSERT INTO systems (name, desciption, min_flow_rate_cms, max_flow_rate_cms, min_head_mt, max_head_mt, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          data.name,
          data.description,
          data.min_flow_rate_cms,
          data.max_flow_rate_cms,
          data.min_head_mt,
          data.max_head_mt,
          data.status || 'active',
        ]
      );

      const system = systemResult.rows[0];
      const productIds: number[] = [];

      if (data.product_ids && data.product_ids.length > 0) {
        for (const productId of data.product_ids) {
          await client.query(
            'INSERT INTO system_products (system_id, product_id) VALUES ($1, $2)',
            [system.id, productId]
          );
          productIds.push(productId);
        }
      }

      await client.query('COMMIT');

      return this.mapRowToSystem(system, productIds);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async update(id: number, data: UpdateSystemDTO): Promise<System | null> {
    const client = await this.db.connect();
    try {
      await client.query('BEGIN');

      const fields: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (data.name !== undefined) {
        fields.push(`name = $${paramCount++}`);
        values.push(data.name);
      }
      if (data.description !== undefined) {
        fields.push(`desciption = $${paramCount++}`); // Note: typo in column name
        values.push(data.description);
      }
      if (data.min_flow_rate_cms !== undefined) {
        fields.push(`min_flow_rate_cms = $${paramCount++}`);
        values.push(data.min_flow_rate_cms);
      }
      if (data.max_flow_rate_cms !== undefined) {
        fields.push(`max_flow_rate_cms = $${paramCount++}`);
        values.push(data.max_flow_rate_cms);
      }
      if (data.min_head_mt !== undefined) {
        fields.push(`min_head_mt = $${paramCount++}`);
        values.push(data.min_head_mt);
      }
      if (data.max_head_mt !== undefined) {
        fields.push(`max_head_mt = $${paramCount++}`);
        values.push(data.max_head_mt);
      }
      if (data.status !== undefined) {
        fields.push(`status = $${paramCount++}`);
        values.push(data.status);
      }

      let system: SystemRow | null = null;

      if (fields.length > 0) {
        fields.push(`updated_at = NOW()`);
        values.push(id);

        const result = await client.query<SystemRow>(
          `UPDATE systems SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
          values
        );
        system = result.rows[0] || null;
      } else {
        const result = await client.query<SystemRow>(
          'SELECT * FROM systems WHERE id = $1',
          [id]
        );
        system = result.rows[0] || null;
      }

      if (!system) {
        await client.query('ROLLBACK');
        return null;
      }

      // Handle product_ids update if provided
      if (data.product_ids !== undefined) {
        await client.query('DELETE FROM system_products WHERE system_id = $1', [id]);

        for (const productId of data.product_ids) {
          await client.query(
            'INSERT INTO system_products (system_id, product_id) VALUES ($1, $2)',
            [id, productId]
          );
        }
      }

      await client.query('COMMIT');

      // Fetch updated product_ids
      const productsResult = await this.db.query<{ product_id: number }>(
        'SELECT product_id FROM system_products WHERE system_id = $1',
        [id]
      );

      return this.mapRowToSystem(system, productsResult.rows.map((r) => r.product_id));
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.query('DELETE FROM systems WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
