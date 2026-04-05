const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

// Auth middleware
function requireAdmin(req, res, next) {
  const key = req.headers['x-admin-key'];
  if (!process.env.ADMIN_KEY) {
    logger.warn('ADMIN_KEY not set - admin access denied for safety');
    return res.status(503).json({ success: false, message: 'Admin əlçatan deyil - ADMIN_KEY konfiqurasiya olunmalıdır.' });
  }
  if (key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ success: false, message: 'İcazəsiz giriş.' });
  }
  next();
}

// POST /api/editor/save — Save site edits to JSON file
router.post('/save', requireAdmin, [
  body('changes').isObject().withMessage('Changes object required'),
  body('timestamp').optional().isString()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const savePath = path.join(__dirname, '..', 'data', 'site-edits.json');
    const existing = fs.existsSync(savePath) ? JSON.parse(fs.readFileSync(savePath, 'utf8')) : { edits: [] };
    existing.edits.push({
      changes: req.body.changes,
      timestamp: req.body.timestamp || new Date().toISOString(),
      savedAt: new Date().toISOString()
    });
    // Keep last 50 edits
    if (existing.edits.length > 50) existing.edits = existing.edits.slice(-50);
    fs.writeFileSync(savePath, JSON.stringify(existing, null, 2));
    logger.info('Site edits saved', { editCount: existing.edits.length });
    res.json({ success: true, message: 'Dəyişikliklər saxlanıldı.', editCount: existing.edits.length });
  } catch (err) {
    logger.error('Save failed', { error: err.message });
    res.status(500).json({ success: false, message: 'Saxlama xətası.' });
  }
});

// POST /api/editor/deploy — Placeholder deploy endpoint
router.post('/deploy', requireAdmin, (req, res) => {
  try {
    logger.info('Deploy requested', { timestamp: new Date().toISOString() });
    // In production, this would trigger Wix embed sync
    // For now, save deploy request and return success
    const deployPath = path.join(__dirname, '..', 'data', 'deploy-log.json');
    const existing = fs.existsSync(deployPath) ? JSON.parse(fs.readFileSync(deployPath, 'utf8')) : { deploys: [] };
    existing.deploys.push({
      timestamp: new Date().toISOString(),
      status: 'requested'
    });
    if (existing.deploys.length > 20) existing.deploys = existing.deploys.slice(-20);
    fs.writeFileSync(deployPath, JSON.stringify(existing, null, 2));
    res.json({ success: true, message: 'Deploy sorğusu qeydə alındı. Wix sinxronizasiyası üçün CLI istifadə edin.' });
  } catch (err) {
    logger.error('Deploy failed', { error: err.message });
    res.status(500).json({ success: false, message: 'Deploy xətası.' });
  }
});

module.exports = router;
