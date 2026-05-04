/* eatrail · auth client (v2.0 — API-only)
 *
 * What this module does (and only this):
 *   - Mirrors the API session into `_apiUser` so views can read `eat.auth.current()` synchronously.
 *   - Wraps `eat.api.auth.{signup,login,logout}` with friendly error codes the views can map to FR text.
 *   - Validates email / password on the client BEFORE hitting the API (cheap UX).
 *   - Migrates guest localStorage data (favorites/cart/pantry) into the authenticated account on first login.
 *   - Pulls authoritative state from API → localStorage cache after login.
 *
 * What this module no longer does (Cleanup #6, May 2026):
 *   - No SHA-256 localStorage account system. The browser is no longer a credential store.
 *   - No password-reset tokens in localStorage (will be replaced by Resend-based email reset on the API).
 *   - No localStorage profile/password/delete editing — these need real API endpoints
 *     (PATCH /api/auth/me, POST /api/auth/me/password, DELETE /api/auth/me).
 *
 * Guest mode is still fully supported: anonymous users can browse recipes, save favorites,
 * fill a cart, and edit pantry — that data lives in localStorage and is migrated to their
 * account at signup/login. They just can't have a "local-only account" anymore.
 *
 * Public surface: `window.eat.auth.{...}`
 */

window.eat = window.eat || {};

