const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../db');
const logger = require('../utils/logger');
const { sendMail } = require('../utils/mailer');
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

module.exports = router;
