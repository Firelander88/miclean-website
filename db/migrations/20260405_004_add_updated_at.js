exports.up = function(knex) {
  return knex.schema
    .alterTable('contact_messages', t => { t.timestamp('updated_at'); })
    .alterTable('quote_requests', t => { t.timestamp('updated_at'); });
};
exports.down = function(knex) {
  return knex.schema
    .alterTable('contact_messages', t => { t.dropColumn('updated_at'); })
    .alterTable('quote_requests', t => { t.dropColumn('updated_at'); });
};
