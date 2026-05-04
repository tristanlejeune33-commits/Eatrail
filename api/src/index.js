// eatrail API — Express + Prisma + Postgres (Railway)
// Also serves the SPA static files from web/app/ in production (single-service deploy).
import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { prisma } from './db.js';
import { loadSession } from './auth/middleware.js';

import authRoutes from './routes/auth.js';
import oauthRoutes from './routes/oauth.js';
import recipesRoutes from './routes/recipes.js';
import shopsRoutes from './routes/shops.js';
import favoritesRoutes from './routes/favorites.js';
import cartRoutes from './routes/cart.js';
import pantryRoutes from './routes/pantry.js';
import reviewsRoutes from './routes/reviews.js';
import prefsRoutes from './routes/prefs.js';
import geoRoutes from './routes/geo.js';
import mealPlanRoutes from './routes/meal-plan.js';
import flavorDnaRoutes from './routes/flavor-dna.js';
import nutritionRoutes from './routes/nutrition.js';
import pushRoutes from './routes/push.js';
import submissionsRoutes from './routes/submissions.js';
import cronRoutes from './routes/cron.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// ─── Middleware ────────────────────────────────────────────
app.set('trust proxy', 1); // Railway puts us behind a proxy → enables req.ip + secure cookies
// CSP: allowlist for the SPA's external dependencies.
// Origins enabled:
//   img-src   : Pexels (recipe photos), Wikipedia uploads, Google Static Maps tiles, Mapbox tiles, blob/data
//   script-src: Mapbox GL JS (CDN)
//   connect-src: Mapbox tile/style/events endpoints + same-origin /api/*
//   style-src : self + 'unsafe-inline' (we inline a few small styles in JS)
//   font-src  : self only — fonts are served from /assets if needed
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'default-src': ["'self'"],
      'img-src': [
        "'self'",
        'data:',
        'blob:',
        'https://images.pexels.com',
        'https://upload.wikimedia.org',
        'https://maps.googleapis.com',
        'https://*.tiles.mapbox.com',
        'https://api.mapbox.com',
      ],
      'script-src': ["'self'", 'https://api.mapbox.com'],
      'connect-src': [
        "'self'",
        'https://api.mapbox.com',
        'https://events.mapbox.com',
        'https://*.tiles.mapbox.com',
      ],
      'style-src': [
        "'self'",
        "'unsafe-inline'",
        'https://api.mapbox.com',
        'https://fonts.googleapis.com',
      ],
      'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'],
      'worker-src': ["'self'", 'blob:'],
      'frame-ancestors': ["'self'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'object-src': ["'none'"],
    },
  },
  // Don't force HSTS in dev; Railway sets its own forwarded-proto
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
}));

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow no-origin (mobile apps, curl) AND any allowedOrigin
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return cb(null, true);
    }
    cb(new Error(`CORS: origin "${origin}" not allowed`));
  },
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(loadSession);

// ─── Health & root ─────────────────────────────────────────
// Note: GET / is handled by the SPA static fallback below (when SERVE_STATIC=true).
// If SERVE_STATIC=false (API-only deploy), the 404 handler at the bottom catches it.
app.get('/api', (_req, res) => res.json({ name: 'eatrail-api', version: '0.1.0', status: 'ok' }));
app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'up' });
  } catch (e) {
    res.status(503).json({ status: 'degraded', db: 'down', error: e.message });
  }
});

// ─── Routes ────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/auth', oauthRoutes);  // adds /google + /google/callback under /api/auth
app.use('/api/recipes', recipesRoutes);
app.use('/api/shops', shopsRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/pantry', pantryRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/prefs', prefsRoutes);
app.use('/api/geo', geoRoutes);
app.use('/api/meal-plan', mealPlanRoutes);
app.use('/api/flavor-dna', flavorDnaRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/push', pushRoutes);
app.use('/api/submissions', submissionsRoutes);
app.use('/api/cron', cronRoutes);

// ─── Static SPA (single-service deploy on Railway) ────────
// Serves web/app/* (HTML, CSS, JS, images) from this same Express server.
// Set SERVE_STATIC=false in env to disable (e.g. if you split frontend onto Vercel).
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try several candidate paths (handles different Railway/Vercel/Docker layouts).
function findSpaDir() {
  const candidates = [
    process.env.SPA_DIR,                                       // explicit override via env
    path.resolve(__dirname, '..', '..', 'web', 'app'),         // monorepo: api/src/ → ../../web/app
    path.resolve(__dirname, '..', 'web', 'app'),               // api/src/ if web copied into api/
    path.resolve(process.cwd(), 'web', 'app'),                 // cwd-relative
    path.resolve(process.cwd(), '..', 'web', 'app'),           // cwd is api/, web at parent
    '/app/web/app',                                            // Railway/Heroku standard mount
  ].filter(Boolean);

  for (const p of candidates) {
    if (fs.existsSync(path.join(p, 'index.html'))) return p;
  }
  return null;
}

const SPA_DIR = findSpaDir();
const SERVE_STATIC = process.env.SERVE_STATIC !== 'false' && SPA_DIR;

console.log(`[startup] cwd=${process.cwd()}`);
console.log(`[startup] __dirname=${__dirname}`);
console.log(`[startup] SPA_DIR resolved to: ${SPA_DIR || '(NOT FOUND — API-only mode)'}`);

if (SERVE_STATIC) {
  console.log(`Serving SPA from ${SPA_DIR}`);

  // Long-cache versioned assets (images, fonts), short-cache HTML/JS/CSS
  app.use(express.static(SPA_DIR, {
    etag: true,
    lastModified: true,
    maxAge: '1d',
    setHeaders(res, filePath) {
      if (/\.(html|js|css|json)$/i.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=300, must-revalidate');
      } else if (/\/assets\/recipes\//.test(filePath)) {
        // Recipe images can be cached for ~1 month
        res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
      }
    },
  }));

  // SPA fallback: any unknown non-/api path → serve index.html (hash router takes over)
  app.get(/^(?!\/api\/|\/health$).+/, (req, res, next) => {
    if (req.method !== 'GET') return next();
    res.sendFile(path.join(SPA_DIR, 'index.html'));
  });
}

// ─── 404 + error handler ───────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'not_found' }));
app.use((err, _req, res, _next) => {
  console.error('[error]', err);
  res.status(err.status || 500).json({
    error: err.code || 'internal_error',
    message: process.env.NODE_ENV === 'production' ? 'Server error' : err.message,
  });
});

// ─── Start ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`eatrail-api listening on :${PORT} (${process.env.NODE_ENV || 'development'})`);
  console.log(`CORS allowed: ${allowedOrigins.join(', ') || '<none — set ALLOWED_ORIGINS>'}`);
});

// Graceful shutdown
async function shutdown(sig) {
  console.log(`\n${sig} — shutting down`);
  await prisma.$disconnect().catch(() => {});
  process.exit(0);
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
