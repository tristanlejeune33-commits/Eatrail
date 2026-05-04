// /api/cron — endpoints called by an external scheduler (Railway cron schedules,
// cron-job.org, GitHub Actions, etc.). Auth = shared secret in `X-Cron-Secret`
// header (env CRON_SECRET). Returns 401 if the secret is missing or wrong.
//
// To wire this up on Railway:
//   1. Settings → Variables → add CRON_SECRET = <crypto.randomBytes(32).toString('hex')>
//   2. Either:
//      a) Settings → Cron Schedules → add `0 18 * * *` running:
//         curl -fsS -X POST -H "X-Cron-Secret: $CRON_SECRET" \
//              https://<your-app>.up.railway.app/api/cron/dinner-reminder
//      b) OR use cron-job.org / GitHub Actions to hit the URL daily at 18:00 local time.
//
// VAPID keys MUST also be configured for push to actually go out — without them,
// the endpoint returns 200 with `{ sent: 0, reason: 'push_not_configured' }`.

import { Router } from 'express';
import { prisma } from '../db.js';
import { pushToUser } from './push.js';

const router = Router();

// ── Auth middleware ──────────────────────────────────────
function requireCronSecret(req, res, next) {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    console.warn('[cron] CRON_SECRET is not set — endpoint disabled in this env');
    return res.status(503).json({ error: 'cron_not_configured' });
  }
  const got = req.get('X-Cron-Secret') || req.query.secret;
  if (got !== expected) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  next();
}

// ── POST /api/cron/dinner-reminder ───────────────────────
// Sends a push notification "Ce soir : <recipe>" to every user who has a
// PLANNED dinner meal-plan for today. Idempotent-ish: sending the same tag
// the same day silently replaces the previous notification (we use tag 'dinner').
//
// Run this once per day, ideally a few hours before dinner (e.g. 17:00 local).
router.post('/dinner-reminder', requireCronSecret, async (req, res) => {
  // Today's window. We use UTC date since Postgres @db.Date is timezone-less.
  // If Railway cron fires at 18:00 UTC (= 19:00 in Paris) we pick up today's plans.
  const now = new Date();
  const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const todayEnd = new Date(todayStart.getTime() + 24 * 3600 * 1000);

  const plans = await prisma.mealPlan.findMany({
    where: {
      status: 'PLANNED',
      slot: 'DINNER',
      date: { gte: todayStart, lt: todayEnd },
    },
    include: {
      recipe: { select: { id: true, title: true, country: true } },
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: [{ userId: 'asc' }, { position: 'asc' }],
  });

  if (plans.length === 0) {
    return res.json({ sent: 0, reason: 'no_plans_today', date: todayStart.toISOString().slice(0, 10) });
  }

  // One notif per user (their first PLANNED dinner today, by position).
  const seenUsers = new Set();
  const results = [];

  for (const p of plans) {
    if (seenUsers.has(p.userId)) continue;
    seenUsers.add(p.userId);

    const payload = {
      title: 'eatrail · ce soir',
      body: `🍽 Ce soir : ${p.recipe.title}`,
      url: `/#/recipe/${encodeURIComponent(p.recipe.id)}`,
      tag: 'dinner',
    };

    try {
      const r = await pushToUser(p.userId, payload);
      results.push({ userId: p.userId, recipeId: p.recipe.id, sent: r.sent });
    } catch (e) {
      console.error('[cron/dinner-reminder] push failed for user', p.userId, e.message);
      results.push({ userId: p.userId, recipeId: p.recipe.id, sent: 0, error: e.message });
    }
  }

  const totalSent = results.reduce((acc, r) => acc + (r.sent || 0), 0);
  console.log(`[cron/dinner-reminder] users=${results.length} pushes=${totalSent}`);
  return res.json({ users: results.length, pushes: totalSent, results });
});

export default router;
