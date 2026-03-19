/**
 * Migration 001 — Product catalog
 * Tables: categories, subcategories, category_tags, products,
 *         product_variants, product_sizes, product_zones
 */

exports.up = async (knex) => {
  // ── categories ──────────────────────────────────────────────────────────────
  await knex.schema.createTable('categories', (t) => {
    t.string('id').primary();                  // e.g. "kimyevi"
    t.string('code', 10).notNullable();        // e.g. "KT"
    t.string('name').notNullable();
    t.string('name_en');
    t.text('image');
    t.timestamps(true, true);
  });

  // ── category_tags ────────────────────────────────────────────────────────────
  await knex.schema.createTable('category_tags', (t) => {
    t.increments('id');
    t.string('category_id').notNullable().references('id').inTable('categories').onDelete('CASCADE');
    t.string('tag', 50).notNullable();
    t.unique(['category_id', 'tag']);
  });

  // ── subcategories ────────────────────────────────────────────────────────────
  await knex.schema.createTable('subcategories', (t) => {
    t.string('id').primary();                  // e.g. "ktumt"
    t.string('category_id').notNullable().references('id').inTable('categories').onDelete('CASCADE');
    t.string('name').notNullable();
    t.integer('product_count').defaultTo(0);
  });

  // ── products ─────────────────────────────────────────────────────────────────
  await knex.schema.createTable('products', (t) => {
    t.string('id').primary();                  // e.g. "KTUMT-001"
    t.string('category_id').notNullable().references('id').inTable('categories');
    t.string('subcategory_id').references('id').inTable('subcategories');
    t.string('name').notNullable();
    t.string('formula');
    t.string('delivery_days', 20);
    t.text('image');
    t.boolean('haccp').defaultTo(false);
    t.json('meta');                            // optional type-specific fields
    t.timestamps(true, true);

    t.index('category_id');
    t.index('subcategory_id');
  });

  // ── product_variants ─────────────────────────────────────────────────────────
  await knex.schema.createTable('product_variants', (t) => {
    t.increments('id');
    t.string('product_id').notNullable().references('id').inTable('products').onDelete('CASCADE');
    t.string('variant', 60).notNullable();
    t.unique(['product_id', 'variant']);
  });

  // ── product_sizes ────────────────────────────────────────────────────────────
  await knex.schema.createTable('product_sizes', (t) => {
    t.increments('id');
    t.string('product_id').notNullable().references('id').inTable('products').onDelete('CASCADE');
    t.string('size', 30).notNullable();
    t.unique(['product_id', 'size']);
  });

  // ── product_zones ────────────────────────────────────────────────────────────
  await knex.schema.createTable('product_zones', (t) => {
    t.increments('id');
    t.string('product_id').notNullable().references('id').inTable('products').onDelete('CASCADE');
    t.string('zone', 80).notNullable();
    t.unique(['product_id', 'zone']);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('product_zones');
  await knex.schema.dropTableIfExists('product_sizes');
  await knex.schema.dropTableIfExists('product_variants');
  await knex.schema.dropTableIfExists('products');
  await knex.schema.dropTableIfExists('subcategories');
  await knex.schema.dropTableIfExists('category_tags');
  await knex.schema.dropTableIfExists('categories');
};
