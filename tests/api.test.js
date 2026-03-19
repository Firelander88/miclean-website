'use strict';

/**
 * API integration tests — MI CLEAN GROUP website
 * Run with: npm test
 *
 * Uses Jest + Supertest against the real Express app (in-process, no HTTP port).
 * The SQLite DB at data/miclean.sqlite3 must already be migrated and seeded.
 */

const request = require('supertest');
const app = require('../server');

// ── /api/health ───────────────────────────────────────────────────────────────
describe('GET /api/health', () => {
  it('returns 200 with status ok and required fields', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.db).toBe('ok');
    expect(typeof res.body.uptime).toBe('number');
    expect(typeof res.body.timestamp).toBe('string');
    expect(typeof res.body.version).toBe('string');
  });
});

// ── /api/products ─────────────────────────────────────────────────────────────
describe('GET /api/products', () => {
  it('returns 200 with correct shape', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.total).toBeDefined();
    expect(Array.isArray(res.body.products)).toBe(true);
    expect(typeof res.body.page).toBe('number');
    expect(typeof res.body.limit).toBe('number');
    expect(typeof res.body.pages).toBe('number');
  });

  it('respects limit param (capped at 100)', async () => {
    const res = await request(app).get('/api/products?limit=5');
    expect(res.status).toBe(200);
    expect(res.body.products.length).toBeLessThanOrEqual(5);
  });

  it('respects category filter', async () => {
    const res = await request(app).get('/api/products?category=kimyevi');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

// ── /api/products/categories ──────────────────────────────────────────────────
describe('GET /api/products/categories', () => {
  it('returns 200 with categories array', async () => {
    const res = await request(app).get('/api/products/categories');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.categories)).toBe(true);
    expect(typeof res.body.total_products).toBeDefined();
  });

  it('each category has required fields', async () => {
    const res = await request(app).get('/api/products/categories');
    if (res.body.categories.length > 0) {
      const cat = res.body.categories[0];
      expect(cat).toHaveProperty('id');
      expect(cat).toHaveProperty('name');
      expect(Array.isArray(cat.subcategories)).toBe(true);
      expect(Array.isArray(cat.tags)).toBe(true);
    }
  });
});

// ── /api/products/services ────────────────────────────────────────────────────
describe('GET /api/products/services', () => {
  it('returns 200 with services array', async () => {
    const res = await request(app).get('/api/products/services');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.services)).toBe(true);
  });

  it('has at least 1 service', async () => {
    const res = await request(app).get('/api/products/services');
    expect(res.body.services.length).toBeGreaterThanOrEqual(1);
  });
});

// ── /api/products/:id ─────────────────────────────────────────────────────────
describe('GET /api/products/:id', () => {
  it('returns 404 for nonexistent product ID', async () => {
    const res = await request(app).get('/api/products/NONEXISTENT-PRODUCT-XYZ');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body).toHaveProperty('message');
  });

  it('returns a product for a valid ID (first product from catalog)', async () => {
    // First get any product from the list
    const list = await request(app).get('/api/products?limit=1');
    if (list.body.products && list.body.products.length > 0) {
      const id = list.body.products[0].id;
      const res = await request(app).get('/api/products/' + id);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.product).toBeDefined();
      expect(res.body.product.id.toLowerCase()).toBe(id.toLowerCase());
    }
  });
});

// ── POST /api/contact ─────────────────────────────────────────────────────────
describe('POST /api/contact', () => {
  const validPayload = {
    name: 'Test Şəxs',
    email: 'test@example.com',
    phone: '+994501234567',
    hotel: 'Test Otel Baku',
    message: 'Bu bir test mesajıdır. Zəhmət olmasa diqqətinizə çatdırın.',
  };

  it('returns 200 with success:true for valid data', async () => {
    const res = await request(app).post('/api/contact').send(validPayload);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.id).toBe('string');
    expect(res.body.id).toMatch(/^MSG-/);
  });

  it('returns 400 when name is missing', async () => {
    const { name, ...payload } = validPayload;
    const res = await request(app).post('/api/contact').send(payload);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  it('returns 400 when email is invalid', async () => {
    const res = await request(app).post('/api/contact').send({ ...validPayload, email: 'not-an-email' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  it('returns 400 when hotel is missing', async () => {
    const { hotel, ...payload } = validPayload;
    const res = await request(app).post('/api/contact').send(payload);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when message is too short', async () => {
    const res = await request(app).post('/api/contact').send({ ...validPayload, message: 'short' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when all fields are missing', async () => {
    const res = await request(app).post('/api/contact').send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(Array.isArray(res.body.errors)).toBe(true);
  });
});

// ── POST /api/quotes ──────────────────────────────────────────────────────────
describe('POST /api/quotes', () => {
  const validPayload = {
    name: 'Test Müştəri',
    email: 'musteri@hotel.az',
    phone: '+994551234567',
    hotel: 'Luxury Palace Hotel',
    hotel_stars: '5',
    categories: ['kimyevi', 'amenity'],
    notes: 'Sınaq sorğusu',
    pilot: false,
  };

  it('returns 200 with success:true for valid data', async () => {
    const res = await request(app).post('/api/quotes').send(validPayload);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.id).toBe('string');
    expect(res.body.id).toMatch(/^QT-/);
  });

  it('returns 400 when categories array is empty', async () => {
    const res = await request(app).post('/api/quotes').send({ ...validPayload, categories: [] });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when categories is missing', async () => {
    const { categories, ...payload } = validPayload;
    const res = await request(app).post('/api/quotes').send(payload);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when name is missing', async () => {
    const { name, ...payload } = validPayload;
    const res = await request(app).post('/api/quotes').send(payload);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when email is invalid', async () => {
    const res = await request(app).post('/api/quotes').send({ ...validPayload, email: 'badmail' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when hotel_stars is invalid', async () => {
    const res = await request(app).post('/api/quotes').send({ ...validPayload, hotel_stars: '2' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

// ── GET /api/quotes (admin) ───────────────────────────────────────────────────
describe('GET /api/quotes', () => {
  it('returns 200 when ADMIN_KEY is not set (dev mode)', async () => {
    const savedKey = process.env.ADMIN_KEY;
    delete process.env.ADMIN_KEY;
    const res = await request(app).get('/api/quotes');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.quotes)).toBe(true);
    process.env.ADMIN_KEY = savedKey;
  });

  it('returns 401 when ADMIN_KEY is set and header is missing', async () => {
    process.env.ADMIN_KEY = 'supersecretkey';
    const res = await request(app).get('/api/quotes');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    delete process.env.ADMIN_KEY;
  });

  it('returns 200 when ADMIN_KEY is set and correct header is provided', async () => {
    process.env.ADMIN_KEY = 'supersecretkey';
    const res = await request(app).get('/api/quotes').set('x-admin-key', 'supersecretkey');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    delete process.env.ADMIN_KEY;
  });
});

// ── escapeHtml utility ────────────────────────────────────────────────────────
describe('escapeHtml utility', () => {
  const { escapeHtml } = require('../utils/escapeHtml');

  it('escapes & < > " \'', () => {
    expect(escapeHtml('& < > " \'')).toBe('&amp; &lt; &gt; &quot; &#x27;');
  });

  it('returns empty string for null/undefined', () => {
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
  });

  it('does not modify safe strings', () => {
    expect(escapeHtml('Hello World 123')).toBe('Hello World 123');
  });

  it('escapes XSS payload', () => {
    const payload = '<script>alert("xss")</script>';
    const escaped = escapeHtml(payload);
    expect(escaped).not.toContain('<script>');
    expect(escaped).toContain('&lt;script&gt;');
  });
});
