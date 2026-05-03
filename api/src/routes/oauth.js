// /api/auth/google — Google OAuth 2.0 (no passport dep, native fetch)
//
// Flow:
//   1. Client clicks "Login with Google" → GET /api/auth/google
//   2. We redirect to Google's consent screen
//   3. Google redirects back to /api/auth/google/callback?code=...
//   4. We exchange code for tokens, fetch user info, create/update user, set session cookie
//   5. Redirect to / (the SPA)
//
// Setup: see https://console.cloud.google.com/apis/credentials
// Authorized redirect URI must match: https://YOUR_HOST/api/auth/google/callback
import { Router } from 'express';
import crypto from 'node:crypto';
import { prisma } from '../db.js';
import { createSession, setSessionCookie, hashIp } from '../auth/sessions.js';

const router = Router();

const CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
const REDIRECT_PATH = '/api/auth/google/callback';

function isConfigured() { return !!(CLIENT_ID && CLIENT_SECRET); }

function fullCallbackUrl(req) {
  const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const host = req.headers['x-forwarded-host'] || req.get('host');
  return `${proto}://${host}${REDIRECT_PATH}`;
}

// GET /api/auth/google → redirect to Google
router.get('/google', (req, res) => {
  if (!isConfigured()) return res.status(503).json({ error: 'oauth_not_configured', message: 'Google OAuth non configuré côté serveur.' });

  const state = crypto.randomBytes(16).toString('base64url');
  // Stash state in a short-lived cookie for CSRF protection
  res.cookie('eatrail_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 10 * 60 * 1000, // 10 min
    path: REDIRECT_PATH,
  });

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: fullCallbackUrl(req),
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'online',
    prompt: 'select_account',
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

// GET /api/auth/google/callback → exchange code, login user
router.get('/google/callback', async (req, res) => {
  if (!isConfigured()) return res.status(503).send('OAuth not configured');

  const { code, state, error } = req.query;
  if (error) return res.redirect('/#/login?oauth_error=' + encodeURIComponent(error));
  const stashedState = req.cookies?.eatrail_oauth_state;
  if (!state || state !== stashedState) {
    return res.redirect('/#/login?oauth_error=state_mismatch');
  }
  res.clearCookie('eatrail_oauth_state', { path: REDIRECT_PATH });

  try {
    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: fullCallbackUrl(req),
        grant_type: 'authorization_code',
      }),
    });
    if (!tokenRes.ok) throw new Error('token exchange failed');
    const tokens = await tokenRes.json();

    // Fetch user info
    const infoRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: 'Bearer ' + tokens.access_token },
    });
    if (!infoRes.ok) throw new Error('userinfo failed');
    const info = await infoRes.json();
    // info: { sub (Google ID), email, name, picture, email_verified }

    if (!info.email) throw new Error('no email returned by Google');
    const emailLower = info.email.toLowerCase();

    // Find or create user
    let user = await prisma.user.findFirst({
      where: { OR: [{ googleId: info.sub }, { email: emailLower }] },
    });

    if (user) {
      // Link Google ID if not already
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId: info.sub, lastLoginAt: new Date(), emailVerifiedAt: info.email_verified ? new Date() : user.emailVerifiedAt },
        });
      } else {
        await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
      }
    } else {
      user = await prisma.user.create({
        data: {
          email: emailLower,
          passwordHash: null,
          name: info.name || info.email.split('@')[0],
          googleId: info.sub,
          emailVerifiedAt: info.email_verified ? new Date() : null,
          lastLoginAt: new Date(),
          preferences: { create: {} },
        },
      });
      await prisma.authEvent.create({
        data: { email: emailLower, userId: user.id, kind: 'signup_google', ipHash: hashIp(req.ip) },
      });
    }

    // Create session + redirect to SPA
    const { token, expiresAt } = await createSession(user.id, req);
    setSessionCookie(res, token, expiresAt);
    await prisma.authEvent.create({
      data: { email: emailLower, userId: user.id, kind: 'login_google', ipHash: hashIp(req.ip) },
    });
    res.redirect('/#/account');
  } catch (e) {
    console.error('[oauth] google callback failed:', e);
    res.redirect('/#/login?oauth_error=' + encodeURIComponent(e.message));
  }
});

router.get('/google/status', (_req, res) => {
  res.json({ configured: isConfigured() });
});

export default router;
