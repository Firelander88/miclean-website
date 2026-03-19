const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../db');
const logger = require('../utils/logger');
const { sendMail } = require('../utils/mailer');

const validators = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Ad 2-100 simvol arasında olmalıdır.'),
  body('email').isEmail().normalizeEmail().withMessage('Düzgün email ünvanı daxil edin.'),
  body('phone').optional({ checkFalsy: true }).trim().isLength({ max: 30 }),
  body('hotel').trim().isLength({ min: 2, max: 150 }).withMessage('Otel/Şirkət adı 2-150 simvol arasında olmalıdır.'),
  body('hotel_stars').optional({ checkFalsy: true }).isIn(['3', '4', '5', 'other']).withMessage('Keçərsiz ulduz sayı.'),
  body('categories').isArray({ min: 1 }).withMessage('Ən azı bir kateqoriya seçin.'),
  body('notes').optional({ checkFalsy: true }).trim().isLength({ max: 1000 }),
  body('pilot').optional().isBoolean(),
];

// POST /api/quotes
router.post('/', validators, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Məlumatlar düzgün deyil.',
        errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
      });
    }

    const { name, email, phone, hotel, hotel_stars, categories, notes, pilot } = req.body;
    const id = `QT-${Date.now()}`;

    await db.transaction(async (trx) => {
      await trx('quote_requests').insert({
        id,
        name,
        email,
        phone:       phone       || null,
        hotel,
        hotel_stars: hotel_stars || null,
        notes:       notes       || null,
        pilot:       pilot === true || pilot === 'true',
        status:      'pending',
      });

      await trx('quote_request_categories').insert(
        categories.map(c => ({ quote_id: id, category: c }))
      );
    });

    sendMail({
      subject: `Qiymət Sorğusu: ${name} — ${hotel} (${hotel_stars || '?'} ulduz)`,
      html: `
        <h2 style="color:#C9A96E">Yeni Qiymət Sorğusu</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;font-weight:bold">ID:</td><td style="padding:8px">${id}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Ad:</td><td style="padding:8px">${name}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Email:</td><td style="padding:8px">${email}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Telefon:</td><td style="padding:8px">${phone || '—'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Otel/Şirkət:</td><td style="padding:8px">${hotel} (${hotel_stars || '?'} ulduz)</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Kateqoriyalar:</td><td style="padding:8px">${categories.join(', ')}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Pilot:</td><td style="padding:8px">${(pilot === true || pilot === 'true') ? 'Bəli' : 'Xeyr'}</td></tr>
          ${notes ? `<tr><td style="padding:8px;font-weight:bold;vertical-align:top">Qeydlər:</td><td style="padding:8px">${notes}</td></tr>` : ''}
        </table>
        <p style="color:#999;font-size:12px">ID: ${id}</p>
      `,
    });

    logger.info(`Yeni sorğu [${id}]: ${name} — ${hotel}`);

    res.json({
      success: true,
      message: 'Qiymət sorğunuz qəbul edildi. 24 saat ərzində sizinlə əlaqə saxlayacağıq.',
      id,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/quotes — admin only
router.get('/', async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'production' && req.headers['x-admin-key'] !== process.env.ADMIN_KEY) {
      return res.status(401).json({ success: false, message: 'İcazəsiz giriş.' });
    }

    const quotes = await db('quote_requests').select('*').orderBy('created_at', 'desc');
    const ids = quotes.map(q => q.id);

    const catRows = ids.length
      ? await db('quote_request_categories').whereIn('quote_id', ids).select('quote_id', 'category')
      : [];

    const catMap = catRows.reduce((m, r) => {
      (m[r.quote_id] = m[r.quote_id] || []).push(r.category); return m;
    }, {});

    const result = quotes.map(q => ({ ...q, categories: catMap[q.id] || [] }));

    res.json({ success: true, total: result.length, quotes: result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
