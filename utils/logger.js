const { createWriteStream, mkdirSync } = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../logs');
try { mkdirSync(logsDir, { recursive: true }); } catch {}

const LEVELS = { error: 0, warn: 1, info: 2, http: 3, debug: 4 };
const COLORS = { error: '\x1b[31m', warn: '\x1b[33m', info: '\x1b[36m', http: '\x1b[35m', debug: '\x1b[37m', reset: '\x1b[0m' };

const currentLevel = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

const errorStream = createWriteStream(path.join(logsDir, 'error.log'), { flags: 'a' });
const combinedStream = createWriteStream(path.join(logsDir, 'combined.log'), { flags: 'a' });

function log(level, message, meta) {
  if (LEVELS[level] > LEVELS[currentLevel]) return;

  const ts = new Date().toISOString();
  const metaStr = meta ? ' ' + JSON.stringify(meta) : '';
  const line = `[${ts}] ${level.toUpperCase().padEnd(5)} ${message}${metaStr}\n`;

  combinedStream.write(line);
  if (level === 'error') errorStream.write(line);

  const color = COLORS[level] || '';
  process.stdout.write(`${color}${line}${COLORS.reset}`);
}

const logger = {
  error: (msg, meta) => log('error', msg, meta),
  warn:  (msg, meta) => log('warn',  msg, meta),
  info:  (msg, meta) => log('info',  msg, meta),
  http:  (msg, meta) => log('http',  msg, meta),
  debug: (msg, meta) => log('debug', msg, meta),
};

module.exports = logger;
