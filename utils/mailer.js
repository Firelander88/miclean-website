const nodemailer = require('nodemailer');
const logger = require('./logger');

let _transporter = null;

function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) return null;

  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return _transporter;
}

/**
 * Send an email. Silently logs and returns false on failure.
 * @param {{ subject: string, html: string }} opts
 * @returns {Promise<boolean>}
 */
async function sendMail({ subject, html }) {
  const transporter = getTransporter();
  if (!transporter) return false;

  try {
    await transporter.sendMail({
      from: `"MI CLEAN GROUP Website" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      subject,
      html,
    });
    return true;
  } catch (err) {
    logger.error('Email göndərmə xətası', { message: err.message });
    return false;
  }
}

/**
 * Send an email to a specific recipient (e.g. customer confirmation).
 * @param {{ to: string, subject: string, html: string }} opts
 * @returns {Promise<boolean>}
 */
async function sendMailTo({ to, subject, html }) {
  const transporter = getTransporter();
  if (!transporter) return false;

  try {
    await transporter.sendMail({
      from: `"MI CLEAN GROUP" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (err) {
    logger.error('Müştəriyə email göndərmə xətası', { message: err.message, to });
    return false;
  }
}

module.exports = { sendMail, sendMailTo };
