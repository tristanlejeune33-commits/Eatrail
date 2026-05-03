// /api/push — Web Push (VAPID) subscription + send
import { Router } from 'express';
import { z } from 'zod';
import webpush from 'web-push';
import { prisma } from '../db.js';
import { requireAuth } from '../auth/middleware.js';
import { validate, sendValidationError } from '../lib/zod-helpers.js';

const router = Router();

const PUB = process.env.VAPID_PUBLIC_KEY;
const PRIV = process.env.VAPID_PRIVATE_KEY;
const SUBJECT = process.env.VAPID_SUBJECT || 'mailto:contact@eatrail.com';

if (PUB && PRIV) {
  webpush.setVapidDetails(SUBJECT, PUB, PRIV);
}

// ─── GET /api/push/public-key — used by client to subscribe ───
router.get('/public-key', (_req, res) => {
  if (!PUB) return res.status(503).json({ error: 'push_not_configured' });
  res.json({ publicKey: PUB });
});

// ─── POST /api/push/subscribe (auth) ──────────────────────
const subscribeSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
});

router.post('/subscribe', requireAuth, async (req, res) => {
  const { data, error } = validate(subscribeSchema, req.body);
  if (error) return sendValidationError(res, error);

  const sub = await prisma.pushSubscription.upsert({
    where: { endpoint: data.endpoint },
    create: {
      userId: req.user.id,
      endpoint: data.endpoint,
      p256dh: data.keys.p256dh,
      auth: data.keys.auth,
      userAgent: (req.get('User-Agent') || '').slice(0, 500),
    },
    update: {
      userId: req.user.id,
      p256dh: data.keys.p256dh,
      auth: data.keys.auth,
    },
  });
  return res.status(201).json({ subscription: { id: sub.id } });
});

// ─── POST /api/push/unsubscribe (auth) ────────────────────
router.post('/unsubscribe', requireAuth, async (req, res) => {
  const endpoint = req.body?.endpoint;
  if (!endpoint) return res.status(400).json({ error: 'endpoint_required' });
  await prisma.pushSubscription.deleteMany({ where: { endpoint, userId: req.user.id } });
  res.json({ ok: true });
});

// ─── POST /api/push/test (auth) — send a test notif to self ───
router.post('/test', requireAuth, async (req, res) => {
  if (!PUB || !PRIV) return res.status(503).json({ error: 'push_not_configured' });
  const subs = await prisma.pushSubscription.findMany({ where: { userId: req.user.id } });
  if (subs.length === 0) return res.status(404).json({ error: 'no_subscription' });

  const payload = JSON.stringify({
    title: 'eatrail · test',
    body: 'Tes notifs marchent ! 🎉',
    url: '/',
    tag: 'test',
  });

  let sent = 0;
  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      );
      sent++;
    } catch (e) {
      if (e.statusCode === 410 || e.statusCode === 404) {
        await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
      }
    }
  }
  res.json({ sent });
});

// ─── HELPER: send push to user (for use in other route handlers) ───
export async function pushToUser(userId, payload) {
  if (!PUB || !PRIV) return { sent: 0 };
  const subs = await prisma.pushSubscription.findMany({ where: { userId } });
  let sent = 0;
  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify(payload)
      );
      sent++;
    } catch (e) {
      if (e.statusCode === 410 || e.statusCode === 404) {
        await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
      }
    }
  }
  return { sent };
}

export default router;
