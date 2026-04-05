const express = require('express');
const router = express.Router();
const db = require('../db');

// Helper: attach variants/sizes/zones arrays to a product row
async function withDetails(products) {
  if (!products.length) return products;
  const ids = products.map(p => p.id);

  const [variants, sizes, zones] = await Promise.all([
    db('product_variants').whereIn('product_id', ids).select('product_id', 'variant'),
    db('product_sizes')   .whereIn('product_id', ids).select('product_id', 'size'),
    db('product_zones')   .whereIn('product_id', ids).select('product_id', 'zone'),
  ]);

  const group = (rows, key, val) => rows.reduce((m, r) => {
    (m[r[key]] = m[r[key]] || []).push(r[val]); return m;
  }, {});

  const vMap = group(variants, 'product_id', 'variant');
  const sMap = group(sizes,    'product_id', 'size');
  const zMap = group(zones,    'product_id', 'zone');

  return products.map(p => ({
    ...p,
    meta:     (() => { try { return p.meta ? JSON.parse(p.meta) : undefined; } catch { return null; } })(),
    variants: vMap[p.id] || [],
    sizes:    sMap[p.id] || [],
    zones:    zMap[p.id] || [],
  }));
}

// GET /api/products
router.get('/', async (req, res, next) => {
  try {
    const { category, subcategory, search, haccp, eco, page = 1, limit = 50 } = req.query;

    let query = db('products');

    if (category)    query = query.where('category_id', category);
    if (subcategory) query = query.where('subcategory_id', subcategory);
    if (haccp === 'true') query = query.where('haccp', true);

    if (eco === 'true') {
      query = query.whereIn('id',
        db('product_variants').where('variant', 'eco').select('product_id')
      );
    }

    if (search) {
      const q = `%${search.toLowerCase()}%`;
      query = query.where(b =>
        b.whereRaw('LOWER(name) LIKE ?', [q])
         .orWhereRaw('LOWER(formula) LIKE ?', [q])
         .orWhereRaw('LOWER(id) LIKE ?', [q])
      );
    }

    const total    = (await query.clone().count('id as n').first()).n;
    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, parseInt(limit));
    const rows     = await query.select('*').orderBy('id').offset((pageNum - 1) * limitNum).limit(limitNum);
    const products = await withDetails(rows);

    res.json({
      success: true,
      total,
      page:    pageNum,
      limit:   limitNum,
      pages:   Math.ceil(total / limitNum),
      products,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/categories
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await db('categories').select('*').orderBy('code');

    const allTags  = await db('category_tags').select('category_id', 'tag');
    const allSubs  = await db('subcategories').select('*');
    const counts   = await db('products').groupBy('category_id')
      .select('category_id').count('id as product_count');

    const tagMap   = allTags.reduce((m, r) => { (m[r.category_id] = m[r.category_id] || []).push(r.tag); return m; }, {});
    const subMap   = allSubs.reduce((m, r) => { (m[r.category_id] = m[r.category_id] || []).push(r);     return m; }, {});
    const countMap = counts.reduce((m, r) => { m[r.category_id] = r.product_count; return m; }, {});

    const total = (await db('products').count('id as n').first()).n;

    res.json({
      success: true,
      total_products: total,
      categories: categories.map(c => ({
        id:                c.id,
        code:              c.code,
        name:              c.name,
        name_en:           c.name_en,
        image:             c.image,
        product_count:     countMap[c.id] || 0,
        subcategory_count: (subMap[c.id] || []).length,
        tags:              tagMap[c.id]   || [],
        subcategories:     (subMap[c.id]  || []).map(s => ({ id: s.id, name: s.name, count: s.product_count })),
      })),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/services
router.get('/services', async (req, res, next) => {
  try {
    const services = await db('services').select('*').orderBy('id');
    res.json({ success: true, services });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const row = await db('products').whereRaw('LOWER(id) = ?', [req.params.id.toLowerCase()]).first();
    if (!row) return res.status(404).json({ success: false, message: 'Məhsul tapılmadı.' });

    const [product] = await withDetails([row]);
    const category  = await db('categories').where('id', row.category_id).first();

    res.json({ success: true, product, category });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
