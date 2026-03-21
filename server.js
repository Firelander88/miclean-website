require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { mkdirSync } = require('fs');
const logger = require('./utils/logger');

// Ensure required directories exist before DB / logger initialize
try { mkdirSync(path.join(__dirname, 'data'), { recursive: true }); } catch {}
try { mkdirSync(path.join(__dirname, 'logs'), { recursive: true }); } catch {}

const db = require('./db');
const contactRouter = require('./routes/contact');
const productsRouter = require('./routes/products');
const quotesRouter = require('./routes/quotes');

const app = express();
const PORT = process.env.PORT || 3000;
const { version } = require('./package.json');

// ── Security middleware ──────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc:     ["'self'", "https://images.unsplash.com", "data:"],
      fontSrc:    ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
      styleSrc:   ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc:  ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'"],
    },
  },
}));

// WARNING: ALLOWED_ORIGIN defaults to '*' (all origins) when not set.
// In production, set ALLOWED_ORIGIN=https://micleangroup.az in your .env file.
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['GET', 'POST'],
}));

// ── Compression ───────────────────────────────────────────────────────────────
app.use(compression());

// ── HTTP request logging ──────────────────────────────────────────────────────
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', {
  stream: { write: msg => logger.http(msg.trim()) },
}));

// ── Rate limiting ────────────────────────────────────────────────────────────
// Rate limiting is disabled in test environment to allow repeated test runs.
const isTest = process.env.NODE_ENV === 'test';

const apiLimiter = isTest
  ? (req, res, next) => next()
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, message: 'Çox sayda sorğu. Zəhmət olmasa 15 dəqiqə gözləyin.' },
    });

const contactLimiter = isTest
  ? (req, res, next) => next()
  : rateLimit({
      windowMs: 60 * 60 * 1000,
      max: 5,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, message: 'Saatda maksimum 5 mesaj göndərə bilərsiniz.' },
    });

// ── Body parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── Static files ─────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '7d' : 0,
  etag: true,
}));

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api', apiLimiter);
app.use('/api/products', productsRouter);
const postOnly = (limiter) => (req, res, next) => req.method === 'POST' ? limiter(req, res, next) : next();
app.use('/api/contact', postOnly(contactLimiter), contactRouter);
app.use('/api/quotes',  postOnly(contactLimiter), quotesRouter);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  let dbStatus = 'ok';
  try {
    await db.raw('SELECT 1');
  } catch {
    dbStatus = 'error';
  }
  const status = dbStatus === 'ok' ? 'ok' : 'degraded';
  res.status(status === 'ok' ? 200 : 503).json({
    status,
    db: dbStatus,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    version,
    env: process.env.NODE_ENV || 'development',
  });
});

// ── Admin panel ───────────────────────────────────────────────────────────────
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// ── SPA fallback ──────────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  logger.error(err.message, { stack: err.stack, path: req.path });
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Daxili server xətası.'
      : err.message,
  });
});

// ── Start (only when run directly, not when required by tests) ────────────────
if (require.main === module) {
  const server = app.listen(PORT, () => {
    logger.info(`MI CLEAN GROUP server işə başladı — http://localhost:${PORT} [${process.env.NODE_ENV || 'development'}] v${version}`);
  });

  // ── Graceful shutdown ───────────────────────────────────────────────────────
  function shutdown(signal) {
    logger.info(`${signal} alındı — server bağlanır...`);
    server.close(() => {
      logger.info('Server bağlandı.');
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000);
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
}

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection', { reason: String(reason) });
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', { message: err.message });
  process.exit(1);
});

module.exports = app;
