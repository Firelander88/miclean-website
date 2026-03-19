const data = require('../../data/products.json');

// Fields stored in the products.meta JSON column (type-specific / optional)
const META_FIELDS = ['temp_range', 'series', 'logo_print', 'inci', 'colors',
  'standard', 'compostable', 'gsm', 'material', 'suitable_for', 'ph_range'];

exports.seed = async (knex) => {
  // ── Wipe in reverse FK order ─────────────────────────────────────────────────
  await knex('product_zones').del();
  await knex('product_sizes').del();
  await knex('product_variants').del();
  await knex('products').del();
  await knex('subcategories').del();
  await knex('category_tags').del();
  await knex('categories').del();

  // ── Categories ───────────────────────────────────────────────────────────────
  await knex('categories').insert(
    data.categories.map(c => ({
      id:         c.id,
      code:       c.code,
      name:       c.name,
      name_en:    c.name_en || null,
      image:      c.image  || null,
    }))
  );

  // ── Category tags ────────────────────────────────────────────────────────────
  const tagRows = [];
  for (const c of data.categories) {
    for (const tag of (c.tags || [])) {
      tagRows.push({ category_id: c.id, tag });
    }
  }
  if (tagRows.length) await knex('category_tags').insert(tagRows);

  // ── Subcategories ────────────────────────────────────────────────────────────
  const subRows = [];
  for (const c of data.categories) {
    for (const sub of (c.subcategories || [])) {
      subRows.push({
        id:            sub.id,
        category_id:   c.id,
        name:          sub.name,
        product_count: sub.count || 0,
      });
    }
  }
  if (subRows.length) await knex('subcategories').insert(subRows);

  // ── Products ─────────────────────────────────────────────────────────────────
  const productRows    = [];
  const variantRows    = [];
  const sizeRows       = [];
  const zoneRows       = [];

  for (const p of data.products) {
    // Collect optional meta fields
    const meta = {};
    for (const f of META_FIELDS) {
      if (p[f] !== undefined) meta[f] = p[f];
    }

    productRows.push({
      id:             p.id,
      category_id:    p.category,
      subcategory_id: p.subcategory || null,
      name:           p.name,
      formula:        p.formula        || null,
      delivery_days:  p.delivery_days  || null,
      image:          p.image          || null,
      haccp:          p.haccp          || false,
      meta:           Object.keys(meta).length ? JSON.stringify(meta) : null,
    });

    for (const v of (p.variants || [])) variantRows.push({ product_id: p.id, variant: v });
    for (const s of (p.sizes    || [])) sizeRows   .push({ product_id: p.id, size:    s });
    for (const z of (p.zones    || [])) zoneRows   .push({ product_id: p.id, zone:    z });
  }

  await knex('products').insert(productRows);

  // Insert child rows in chunks to avoid SQLite variable limit (999)
  const chunk = (arr, n) => { const r = []; for (let i = 0; i < arr.length; i += n) r.push(arr.slice(i, i + n)); return r; };
  for (const c of chunk(variantRows, 200)) await knex('product_variants').insert(c);
  for (const c of chunk(sizeRows,    200)) await knex('product_sizes').insert(c);
  for (const c of chunk(zoneRows,    200)) await knex('product_zones').insert(c);

  console.log(`  ✓ ${data.categories.length} categories, ${subRows.length} subcategories, ${productRows.length} products seeded.`);
};
