// /api/auth — signup, login, logout, me
import { Router } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { prisma } from '../db.js';
import { hashPassword, verifyPassword } from '../auth/bcrypt.js';
import { createSession, setSessionCookie, clearSessionCookie, deleteSession, hashIp } from '../auth/sessions.js';
import { requireAuth } from '../auth/middleware.js';
import { validate, sendValidationError } from '../lib/zod-helpers.js';

const router = Router();

// Tight rate limits on auth (prevent brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'too_many_requests', message: 'Trop de tentatives. Réessaie dans 15 min.' },
});

const signupSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(200),
  name: z.string().min(1).max(100),
  avatarColor: z.string().max(16).optional(),
});

const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(200),
});

function publicUser(u) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    avatarColor: u.avatarColor,
    createdAt: u.createdAt,
    lastLoginAt: u.lastLoginAt,
  };
}

// POST /api/auth/signup
router.post('/signup', authLimiter, async (req, res) => {
  const { data, error } = validate(signupSchema, req.body);
  if (error) return sendValidationError(res, error);

  const emailLower = data.email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: emailLower } });
  if (existing) {
    await prisma.authEvent.create({ data: { email: emailLower, kind: 'signup_duplicate', ipHash: hashIp(req.ip) } });
    return res.status(409).json({ error: 'email_taken', message: 'Cet email est déjà utilisé.' });
  }

  const passwordHash = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: {
      email: emailLower,
      passwordHash,
      name: data.name.trim(),
      avatarColor: data.avatarColor || null,
      lastLoginAt: new Date(),
      preferences: { create: {} }, // create empty prefs row
    },
  });

  const { token, expiresAt } = await createSession(user.id, req);
  setSessionCookie(res, token, expiresAt);

  await prisma.authEvent.create({ data: { email: emailLower, userId: user.id, kind: 'signup', ipHash: hashIp(req.ip), userAgent: (req.get('User-Agent') || '').slice(0, 500) } });

  return res.status(201).json({ user: publicUser(user) });
});

// POST /api/auth/login
router.post('/login', authLimiter, async (req, res) => {
  const { data, error } = validate(loginSchema, req.body);
  if (error) return sendValidationError(res, error);

  const emailLower = data.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: emailLower } });

  // Constant-time-ish: always verify against either real or dummy hash to mask user existence
  const dummyHash = '$2a$10$abcdefghijklmnopqrstuv1234567890ABCDEFGHIJKLMNOPQRSTUVWX';
  const ok = await verifyPassword(data.password, user?.passwordHash || dummyHash);

  if (!user || !ok || user.status !== 'ACTIVE') {
    await prisma.authEvent.create({
      data: { email: emailLower, userId: user?.id, kind: 'login_failed', ipHash: hashIp(req.ip), userAgent: (req.get('User-Agent') || '').slice(0, 500) },
    });
    return res.status(401).json({ error: 'invalid_credentials', message: 'Email ou mot de passe incorrect.' });
  }

  const { token, expiresAt } = await createSession(user.id, req);
  setSessionCookie(res, token, expiresAt);
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await prisma.authEvent.create({
    data: { email: emailLower, userId: user.id, kind: 'login_success', ipHash: hashIp(req.ip), userAgent: (req.get('User-Agent') || '').slice(0, 500) },
  });

  return res.json({ user: publicUser(user) });
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  const token = req.cookies?.[process.env.SESSION_COOKIE_NAME || 'eatrail_session'];
  if (token) await deleteSession(token);
  clearSessionCookie(res);
  return res.json({ ok: true });
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  if (!req.user) return res.json({ user: null });
  return res.json({ user: publicUser(req.user) });
});

// POST /api/auth/sessions/revoke-all (log out from all devices)
router.post('/sessions/revoke-all', requireAuth, async (req, res) => {
  await prisma.session.deleteMany({ where: { userId: req.user.id } });
  clearSessionCookie(res);
  return res.json({ ok: true });
});

// POST /api/auth/me/password — change own password (auth required, verify current)
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z.string().min(8).max(200),
});

router.post('/me/password', authLimiter, requireAuth, async (req, res) => {
  const { data, error } = validate(changePasswordSchema, req.body);
  if (error) return sendValidationError(res, error);

  // Refetch user with password hash (req.user from middleware has it but stay defensive).
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) return res.status(404).json({ error: 'not_found' });

  const ok = await verifyPassword(data.currentPassword, user.passwordHash);
  if (!ok) {
    await prisma.authEvent.create({
      data: { email: user.email, userId: user.id, kind: 'password_change_failed', ipHash: hashIp(req.ip), userAgent: (req.get('User-Agent') || '').slice(0, 500) },
    });
    return res.status(401).json({ error: 'wrong_current_password', message: 'Mot de passe actuel incorrect.' });
  }

  const newHash = await hashPassword(data.newPassword);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: newHash } });
  await prisma.authEvent.create({
    data: { email: user.email, userId: user.id, kind: 'password_changed', ipHash: hashIp(req.ip), userAgent: (req.get('User-Agent') || '').slice(0, 500) },
  });

  return res.json({ ok: true });
});

export default router;
