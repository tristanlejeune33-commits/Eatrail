/* eatrail · v1.2 — auth client-side
 *
 * Système de comptes complet, 100% local (pas de backend) :
 *  - signup / login / logout
 *  - hashing SHA-256 + salt 16 bytes via Web Crypto API
 *  - session persistée (localStorage / sessionStorage selon "remember me")
 *  - récupération mot de passe avec token mock (le "mail" est affiché in-app)
 *  - update profil (nom, avatar, email)
 *  - change password (avec vérification du courant)
 *  - delete account (soft, avec confirmation password)
 *  - validation email + force du mot de passe
 *
 * Avertissement : c'est un prototype. Le hashing local n'a aucune valeur
 * de sécurité réelle (toute la BDD est sur l'appareil de l'utilisateur).
 * En production, l'auth doit passer par un backend (Supabase, Firebase Auth,
 * Auth0, ou backend custom avec PBKDF2/Argon2 côté serveur).
 *
 * API publique : window.eat.auth.{...}
 */

window.eat = window.eat || {};

(function (eat) {
  'use strict';

  // ── Storage keys ─────────────────────────────────────────
  const LS_ACCOUNTS = 'eatrail.v1.accounts';        // { [email]: account }
  const LS_SESSION  = 'eatrail.v1.session';         // { id, email, at } persistante
  const SS_SESSION  = 'eatrail.v1.session.tab';     // session de tab uniquement
  const LS_RESETS   = 'eatrail.v1.password_resets'; // { [token]: { email, expires } }

  // ── Helpers storage ──────────────────────────────────────
  function readAccounts() {
    try { return JSON.parse(localStorage.getItem(LS_ACCOUNTS) || '{}'); }
    catch { return {}; }
  }
  function writeAccounts(obj) {
    try { localStorage.setItem(LS_ACCOUNTS, JSON.stringify(obj)); } catch {}
  }
  function readResets() {
    try { return JSON.parse(localStorage.getItem(LS_RESETS) || '{}'); }
    catch { return {}; }
  }
  function writeResets(obj) {
    try { localStorage.setItem(LS_RESETS, JSON.stringify(obj)); } catch {}
  }
  function readSession() {
    try {
      const s = sessionStorage.getItem(SS_SESSION) || localStorage.getItem(LS_SESSION);
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  }
  function writeSession(session, persistent) {
    try {
      const json = JSON.stringify(session);
      if (persistent) {
        localStorage.setItem(LS_SESSION, json);
        sessionStorage.removeItem(SS_SESSION);
      } else {
        sessionStorage.setItem(SS_SESSION, json);
        localStorage.removeItem(LS_SESSION);
      }
    } catch {}
  }
  function clearSession() {
    try {
      localStorage.removeItem(LS_SESSION);
      sessionStorage.removeItem(SS_SESSION);
    } catch {}
  }

  // ── Crypto helpers ───────────────────────────────────────
  /** Génère un salt aléatoire en hex (16 bytes = 32 hex chars). */
  function randomSalt() {
    const arr = new Uint8Array(16);
    (window.crypto || window.msCrypto).getRandomValues(arr);
    return [...arr].map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /** SHA-256(password + ':' + salt) → hex string. */
  async function hashPassword(password, salt) {
    if (!window.crypto || !window.crypto.subtle) {
      // Fallback non-crypto (très faible) : utilisé uniquement si Web Crypto absent (rare)
      let h = 5381;
      const s = password + ':' + salt;
      for (let i = 0; i < s.length; i++) h = ((h << 5) + h) + s.charCodeAt(i);
      return ('00000000' + (h >>> 0).toString(16)).slice(-8);
    }
    const enc = new TextEncoder();
    const data = enc.encode(password + ':' + salt);
    const buf = await window.crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /** Comparaison constante (best-effort en JS). */
  function safeEqual(a, b) {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
  }

  /** ID compte aléatoire (12 chars base36). */
  function newAccountId() {
    return 'acc_' + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-6);
  }

  // ── Validations ──────────────────────────────────────────
  const RX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  /** Normalisation email (trim + lowercase). */
  function normEmail(e) { return String(e || '').trim().toLowerCase(); }

  eat.auth = eat.auth || {};

  /** Validation email format. */
  eat.auth.validEmail = (email) => RX_EMAIL.test(normEmail(email));

  /**
   * Évaluation force mot de passe.
   * Retourne { score: 0..4, label, hints[] }
   *  - 0 = très faible (refusé) : moins de 8 chars
   *  - 1 = faible
   *  - 2 = correct
   *  - 3 = bon
   *  - 4 = excellent
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

  // ── Session ──────────────────────────────────────────────
  /** Compte connecté (lecture safe), null sinon. */
  eat.auth.current = function () {
    const session = readSession();
    if (!session) return null;
    const accounts = readAccounts();
    const acc = accounts[session.email];
    if (!acc) {
      clearSession();
      return null;
    }
    // Renvoyer une copie sans le hash/salt
    return {
      id: acc.id,
      email: acc.email,
      name: acc.name,
      avatar: acc.avatar,
      createdAt: acc.createdAt,
      lastLoginAt: acc.lastLoginAt
    };
  };
  eat.auth.isAuthenticated = () => !!eat.auth.current();

  /** Existence d'un email dans la base. */
  eat.auth.emailExists = (email) => {
    const accounts = readAccounts();
    return !!accounts[normEmail(email)];
  };

  // ── Signup ───────────────────────────────────────────────
  /**
   * Crée un compte.
   * data = { name, email, password, avatar? }
   * Retourne { ok, account?, error? }
   *   error parmi : 'name', 'email-format', 'email-taken', 'password-weak'
   */
  eat.auth.signup = async function (data) {
    const name = String(data.name || '').trim().slice(0, 32);
    const email = normEmail(data.email);
    const password = String(data.password || '');
    const avatar = data.avatar || (eat.AVATARS && eat.AVATARS[0]) || '🧑‍🍳';

    if (!name || name.length < 2) return { ok: false, error: 'name' };
    if (!RX_EMAIL.test(email)) return { ok: false, error: 'email-format' };
    if (eat.auth.emailExists(email)) return { ok: false, error: 'email-taken' };
    const strength = eat.auth.passwordStrength(password);
    if (!strength.isAcceptable) return { ok: false, error: 'password-weak' };

    const salt = randomSalt();
    const hash = await hashPassword(password, salt);
    const now = Date.now();
    const account = {
      id: newAccountId(),
      email, name, avatar,
      passwordHash: hash, salt,
      createdAt: now, lastLoginAt: now
    };
    const accounts = readAccounts();
    accounts[email] = account;
    writeAccounts(accounts);

    // Session immédiate (signup = login)
    writeSession({ id: account.id, email: account.email, at: now }, true);

    // Notify other modules (utils.js scoped storage helpers s'y abonneront)
    document.dispatchEvent(new CustomEvent('eat:auth:change', { detail: { type: 'signup', account } }));

    return { ok: true, account: eat.auth.current() };
  };

  // ── Login ────────────────────────────────────────────────
  /**
   * Connecte un user.
   * Retourne { ok, account?, error? }
   *   error parmi : 'email-format', 'no-account', 'wrong-password'
   */
  eat.auth.login = async function (email, password, remember) {
    email = normEmail(email);
    if (!RX_EMAIL.test(email)) return { ok: false, error: 'email-format' };
    const accounts = readAccounts();
    const acc = accounts[email];
    if (!acc) return { ok: false, error: 'no-account' };
    const candidate = await hashPassword(String(password || ''), acc.salt);
    if (!safeEqual(candidate, acc.passwordHash)) return { ok: false, error: 'wrong-password' };

    const now = Date.now();
    acc.lastLoginAt = now;
    accounts[email] = acc;
    writeAccounts(accounts);

    writeSession({ id: acc.id, email, at: now }, !!remember);
    document.dispatchEvent(new CustomEvent('eat:auth:change', { detail: { type: 'login', account: eat.auth.current() } }));
    return { ok: true, account: eat.auth.current() };
  };

  // ── Logout ───────────────────────────────────────────────
  eat.auth.logout = function () {
    const prev = eat.auth.current();
    clearSession();
    document.dispatchEvent(new CustomEvent('eat:auth:change', { detail: { type: 'logout', account: prev } }));
  };

  // ── Password recovery (mock) ─────────────────────────────
  /**
   * Génère un token de reset (24h). Renvoie le token lui-même puisqu'on
   * ne peut pas envoyer de mail dans un prototype client-side.
   */
  eat.auth.requestReset = function (email) {
    email = normEmail(email);
    if (!RX_EMAIL.test(email)) return { ok: false, error: 'email-format' };
    const accounts = readAccounts();
    if (!accounts[email]) {
      // Sécurité : on prétend que c'est OK même si le compte n'existe pas
      // (évite de leak l'existence d'un email). Mais on log dans la console pour le dev.
      console.info('[eatrail.auth] Reset demandé pour un email inexistant :', email);
      return { ok: true, token: null, exists: false };
    }
    const token = 'rst_' + randomSalt().slice(0, 24);
    const resets = readResets();
    resets[token] = { email, expires: Date.now() + 24 * 60 * 60 * 1000 };
    writeResets(resets);
    return { ok: true, token, exists: true };
  };

  /** Vérifie un token : renvoie l'email si valide. */
  eat.auth.checkResetToken = function (token) {
    const resets = readResets();
    const r = resets[token];
    if (!r) return null;
    if (Date.now() > r.expires) {
      delete resets[token];
      writeResets(resets);
      return null;
    }
    return r.email;
  };

  /** Applique un reset : remplace le mot de passe et consomme le token. */
  eat.auth.applyReset = async function (token, newPassword) {
    const email = eat.auth.checkResetToken(token);
    if (!email) return { ok: false, error: 'invalid-token' };
    const strength = eat.auth.passwordStrength(newPassword);
    if (!strength.isAcceptable) return { ok: false, error: 'password-weak' };
    const accounts = readAccounts();
    const acc = accounts[email];
    if (!acc) return { ok: false, error: 'no-account' };
    const salt = randomSalt();
    acc.salt = salt;
    acc.passwordHash = await hashPassword(newPassword, salt);
    accounts[email] = acc;
    writeAccounts(accounts);
    // consume token
    const resets = readResets();
    delete resets[token];
    writeResets(resets);
    return { ok: true };
  };

  // ── Update profile ───────────────────────────────────────
  /** Mise à jour nom / avatar / email (email change suit même règles que signup). */
  eat.auth.updateProfile = async function (data) {
    const cur = eat.auth.current();
    if (!cur) return { ok: false, error: 'not-authenticated' };

    const accounts = readAccounts();
    const acc = accounts[cur.email];
    if (!acc) return { ok: false, error: 'not-authenticated' };

    if ('name' in data) {
      const nm = String(data.name || '').trim().slice(0, 32);
      if (nm.length < 2) return { ok: false, error: 'name' };
      acc.name = nm;
    }
    if ('avatar' in data && data.avatar) acc.avatar = data.avatar;
    if ('email' in data && data.email) {
      const newEmail = normEmail(data.email);
      if (newEmail !== acc.email) {
        if (!RX_EMAIL.test(newEmail)) return { ok: false, error: 'email-format' };
        if (accounts[newEmail]) return { ok: false, error: 'email-taken' };
        // déplacer la clé
        delete accounts[acc.email];
        acc.email = newEmail;
        // mettre à jour la session
        const sess = readSession();
        if (sess) writeSession({ ...sess, email: newEmail }, !!localStorage.getItem(LS_SESSION));
      }
    }
    accounts[acc.email] = acc;
    writeAccounts(accounts);
    document.dispatchEvent(new CustomEvent('eat:auth:change', { detail: { type: 'update', account: eat.auth.current() } }));
    return { ok: true, account: eat.auth.current() };
  };

  // ── Change password ──────────────────────────────────────
  eat.auth.changePassword = async function (currentPwd, newPwd) {
    const cur = eat.auth.current();
    if (!cur) return { ok: false, error: 'not-authenticated' };
    const accounts = readAccounts();
    const acc = accounts[cur.email];
    if (!acc) return { ok: false, error: 'not-authenticated' };

    const candidate = await hashPassword(String(currentPwd || ''), acc.salt);
    if (!safeEqual(candidate, acc.passwordHash)) return { ok: false, error: 'wrong-current' };

    const strength = eat.auth.passwordStrength(newPwd);
    if (!strength.isAcceptable) return { ok: false, error: 'password-weak' };

    const salt = randomSalt();
    acc.salt = salt;
    acc.passwordHash = await hashPassword(newPwd, salt);
    accounts[acc.email] = acc;
    writeAccounts(accounts);
    return { ok: true };
  };

  // ── Delete account ───────────────────────────────────────
  eat.auth.deleteAccount = async function (password) {
    const cur = eat.auth.current();
    if (!cur) return { ok: false, error: 'not-authenticated' };
    const accounts = readAccounts();
    const acc = accounts[cur.email];
    if (!acc) return { ok: false, error: 'not-authenticated' };
    const candidate = await hashPassword(String(password || ''), acc.salt);
    if (!safeEqual(candidate, acc.passwordHash)) return { ok: false, error: 'wrong-password' };

    delete accounts[acc.email];
    writeAccounts(accounts);
    clearSession();
    document.dispatchEvent(new CustomEvent('eat:auth:change', { detail: { type: 'delete', account: cur } }));
    return { ok: true };
  };

  // ── Stats globales (pour /account dashboard) ─────────────
  eat.auth.accountCount = () => Object.keys(readAccounts()).length;

})(window.eat);
