// Auth middleware: reads session cookie, attaches req.user + req.session.
// Use `requireAuth` to gate routes that need a logged-in user.
import { findSessionByToken, touchSession } from './sessions.js';

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'eatrail_session';

export async function loadSession(req, _res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  req.session = null;
  req.user = null;
  if (!token) return next();

  try {
    const session = await findSessionByToken(token);
    if (session && session.user.status === 'ACTIVE') {
      req.session = session;
      req.user = session.user;
      // Update lastSeen async (don't block response)
      touchSession(token).catch(() => {});
    }
  } catch (e) {
    // Don't fail the request on auth errors — just stay anonymous
    console.error('[auth] session load failed:', e.message);
  }
  next();
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'unauthorized', message: 'Auth required' });
  }
  next();
}
