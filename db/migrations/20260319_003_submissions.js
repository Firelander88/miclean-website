/**
 * Migration 003 — Customer submissions
 * Tables: contact_messages, quote_requests, quote_request_categories
 */

exports.up = async (knex) => {
  // ── contact_messages ─────────────────────────────────────────────────────────
  await knex.schema.createTable('contact_messages', (t) => {
    t.string('id').primary();                  // e.g. "MSG-1234567890"
    t.string('name', 100).notNullable();
    t.string('email', 254).notNullable();
    t.string('phone', 30);
    t.string('hotel', 150).notNullable();
    t.text('message').notNullable();
    t.enum('status', ['new', 'read', 'replied', 'archived']).defaultTo('new');
    t.string('ip', 45);
    t.timestamp('created_at').defaultTo(knex.fn.now());

    t.index('status');
    t.index('created_at');
  });

  // ── quote_requests ───────────────────────────────────────────────────────────
  await knex.schema.createTable('quote_requests', (t) => {
    t.string('id').primary();                  // e.g. "QT-1234567890"
    t.string('name', 100).notNullable();
    t.string('email', 254).notNullable();
    t.string('phone', 30);
    t.string('hotel', 150).notNullable();
    t.enum('hotel_stars', ['3', '4', '5', 'other']);
    t.text('notes');
    t.boolean('pilot').defaultTo(false);
    t.enum('status', ['pending', 'contacted', 'quoted', 'closed']).defaultTo('pending');
    t.timestamp('created_at').defaultTo(knex.fn.now());

    t.index('status');
    t.index('created_at');
  });

  // ── quote_request_categories (junction) ──────────────────────────────────────
  await knex.schema.createTable('quote_request_categories', (t) => {
    t.increments('id');
    t.string('quote_id').notNullable().references('id').inTable('quote_requests').onDelete('CASCADE');
    t.string('category', 100).notNullable();
    t.unique(['quote_id', 'category']);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('quote_request_categories');
  await knex.schema.dropTableIfExists('quote_requests');
  await knex.schema.dropTableIfExists('contact_messages');
};
