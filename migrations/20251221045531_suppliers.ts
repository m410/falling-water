import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Create suppliers table
  await knex.schema.createTable('suppliers', (table) => {
    table.bigIncrements('id').primary();
    table.string('name', 255).notNullable();
    table.string('email', 255).unique();
    table.string('phone', 50);
    table.string('website', 255);
    table.text('notes');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Create product_suppliers junction table for many-to-many relationship
  await knex.schema.createTable('product_suppliers', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('product_id').unsigned().notNullable()
      .references('id').inTable('products').onDelete('CASCADE');
    table.bigInteger('supplier_id').unsigned().notNullable()
      .references('id').inTable('suppliers').onDelete('CASCADE');
    table.decimal('cost_price', 10, 2);
    table.string('supplier_sku', 100);
    table.boolean('is_preferred').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.unique(['product_id', 'supplier_id']);
  });

  // Create indexes for faster lookups
  await knex.raw('CREATE INDEX idx_product_suppliers_product ON product_suppliers(product_id)');
  await knex.raw('CREATE INDEX idx_product_suppliers_supplier ON product_suppliers(supplier_id)');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('product_suppliers');
  await knex.schema.dropTableIfExists('suppliers');
}
