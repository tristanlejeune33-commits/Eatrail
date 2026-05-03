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

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// ─── Middleware ────────────────────────────────────────────
app.set('trust proxy', 1); // Railway puts us behind a proxy → enables req.ip + secure cookies
app.use(helmet({
  contentSecurityPolicy: false, // SPA loads from another origin; CSP set there
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
app.get('/', (_req, res) => res.json({ name: 'eatrail-api', version: '0.1.0', status: 'ok' }));
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

// ─── Static SPA (single-service deploy on Railway) ────────
// Serves web/app/* (HTML, CSS, JS, images) from this same Express server.
// Set SERVE_STATIC=false in env to disable (e.g. if you split frontend onto Vercel).
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SPA_DIR = path.resolve(__dirname, '..', '..', 'web', 'app');
const SERVE_STATIC = process.env.SERVE_STATIC !== 'false' && fs.existsSync(SPA_DIR);

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
