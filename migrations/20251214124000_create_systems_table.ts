import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE systems (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      desciption VARCHAR(1000) NOT NULL,
      min_flow_rate_cms Decimal(10,2) NOT NULL,
      max_flow_rate_cms Decimal(10,2) NOT NULL,
      min_head_mt Decimal(10,2) NOT NULL,
      max_head_mt Decimal(10,2) NOT NULL,
      status VARCHAR(50) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await knex.raw(`
    CREATE TABLE system_products (
      system_id INT NOT NULL REFERENCES systems(id) ON DELETE CASCADE,
      product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      PRIMARY KEY (system_id, product_id)
    )
  `);

  // Create product_images table for one-to-many relationship
  await knex.raw(`
    CREATE TABLE product_images (
      id BIGSERIAL PRIMARY KEY,
      product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      image_url VARCHAR(500) NOT NULL,
      display_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await knex.raw('CREATE INDEX idx_product_images_product ON product_images(product_id)');

  // Migrate existing image_url data to new table
  await knex.raw(`
    INSERT INTO product_images (product_id, image_url, display_order)
    SELECT id, image_url, 0
    FROM products
    WHERE image_url IS NOT NULL
  `);

  // Drop the old image_url column from products
  await knex.raw('ALTER TABLE products DROP COLUMN image_url');
}

export async function down(knex: Knex): Promise<void> {
  // Restore image_url column to products
  await knex.raw('ALTER TABLE products ADD COLUMN image_url VARCHAR(255)');

  // Migrate first image back to products table
  await knex.raw(`
    UPDATE products p
    SET image_url = pi.image_url
    FROM (
      SELECT DISTINCT ON (product_id) product_id, image_url
      FROM product_images
      ORDER BY product_id, display_order, id
    ) pi
    WHERE p.id = pi.product_id
  `);

  await knex.raw('DROP TABLE IF EXISTS product_images');
  await knex.raw('DROP TABLE IF EXISTS system_products');
  await knex.raw('DROP TABLE IF EXISTS systems');
}
