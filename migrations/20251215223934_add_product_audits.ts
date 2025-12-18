import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Create the product_audits table
  await knex.raw(`
    CREATE TABLE product_audits (
      id BIGSERIAL PRIMARY KEY,
      product_id BIGINT NOT NULL,
      operation VARCHAR(10) NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
      old_data JSONB,
      new_data JSONB,
      changed_fields TEXT[],
      changed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
      changed_at TIMESTAMP NOT NULL DEFAULT NOW(),
      ip_address INET,
      user_agent TEXT
    );
  `);

  // Create indexes for common queries
  await knex.raw(`
    CREATE INDEX idx_product_audits_product_id ON product_audits(product_id);
    CREATE INDEX idx_product_audits_changed_at ON product_audits(changed_at);
    CREATE INDEX idx_product_audits_operation ON product_audits(operation);
    CREATE INDEX idx_product_audits_changed_by ON product_audits(changed_by);
  `);

  // Create the trigger function
  await knex.raw(`
    CREATE OR REPLACE FUNCTION audit_product_changes()
    RETURNS TRIGGER AS $$
    DECLARE
      changed_fields_arr TEXT[] := '{}';
      old_json JSONB;
      new_json JSONB;
    BEGIN
      IF TG_OP = 'INSERT' THEN
        INSERT INTO product_audits (product_id, operation, new_data)
        VALUES (NEW.id, 'INSERT', to_jsonb(NEW));
        RETURN NEW;

      ELSIF TG_OP = 'UPDATE' THEN
        old_json := to_jsonb(OLD);
        new_json := to_jsonb(NEW);

        -- Determine which fields changed
        SELECT array_agg(key) INTO changed_fields_arr
        FROM (
          SELECT key FROM jsonb_each(old_json)
          EXCEPT
          SELECT key FROM jsonb_each(new_json)
          UNION
          SELECT key FROM jsonb_each(new_json)
          EXCEPT
          SELECT key FROM jsonb_each(old_json)
          UNION
          SELECT o.key
          FROM jsonb_each(old_json) o
          JOIN jsonb_each(new_json) n ON o.key = n.key
          WHERE o.value IS DISTINCT FROM n.value
        ) changed_keys;

        INSERT INTO product_audits (product_id, operation, old_data, new_data, changed_fields)
        VALUES (NEW.id, 'UPDATE', old_json, new_json, changed_fields_arr);
        RETURN NEW;

      ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO product_audits (product_id, operation, old_data)
        VALUES (OLD.id, 'DELETE', to_jsonb(OLD));
        RETURN OLD;
      END IF;

      RETURN NULL;
    END;
    $$ LANGUAGE plpgsql;
  `);

  // Create the trigger on the products table
  await knex.raw(`
    CREATE TRIGGER products_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW EXECUTE FUNCTION audit_product_changes();
  `);
}

export async function down(knex: Knex): Promise<void> {
  // Drop the trigger first
  await knex.raw(`DROP TRIGGER IF EXISTS products_audit_trigger ON products;`);

  // Drop the trigger function
  await knex.raw(`DROP FUNCTION IF EXISTS audit_product_changes();`);

  // Drop the indexes
  await knex.raw(`
    DROP INDEX IF EXISTS idx_product_audits_product_id;
    DROP INDEX IF EXISTS idx_product_audits_changed_at;
    DROP INDEX IF EXISTS idx_product_audits_operation;
    DROP INDEX IF EXISTS idx_product_audits_changed_by;
  `);

  // Drop the audit table
  await knex.raw(`DROP TABLE IF EXISTS product_audits;`);
}