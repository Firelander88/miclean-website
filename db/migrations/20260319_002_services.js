/**
 * Migration 002 — Services catalog
 */

exports.up = async (knex) => {
  await knex.schema.createTable('services', (t) => {
    t.string('id').primary();          // e.g. "SVC-001"
    t.string('name').notNullable();
    t.string('duration', 50);          // e.g. "1-3 gün"
    t.string('price_type', 50);        // e.g. "Pulsuz"
    t.text('description');
    t.timestamps(true, true);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('services');
};