(function (eat) {
  'use strict';

  // ── Validations ──────────────────────────────────────────
  const RX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const normEmail = (e) => String(e || '').trim().toLowerCase();

  eat.auth = eat.auth || {};

  eat.auth.validEmail = (email) => RX_EMAIL.test(normEmail(email));

  /**
   * Évaluation force mot de passe.
   * Retourne { score: 0..4, label, hints[], isAcceptable }
   */
  eat.auth.passwordStrength = function (pwd) {
    pwd = String(pwd || '');
    const hints = [];
    let score = 0;

    if (pwd.length >= 8) score++;
    else hints.push('au moins 8 caractères');

    if (pwd.length >= 12) score++;
    else if (pwd.length >= 8) hints.push('idéal : 12+ caractères');

    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    else hints.push('mélange minuscules + majuscules');

    if (/\d/.test(pwd)) score++;
    else hints.push('au moins un chiffre');

    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    else hints.push('au moins un caractère spécial');

    score = Math.min(4, score);
    const labels = ['Très faible', 'Faible', 'Correct', 'Bon', 'Excellent'];
    return { score, label: labels[score], hints, isAcceptable: score >= 1 };
  };

  // ── In-memory mirror of the API user ─────────────────────
  let _apiUser = null;
  function setApiUser(u) {
    if (!u) { _apiUser = null; return; }
    _apiUser = {
      id: u.id,
      email: u.email,
      name: u.name,
      avatar: u.avatarColor || (eat.AVATARS && eat.AVATARS[0]) || '🧑‍🍳',
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt,
    };
  }
  eat.auth.setApiUser = setApiUser;

  // Capture the API user once api-client.init() has resolved (whether logged-in or not).
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', async () => {
      if (eat.api && eat.api.ready) {
        try { await eat.api.ready; } catch {}
        if (eat.api.currentUser) {
          setApiUser(eat.api.currentUser);
          document.dispatchEvent(new CustomEvent('eat:auth:change', { detail: { type: 'restore', account: eat.auth.current() } }));
        }
      }
    });
  }

  eat.auth.current = () => _apiUser;
  eat.auth.isAuthenticated = () => !!_apiUser;

  // ── Signup ───────────────────────────────────────────────
  /**
   * Crée un compte via l'API.
   * data = { name, email, password, avatar? }
   * Retourne { ok, account?, error?, message? }
   *   error parmi : 'name', 'email-format', 'password-weak', 'email-taken',
   *                 'rate-limit', 'network', 'server', 'offline'
   */
  eat.auth.signup = async function (data) {
    const name = String(data.name || '').trim().slice(0, 32);
    const email = normEmail(data.email);
    const password = String(data.password || '');
    const avatar = data.avatar || (eat.AVATARS && eat.AVATARS[0]) || '🧑‍🍳';

    if (!name || name.length < 2) return { ok: false, error: 'name' };
    if (!RX_EMAIL.test(email)) return { ok: false, error: 'email-format' };
    const strength = eat.auth.passwordStrength(password);
    if (!strength.isAcceptable) return { ok: false, error: 'password-weak' };

    if (!eat.api) return { ok: false, error: 'offline', message: 'API non chargée' };
    try { await eat.api.ready; } catch {}
    if (!eat.api.isOnline) {
      return { ok: false, error: 'offline', message: 'Tu es hors-ligne. Réessaie quand la connexion revient.' };
    }

    try {
      const result = await eat.api.auth.signup(email, password, name, avatar);
      setApiUser(result.user);
      eat.api.currentUser = result.user;
      await migrateGuestDataToApi().catch(e => console.warn('[auth] migration failed:', e));
      document.dispatchEvent(new CustomEvent('eat:auth:change', { detail: { type: 'signup', account: eat.auth.current() } }));
      return { ok: true, account: eat.auth.current() };
    } catch (err) {
      if (err.code === 'email_taken') return { ok: false, error: 'email-taken' };
      if (err.code === 'invalid_input') return { ok: false, error: 'password-weak', message: err.message };
      if (err.code === 'too_many_requests') return { ok: false, error: 'rate-limit' };
      if (err.code === 'network') return { ok: false, error: 'network', message: err.message };
      console.error('[auth] signup error:', err.code, err.status, err.message);
      return { ok: false, error: 'server', message: `${err.code || 'http_' + (err.status||'?')}: ${err.message || ''}` };
    }
  };

  // ── Login ────────────────────────────────────────────────
  /**
   * Login via l'API.
   * Retourne { ok, account?, error?, message? }
   *   error parmi : 'email-format', 'wrong-password', 'rate-limit',
   *                 'network', 'server', 'offline'
   */
  eat.auth.login = async function (email, password /* remember unused — server cookie is 30d */) {
    email = normEmail(email);
    if (!RX_EMAIL.test(email)) return { ok: false, error: 'email-format' };

    if (!eat.api) return { ok: false, error: 'offline', message: 'API non chargée' };
    try { await eat.api.ready; } catch {}
    if (!eat.api.isOnline) {
      return { ok: false, error: 'offline', message: 'Tu es hors-ligne. Réessaie quand la connexion revient.' };
    }

    try {
      const result = await eat.api.auth.login(email, password);
      setApiUser(result.user);
      eat.api.currentUser = result.user;
      await syncDataAfterLogin().catch(e => console.warn('[auth] sync failed:', e));
      document.dispatchEvent(new CustomEvent('eat:auth:change', { detail: { type: 'login', account: eat.auth.current() } }));
      return { ok: true, account: eat.auth.current() };
    } catch (err) {
      if (err.code === 'invalid_credentials') return { ok: false, error: 'wrong-password' };
      if (err.code === 'invalid_input') return { ok: false, error: 'invalid-input', message: err.message };
      if (err.code === 'too_many_requests') return { ok: false, error: 'rate-limit' };
      if (err.code === 'network') return { ok: false, error: 'network', message: err.message };
      // Surface the real error code/status so the user (and we) know what went wrong.
      console.error('[auth] login error:', err.code, err.status, err.message);
      return { ok: false, error: 'server', message: `${err.code || 'http_' + (err.status||'?')}: ${err.message || ''}` };
    }
  };

  // ── Logout ───────────────────────────────────────────────
  eat.auth.logout = async function () {
    const prev = _apiUser;
    if (eat.api && eat.api.isOnline && _apiUser) {
      try { await eat.api.auth.logout(); } catch {}
    }
    setApiUser(null);
    if (eat.api) eat.api.currentUser = null;
    document.dispatchEvent(new CustomEvent('eat:auth:change', { detail: { type: 'logout', account: prev } }));
  };

  // ─── Sync helpers (guest data migration & post-login pull) ──
  async function migrateGuestDataToApi() {
    if (!eat.api || !eat.api.isOnline) return;
    const u = eat.api.currentUser;
    if (!u) return;

    // Favorites — collect from any per-account-scoped key + the legacy unscoped key.
    try {
      const merged = new Set();
      for (const k of Object.keys(localStorage)) {
        if (!k.startsWith('eatrail.v1.saved.')) continue;
        try {
          const arr = JSON.parse(localStorage.getItem(k) || '[]');
          if (Array.isArray(arr)) arr.forEach(id => id && merged.add(id));
        } catch {}
      }
      const all = [...merged];
      if (all.length > 0) await eat.api.favorites.import(all);
    } catch (e) { console.warn('[auth] migrate favorites:', e); }

    // Pantry (global, not per-account in current SPA)
    try {
      const pantry = JSON.parse(localStorage.getItem('eatrail.v1.pantry') || '[]');
      if (Array.isArray(pantry) && pantry.length > 0) {
        await eat.api.pantry.import(pantry);
      }
    } catch (e) { console.warn('[auth] migrate pantry:', e); }

    // Cart (per-account scoped)
    try {
      for (const k of Object.keys(localStorage)) {
        if (!k.startsWith('eatrail.v1.cart.')) continue;
        const cart = JSON.parse(localStorage.getItem(k) || '[]');
        if (Array.isArray(cart) && cart.length > 0) {
          const items = cart.map(c => ({
            ingredientName: c.name || c.ingredientName || c.label || 'item',
            qty: typeof c.qty === 'number' ? c.qty : null,
            unit: c.unit || null,
            recipeId: c.recipeId || c.recipe || null,
            shopId: c.shopId || c.shop || null,
            checked: !!c.checked,
          }));
          await eat.api.cart.import(items);
        }
      }
    } catch (e) { console.warn('[auth] migrate cart:', e); }
  }

  async function syncDataAfterLogin() {
    if (!eat.api || !eat.api.isOnline) return;
    const u = eat.api.currentUser;
    if (!u) return;

    // First push any guest data
    await migrateGuestDataToApi().catch(() => {});

    // Then pull authoritative state
    try {
      const favs = await eat.api.favorites.list();
      const ids = (favs.items || []).map(f => f.recipeId);
      localStorage.setItem(`eatrail.v1.saved.${u.id}`, JSON.stringify(ids));
    } catch (e) { console.warn('[auth] pull favorites:', e); }

    try {
      const cart = await eat.api.cart.list();
      const items = (cart.items || []).map(c => ({
        id: c.id,
        name: c.ingredientName,
        qty: c.qty,
        unit: c.unit,
        recipeId: c.recipeId,
        shopId: c.shopId,
        checked: c.checked,
      }));
      localStorage.setItem(`eatrail.v1.cart.${u.id}`, JSON.stringify(items));
    } catch (e) { console.warn('[auth] pull cart:', e); }

    try {
      const pantry = await eat.api.pantry.list();
      const names = (pantry.items || []).map(p => p.name);
      localStorage.setItem('eatrail.v1.pantry', JSON.stringify(names));
    } catch (e) { console.warn('[auth] pull pantry:', e); }
  }
  eat.auth.syncDataAfterLogin = syncDataAfterLogin;
  eat.auth.migrateGuestDataToApi = migrateGuestDataToApi;

  // ─── Stubs (TODO — require API endpoints) ───────────────
  // The following operations used to work against a localStorage account.
  // The localStorage account system was removed in cleanup #6 (May 2026).
  // To re-enable them, implement the matching API endpoints and call eat.api.auth.* here:
  //   updateProfile  → PATCH  /api/auth/me            (name, email, avatarColor)
  //   changePassword → POST   /api/auth/me/password   (currentPassword, newPassword)
  //   deleteAccount  → DELETE /api/auth/me            (password)
  //   requestReset / applyReset → email-based via Resend (POST /api/auth/forgot, POST /api/auth/reset)

  const NOT_IMPL = { ok: false, error: 'not-yet-implemented', message: 'Bientôt disponible — cette opération nécessite un endpoint serveur en cours d\'implémentation.' };
  const INVALID_TOKEN = { ok: false, error: 'invalid-token' };

  eat.auth.updateProfile = async () => NOT_IMPL;
  eat.auth.changePassword = async () => NOT_IMPL;
  eat.auth.deleteAccount = async () => NOT_IMPL;
  eat.auth.requestReset = () => ({ ok: true, token: null, exists: false }); // safe stub: never leaks email existence
  eat.auth.checkResetToken = () => null;                                     // → vue reset affiche "lien invalide"
  eat.auth.applyReset = async () => INVALID_TOKEN;

})(window.eat);
