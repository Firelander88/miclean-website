const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const db = require('../db');
const logger = require('../utils/logger');
const { sendMail, sendMailTo } = require('../utils/mailer');
const { escapeHtml } = require('../utils/escapeHtml');

const validators = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Ad 2-100 simvol arasında olmalıdır.'),
  body('email').isEmail().normalizeEmail().withMessage('Düzgün email ünvanı daxil edin.'),
  body('phone').optional({ checkFalsy: true }).trim().isLength({ max: 30 }).withMessage('Telefon nömrəsi 30 simvoldan çox ola bilməz.'),
  body('hotel').trim().isLength({ min: 2, max: 150 }).withMessage('Otel/Şirkət adı 2-150 simvol arasında olmalıdır.'),
  body('hotel_stars').optional({ checkFalsy: true }).isIn(['3', '4', '5', 'other']).withMessage('Keçərsiz ulduz sayı.'),
  body('categories').isArray({ min: 1, max: 10 }).withMessage('Ən azı bir kateqoriya seçin.'),
  body('notes').optional({ checkFalsy: true }).trim().isLength({ max: 1000 }).withMessage('Qeydlər 1000 simvoldan çox ola bilməz.'),
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

    const mailSent = await sendMail({
      subject: `Qiymət Sorğusu: ${escapeHtml(name)} — ${escapeHtml(hotel)} (${escapeHtml(hotel_stars || '?')} ulduz)`,
      html: `
        <h2 style="color:#C9A96E">Yeni Qiymət Sorğusu</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;font-weight:bold">ID:</td><td style="padding:8px">${escapeHtml(id)}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Ad:</td><td style="padding:8px">${escapeHtml(name)}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Email:</td><td style="padding:8px">${escapeHtml(email)}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Telefon:</td><td style="padding:8px">${escapeHtml(phone || '—')}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Otel/Şirkət:</td><td style="padding:8px">${escapeHtml(hotel)} (${escapeHtml(hotel_stars || '?')} ulduz)</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Kateqoriyalar:</td><td style="padding:8px">${categories.map(escapeHtml).join(', ')}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Pilot:</td><td style="padding:8px">${(pilot === true || pilot === 'true') ? 'Bəli' : 'Xeyr'}</td></tr>
          ${notes ? `<tr><td style="padding:8px;font-weight:bold;vertical-align:top">Qeydlər:</td><td style="padding:8px">${escapeHtml(notes)}</td></tr>` : ''}
        </table>
        <p style="color:#999;font-size:12px">ID: ${escapeHtml(id)}</p>
      `,
    });
    if (!mailSent) logger.warn('Admin notification email failed', { id });

    // Confirmation email to customer
    const userMailSent = await sendMailTo({
      to: email,
      subject: `Sorğunuz qəbul edildi — MI CLEAN GROUP (${id})`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#f9f9f9;padding:32px 24px;border-radius:6px">
          <div style="text-align:center;margin-bottom:24px">
            <div style="font-size:11px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:#C9A96E">MI CLEAN GROUP MMC</div>
            <h1 style="font-size:20px;color:#07111C;margin:8px 0 0">Sorğunuz qəbul edildi</h1>
          </div>
          <p style="color:#444;font-size:14px;line-height:1.7">Hörmətli <strong>${escapeHtml(name)}</strong>,</p>
          <p style="color:#444;font-size:14px;line-height:1.7">
            Qiymət sorğunuz uğurla qəbul edildi. Mütəxəssisimiz <strong>24 iş saatı</strong> ərzində Sizinlə əlaqə saxlayacaq.
          </p>
          <div style="background:#fff;border:1px solid #e8e0d0;border-radius:4px;padding:16px 20px;margin:20px 0">
            <div style="font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#C9A96E;margin-bottom:12px">Sorğu Məlumatları</div>
            <table style="width:100%;font-size:13px;border-collapse:collapse">
              <tr><td style="padding:5px 0;color:#888;width:120px">Sorğu №:</td><td style="color:#07111C;font-weight:600">${escapeHtml(id)}</td></tr>
              <tr><td style="padding:5px 0;color:#888">Otel / Şirkət:</td><td style="color:#07111C">${escapeHtml(hotel)}</td></tr>
              <tr><td style="padding:5px 0;color:#888">Kateqoriyalar:</td><td style="color:#07111C">${categories.map(escapeHtml).join(', ')}</td></tr>
              ${pilot === true || pilot === 'true' ? '<tr><td style="padding:5px 0;color:#888">Pilot Proqram:</td><td style="color:#C9A96E;font-weight:600">Bəli — Pilot proqrama daxil edildiniz</td></tr>' : ''}
            </table>
          </div>
          <p style="color:#666;font-size:13px;line-height:1.7">
            Əlavə suallarınız üçün bizimlə <a href="https://wa.me/994554882222" style="color:#C9A96E">WhatsApp</a> vasitəsilə əlaqə saxlaya bilərsiniz.
          </p>
          <div style="border-top:1px solid #e8e0d0;margin-top:24px;padding-top:16px;text-align:center;font-size:11px;color:#aaa">
            MI CLEAN GROUP MMC · Bakı, Azərbaycan<br>Bu email avtomatik göndərilmişdir.
          </div>
        </div>
      `,
    });
    if (!userMailSent) logger.warn('User confirmation email failed', { email });

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
    // Always enforce ADMIN_KEY when it is configured (not just in production).
    // In development without ADMIN_KEY set, access is allowed for convenience.
    if (!process.env.ADMIN_KEY || req.headers['x-admin-key'] !== process.env.ADMIN_KEY) {
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

// PATCH /api/quotes/:id — update status, admin only
router.patch('/:id', [
  param('id').matches(/^QT-\d+$/).withMessage('Invalid quote ID format'),
  body('status').trim().isIn(['pending', 'contacted', 'quoted', 'closed']).withMessage('Invalid status'),
], async (req, res, next) => {
  try {
    if (!process.env.ADMIN_KEY || req.headers['x-admin-key'] !== process.env.ADMIN_KEY) {
      return res.status(401).json({ success: false, message: 'İcazəsiz giriş.' });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Keçərsiz məlumat.', errors: errors.array() });
    }
    const { status } = req.body;
    const updated = await db('quote_requests').where({ id: req.params.id }).update({ status, updated_at: new Date().toISOString() });
    if (!updated) return res.status(404).json({ success: false, message: 'Tapılmadı.' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
