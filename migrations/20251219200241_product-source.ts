import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('products', (table) => {
    table.string('source', 32).nullable();
  });

  // Add user_id foreign key constraint to addresses table if not exists
  const hasUserIdColumn = await knex.schema.hasColumn('addresses', 'user_id');
  if (!hasUserIdColumn) {
    await knex.schema.alterTable('addresses', (table) => {
      table.bigInteger('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    });
  } else {
    // Add foreign key constraint if column exists but constraint doesn't
    await knex.raw(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE constraint_name = 'addresses_user_id_foreign'
          AND table_name = 'addresses'
        ) THEN
          ALTER TABLE addresses
          ADD CONSTRAINT addresses_user_id_foreign
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
        END IF;
      END $$;
    `);
  }

  // Add index on user_id for faster lookups
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
  `);

  // Add lat/log columns to addresses table
  await knex.schema.alterTable('addresses', (table) => {
    table.decimal('lat', 10, 7).nullable();
    table.decimal('log', 10, 7).nullable();
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('products', (table) => {
    table.dropColumn('source');
  });

  await knex.raw(`DROP INDEX IF EXISTS idx_addresses_user_id;`);

  // Drop lat/log columns from addresses table
  await knex.schema.alterTable('addresses', (table) => {
    table.dropColumn('lat');
    table.dropColumn('log');
  });

  // Note: We don't remove the user_id column/constraint in down migration
  // as it may have been created by the baseline schema
}

