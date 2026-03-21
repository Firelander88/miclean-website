const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../db');
const logger = require('../utils/logger');
const { sendMail, sendMailTo } = require('../utils/mailer');
const { escapeHtml } = require('../utils/escapeHtml');

const validators = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Ad 2-100 simvol arasında olmalıdır.'),
  body('email').isEmail().normalizeEmail().withMessage('Düzgün email ünvanı daxil edin.'),
  body('phone').optional({ checkFalsy: true }).isMobilePhone().withMessage('Düzgün telefon nömrəsi daxil edin.'),
  body('hotel').trim().isLength({ min: 2, max: 150 }).withMessage('Otel/Şirkət adı 2-150 simvol arasında olmalıdır.'),
  body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Mesaj 10-2000 simvol arasında olmalıdır.'),
];

// POST /api/contact
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

    const { name, email, phone, hotel, message } = req.body;
    const id = `MSG-${Date.now()}`;

    await db('contact_messages').insert({
      id,
      name,
      email,
      phone:   phone || null,
      hotel,
      message,
      status:  'new',
      ip:      req.ip,
    });

    sendMail({
      subject: `Yeni Mesaj: ${escapeHtml(name)} — ${escapeHtml(hotel)}`,
      html: `
        <h2 style="color:#C9A96E">Yeni Əlaqə Mesajı</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;font-weight:bold">Ad:</td><td style="padding:8px">${escapeHtml(name)}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Email:</td><td style="padding:8px">${escapeHtml(email)}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Telefon:</td><td style="padding:8px">${escapeHtml(phone || '—')}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Otel/Şirkət:</td><td style="padding:8px">${escapeHtml(hotel)}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;vertical-align:top">Mesaj:</td><td style="padding:8px">${escapeHtml(message).replace(/\n/g, '<br>')}</td></tr>
        </table>
        <p style="color:#999;font-size:12px">ID: ${escapeHtml(id)}</p>
      `,
    });

    // Confirmation email to customer (fire-and-forget)
    sendMailTo({
      to: email,
      subject: `Mesajınız alındı — MI CLEAN GROUP (${id})`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#f9f9f9;padding:32px 24px;border-radius:6px">
          <div style="text-align:center;margin-bottom:24px">
            <div style="font-size:11px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:#C9A96E">MI CLEAN GROUP MMC</div>
            <h1 style="font-size:20px;color:#07111C;margin:8px 0 0">Mesajınız alındı</h1>
          </div>
          <p style="color:#444;font-size:14px;line-height:1.7">Hörmətli <strong>${escapeHtml(name)}</strong>,</p>
          <p style="color:#444;font-size:14px;line-height:1.7">
            Müraciətiniz uğurla qeydə alındı. Komandamız <strong>ən qısa zamanda</strong> Sizinlə əlaqə saxlayacaq.
          </p>
          <div style="background:#fff;border:1px solid #e8e0d0;border-radius:4px;padding:16px 20px;margin:20px 0">
            <div style="font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#C9A96E;margin-bottom:12px">Müraciət Məlumatları</div>
            <table style="width:100%;font-size:13px;border-collapse:collapse">
              <tr><td style="padding:5px 0;color:#888;width:120px">Müraciət №:</td><td style="color:#07111C;font-weight:600">${escapeHtml(id)}</td></tr>
              <tr><td style="padding:5px 0;color:#888">Otel / Şirkət:</td><td style="color:#07111C">${escapeHtml(hotel)}</td></tr>
              <tr><td style="padding:5px 0;color:#888;vertical-align:top">Mesajınız:</td><td style="color:#555;font-size:12px;line-height:1.6">${escapeHtml(message).replace(/\n/g, '<br>')}</td></tr>
            </table>
          </div>
          <p style="color:#666;font-size:13px;line-height:1.7">
            Əlavə suallarınız üçün bizimlə <a href="https://wa.me/994500000000" style="color:#C9A96E">WhatsApp</a> vasitəsilə əlaqə saxlaya bilərsiniz.
          </p>
          <div style="border-top:1px solid #e8e0d0;margin-top:24px;padding-top:16px;text-align:center;font-size:11px;color:#aaa">
            MI CLEAN GROUP MMC · Bakı, Azərbaycan<br>Bu email avtomatik göndərilmişdir.
          </div>
        </div>
      `,
    });

    logger.info(`Yeni mesaj [${id}]: ${name} <${email}> — ${hotel}`);

    res.json({
      success: true,
      message: 'Mesajınız qəbul edildi. Ən qısa zamanda sizinlə əlaqə saxlayacağıq.',
      id,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/contact — admin only
router.get('/', async (req, res, next) => {
  try {
    if (process.env.ADMIN_KEY && req.headers['x-admin-key'] !== process.env.ADMIN_KEY) {
      return res.status(401).json({ success: false, message: 'İcazəsiz giriş.' });
    }
    const messages = await db('contact_messages').select('*').orderBy('created_at', 'desc');
    res.json({ success: true, total: messages.length, messages });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/contact/:id — update status, admin only
router.patch('/:id', async (req, res, next) => {
  try {
    if (process.env.ADMIN_KEY && req.headers['x-admin-key'] !== process.env.ADMIN_KEY) {
      return res.status(401).json({ success: false, message: 'İcazəsiz giriş.' });
    }
    const { status } = req.body;
    const allowed = ['new', 'read', 'replied', 'archived'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Keçərsiz status.' });
    }
    const updated = await db('contact_messages').where({ id: req.params.id }).update({ status });
    if (!updated) return res.status(404).json({ success: false, message: 'Tapılmadı.' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
