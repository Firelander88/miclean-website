const data = require('../../data/products.json');

exports.seed = async (knex) => {
  await knex('services').del();

  await knex('services').insert(
    data.services.map(s => ({
      id:          s.id,
      name:        s.name,
      duration:    s.duration    || null,
      price_type:  s.price_type  || null,
      description: s.description || null,
    }))
  );

  console.log(`  ✓ ${data.services.length} services seeded.`);
};
