import { Pool } from 'pg';
import { Product, ProductImage, CreateProductDTO, UpdateProductDTO } from './product';
import { ProductAudit } from './product-audit';
import { PagedResult } from '../shared/types';

interface ProductRow {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  category_id: number | null;
  source: string | null;
  created_at: Date;
  updated_at: Date;
}

export class ProductRepository {
  constructor(private db: Pool) {}

  async findAll(): Promise<Product[]> {
    const productsResult = await this.db.query<ProductRow>(
      'SELECT * FROM products ORDER BY id'
    );

    const productIds = productsResult.rows.map((p) => p.id);
    if (productIds.length === 0) return [];

    const imagesResult = await this.db.query<ProductImage>(
      'SELECT * FROM product_images WHERE product_id = ANY($1) ORDER BY display_order, id',
      [productIds]
    );

    const imagesByProductId = new Map<number, ProductImage[]>();
    for (const image of imagesResult.rows) {
      const images = imagesByProductId.get(image.product_id) || [];
      images.push(image);
      imagesByProductId.set(image.product_id, images);
    }

    return productsResult.rows.map((product) => ({
      ...product,
      images: imagesByProductId.get(product.id) || [],
    }));
  }

  async findPage(page: number = 1, pageSize: number = 10): Promise<PagedResult<Product>> {
    const offset = (page - 1) * pageSize;

    const countResult = await this.db.query<{ count: string }>('SELECT COUNT(*) FROM products');
    const total = parseInt(countResult.rows[0].count, 10);

    const productsResult = await this.db.query<ProductRow>(
      'SELECT * FROM products ORDER BY id LIMIT $1 OFFSET $2',
      [pageSize, offset]
    );

    const productIds = productsResult.rows.map((p) => p.id);
    if (productIds.length === 0) {
      return {
        data: [],
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    }

    const imagesResult = await this.db.query<ProductImage>(
      'SELECT * FROM product_images WHERE product_id = ANY($1) ORDER BY display_order, id',
      [productIds]
    );

    const imagesByProductId = new Map<number, ProductImage[]>();
    for (const image of imagesResult.rows) {
      const images = imagesByProductId.get(image.product_id) || [];
      images.push(image);
      imagesByProductId.set(image.product_id, images);
    }

    return {
      data: productsResult.rows.map((product) => ({
        ...product,
        images: imagesByProductId.get(product.id) || [],
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findById(id: number): Promise<Product | null> {
    const productResult = await this.db.query<ProductRow>(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );

    if (!productResult.rows[0]) return null;

    const imagesResult = await this.db.query<ProductImage>(
      'SELECT * FROM product_images WHERE product_id = $1 ORDER BY display_order, id',
      [id]
    );

    return {
      ...productResult.rows[0],
      images: imagesResult.rows,
    };
  }

  async create(productData: CreateProductDTO): Promise<Product> {
    const client = await this.db.connect();
    try {
      await client.query('BEGIN');

      const productResult = await client.query<ProductRow>(
        `INSERT INTO products (name, description, price, stock_quantity, category_id, source)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          productData.name,
          productData.description || null,
          productData.price,
          productData.stock_quantity ?? 0,
          productData.category_id || null,
          productData.source || null,
        ]
      );

      const product = productResult.rows[0];
      const images: ProductImage[] = [];

      if (productData.images && productData.images.length > 0) {
        for (let i = 0; i < productData.images.length; i++) {
          const img = productData.images[i];
          const imageResult = await client.query<ProductImage>(
            `INSERT INTO product_images (product_id, image_url, display_order)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [product.id, img.image_url, img.display_order ?? i]
          );
          images.push(imageResult.rows[0]);
        }
      }

      await client.query('COMMIT');

      return { ...product, images };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async update(id: number, productData: UpdateProductDTO): Promise<Product | null> {
    const client = await this.db.connect();
    try {
      await client.query('BEGIN');

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
      if (productData.source !== undefined) {
        fields.push(`source = $${paramCount++}`);
        values.push(productData.source);
      }

      let product: ProductRow | null = null;

      if (fields.length > 0) {
        fields.push(`updated_at = NOW()`);
        values.push(id);

        const result = await client.query<ProductRow>(
          `UPDATE products SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
          values
        );
        product = result.rows[0] || null;
      } else {
        const result = await client.query<ProductRow>(
          'SELECT * FROM products WHERE id = $1',
          [id]
        );
        product = result.rows[0] || null;
      }

      if (!product) {
        await client.query('ROLLBACK');
        return null;
      }

      // Handle images update if provided
      if (productData.images !== undefined) {
        // Delete existing images
        await client.query('DELETE FROM product_images WHERE product_id = $1', [id]);

        // Insert new images
        for (let i = 0; i < productData.images.length; i++) {
          const img = productData.images[i];
          await client.query(
            `INSERT INTO product_images (product_id, image_url, display_order)
             VALUES ($1, $2, $3)`,
            [id, img.image_url, img.display_order ?? i]
          );
        }
      }

      await client.query('COMMIT');

      // Fetch updated images
      const imagesResult = await this.db.query<ProductImage>(
        'SELECT * FROM product_images WHERE product_id = $1 ORDER BY display_order, id',
        [id]
      );

      return { ...product, images: imagesResult.rows };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.query('DELETE FROM products WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async findAuditHistory(productId: number): Promise<ProductAudit[]> {
    const result = await this.db.query<ProductAudit & { username: string | null }>(
      `SELECT
        pa.*,
        u.email as username
      FROM product_audits pa
      LEFT JOIN users u ON pa.changed_by = u.id
      WHERE pa.product_id = $1
      ORDER BY pa.changed_at DESC`,
      [productId]
    );

    return result.rows.map(row => ({
      ...row,
      changed_by_username: row.username || undefined,
    }));
  }
}