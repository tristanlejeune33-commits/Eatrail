// Cookie-based sessions with Postgres-backed storage.
// Token = 48 random bytes (base64url) — opaque to clients, sent only as httpOnly cookie.
import crypto from 'node:crypto';
import { prisma } from '../db.js';

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'eatrail_session';
const SESSION_DAYS = parseInt(process.env.SESSION_DAYS || '30', 10);
const IS_PROD = process.env.NODE_ENV === 'production';

export function newToken() {
  return crypto.randomBytes(48).toString('base64url');
}

export function hashIp(ip) {
  if (!ip) return null;
  const salt = process.env.IP_HASH_SALT || 'unsalted-dev';
  return crypto.createHash('sha256').update(salt + ':' + ip).digest('hex');
}

export async function createSession(userId, req) {
  const token = newToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt,
      userAgent: (req.get('User-Agent') || '').slice(0, 500),
      ipHash: hashIp(req.ip),
    },
  });
  return { token, expiresAt };
}

// SameSite: we use 'lax' in BOTH dev and prod because the SPA and the API
// live on the SAME origin (single-service Railway deploy). 'lax' is more
// robust on Safari iOS (which is increasingly strict on SameSite=none + ITP)
// and still allows top-level navigation cookies. If we ever split frontend
// onto a different origin (e.g. Vercel), set SAMESITE=none via env.
const SAMESITE = process.env.SESSION_COOKIE_SAMESITE || 'lax';

export function setSessionCookie(res, token, expiresAt) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: SAMESITE,
    expires: expiresAt,
    path: '/',
  });
}

export function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: SAMESITE,
    path: '/',
  });
}

export async function findSessionByToken(token) {
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });
  if (!session) return null;
  if (session.expiresAt < new Date()) {
    // Expired: clean up
    prisma.session.delete({ where: { token } }).catch(() => {});
    return null;
  }
  return session;
}

export async function touchSession(token) {
  await prisma.session.update({
    where: { token },
    data: { lastSeenAt: new Date() },
  }).catch(() => {});
}

export async function deleteSession(token) {
  if (!token) return;
  await prisma.session.delete({ where: { token } }).catch(() => {});
}

export const COOKIE_NAME_EXPORT = COOKIE_NAME;
