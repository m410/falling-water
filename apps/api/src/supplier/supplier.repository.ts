import { Pool } from 'pg';
import { Supplier, ProductSupplier, CreateSupplierDTO, UpdateSupplierDTO } from './supplier';
import { PagedResult } from '../shared/types';

export class SupplierRepository {
  constructor(private db: Pool) {}

  async findAll(): Promise<Supplier[]> {
    const result = await this.db.query<Supplier>('SELECT * FROM suppliers ORDER BY name');
    return result.rows;
  }

  async findPage(page: number = 1, pageSize: number = 10): Promise<PagedResult<Supplier>> {
    const offset = (page - 1) * pageSize;

    const countResult = await this.db.query<{ count: string }>('SELECT COUNT(*) FROM suppliers');
    const total = parseInt(countResult.rows[0].count, 10);

    const result = await this.db.query<Supplier>(
      'SELECT * FROM suppliers ORDER BY name LIMIT $1 OFFSET $2',
      [pageSize, offset]
    );

    return {
      data: result.rows,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findById(id: number): Promise<Supplier | null> {
    const result = await this.db.query<Supplier>(
      'SELECT * FROM suppliers WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async create(data: CreateSupplierDTO): Promise<Supplier> {
    const result = await this.db.query<Supplier>(
      `INSERT INTO suppliers (name, email, phone, website, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        data.name,
        data.email || null,
        data.phone || null,
        data.website || null,
        data.notes || null,
      ]
    );
    return result.rows[0];
  }

  async update(id: number, data: UpdateSupplierDTO): Promise<Supplier | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(data.name);
    }
    if (data.email !== undefined) {
      fields.push(`email = $${paramCount++}`);
      values.push(data.email);
    }
    if (data.phone !== undefined) {
      fields.push(`phone = $${paramCount++}`);
      values.push(data.phone);
    }
    if (data.website !== undefined) {
      fields.push(`website = $${paramCount++}`);
      values.push(data.website);
    }
    if (data.notes !== undefined) {
      fields.push(`notes = $${paramCount++}`);
      values.push(data.notes);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await this.db.query<Supplier>(
      `UPDATE suppliers SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.query('DELETE FROM suppliers WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  // Product-Supplier relationship methods
  async findProductsBySupplier(supplierId: number): Promise<ProductSupplier[]> {
    const result = await this.db.query<ProductSupplier>(
      'SELECT * FROM product_suppliers WHERE supplier_id = $1 ORDER BY product_id',
      [supplierId]
    );
    return result.rows;
  }

  async findSuppliersByProduct(productId: number): Promise<ProductSupplier[]> {
    const result = await this.db.query<ProductSupplier>(
      'SELECT * FROM product_suppliers WHERE product_id = $1 ORDER BY is_preferred DESC, supplier_id',
      [productId]
    );
    return result.rows;
  }

  async addProductToSupplier(
    supplierId: number,
    productId: number,
    costPrice?: number,
    supplierSku?: string,
    isPreferred?: boolean
  ): Promise<ProductSupplier> {
    const result = await this.db.query<ProductSupplier>(
      `INSERT INTO product_suppliers (supplier_id, product_id, cost_price, supplier_sku, is_preferred)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (product_id, supplier_id) DO UPDATE SET
         cost_price = COALESCE($3, product_suppliers.cost_price),
         supplier_sku = COALESCE($4, product_suppliers.supplier_sku),
         is_preferred = COALESCE($5, product_suppliers.is_preferred)
       RETURNING *`,
      [supplierId, productId, costPrice || null, supplierSku || null, isPreferred ?? false]
    );
    return result.rows[0];
  }

  async removeProductFromSupplier(supplierId: number, productId: number): Promise<boolean> {
    const result = await this.db.query(
      'DELETE FROM product_suppliers WHERE supplier_id = $1 AND product_id = $2',
      [supplierId, productId]
    );
    return (result.rowCount ?? 0) > 0;
  }
}
