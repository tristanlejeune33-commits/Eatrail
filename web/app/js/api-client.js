/* eatrail · api-client
 * Thin fetch wrapper for the eatrail backend API.
 * All endpoints return promises. Auth is via httpOnly cookie (credentials: 'include').
 *
 * Usage examples:
 *   await eat.api.auth.signup('a@b.com', 'pass1234', 'Léa');
 *   await eat.api.auth.login('a@b.com', 'pass1234');
 *   const { user } = await eat.api.auth.me();
 *   const { items } = await eat.api.recipes.list({ country: 'Italie', perPage: 20 });
 *   const { saved } = await eat.api.favorites.toggle('carbonara');
 *
 * Migration from localStorage to DB happens automatically on first
 * successful login via eat.api.migrateFromLocalStorage().
 */
(function () {
  const CONFIG = window.EATRAIL_CONFIG || { apiUrl: 'http://localhost:3001' };
  const API = CONFIG.apiUrl.replace(/\/$/, '');

  // ─── Low-level fetch wrapper ─────────────────────────────
  async function call(method, path, body) {
    if (CONFIG.forceOffline) {
      throw new ApiError('offline_mode', 'API disabled in config');
    }
    const opts = {
      method,
      credentials: 'include',
      headers: { 'Accept': 'application/json' },
    };
    if (body !== undefined) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }

    let res;
    try {
      res = await fetch(API + path, opts);
    } catch (e) {
      throw new ApiError('network', e.message || 'Network error');
    }

    const ct = res.headers.get('content-type') || '';
    const data = ct.includes('application/json') ? await res.json().catch(() => null) : await res.text();

    if (!res.ok) {
      const code = (data && data.error) || `http_${res.status}`;
      const msg = (data && data.message) || (typeof data === 'string' ? data : `HTTP ${res.status}`);
      const err = new ApiError(code, msg);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  function ApiError(code, message) {
    this.name = 'ApiError';
    this.code = code;
    this.message = message;
  }
  ApiError.prototype = Object.create(Error.prototype);

  function qs(obj) {
    if (!obj) return '';
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(obj)) {
      if (v !== undefined && v !== null && v !== '') sp.set(k, String(v));
    }
    const s = sp.toString();
    return s ? '?' + s : '';
  }

  // ─── API namespace ───────────────────────────────────────
  const eat = (window.eat = window.eat || {});
  // `ready` resolves when init() has finished (success OR confirmed-offline),
  // so callers can `await eat.api.ready` before deciding API vs localStorage.
  let _readyResolve;
  const api = (eat.api = {
    url: API,
    isOnline: false,
    currentUser: null,
    ApiError,
    ready: new Promise((r) => { _readyResolve = r; }),

    // Health check (used to decide between online/offline mode)
    async ping() {
      try {
        const r = await fetch(API + '/health', { credentials: 'omit' });
        return r.ok;
      } catch { return false; }
    },

    // Initialize: call /auth/me to detect logged-in state + server availability.
    // - 200 OK with user        → isOnline=true, currentUser=user
    // - 200 OK with user=null   → isOnline=true, currentUser=null  (server reachable, just not logged-in)
    // - any non-network error   → isOnline=true (server IS responding, just rejected us)
    // - network error           → isOnline=false  (browser can't reach the server at all)
    async init() {
      try {
        const data = await call('GET', '/api/auth/me');
        api.isOnline = true;
        api.currentUser = data && data.user ? data.user : null;
        console.log('[eatrail] API online — user:', api.currentUser ? api.currentUser.email : '(none)');
        return api.currentUser;
      } catch (e) {
        if (e.code === 'network') {
          api.isOnline = false;
          console.warn('[eatrail] API unreachable — falling back to localStorage mode.');
        } else {
          // Server responded with an error (4xx/5xx). The server IS reachable,
          // we're just not logged-in / hit some other condition. Stay online.
          api.isOnline = true;
          api.currentUser = null;
          console.log('[eatrail] API online but /me returned', e.code);
        }
        return null;
      } finally {
        _readyResolve();
      }
    },

    // ─── AUTH ────────────────────────────────────────────────
    auth: {
      signup: (email, password, name, avatarColor) => call('POST', '/api/auth/signup', { email, password, name, avatarColor }),
      login: (email, password) => call('POST', '/api/auth/login', { email, password }),
      logout: () => call('POST', '/api/auth/logout'),
      me: () => call('GET', '/api/auth/me'),
      revokeAll: () => call('POST', '/api/auth/sessions/revoke-all'),
      changePassword: (currentPassword, newPassword) =>
        call('POST', '/api/auth/me/password', { currentPassword, newPassword }),
    },

    // ─── RECIPES (public) ───────────────────────────────────
    recipes: {
      list: (params) => call('GET', '/api/recipes' + qs(params)),
      get: (id) => call('GET', '/api/recipes/' + encodeURIComponent(id)),
    },

    // ─── SHOPS (public) ─────────────────────────────────────
    shops: {
      list: (params) => call('GET', '/api/shops' + qs(params)),
      get: (id) => call('GET', '/api/shops/' + encodeURIComponent(id)),
    },

    // ─── FAVORITES (auth) ───────────────────────────────────
    favorites: {
      list: () => call('GET', '/api/favorites'),
      toggle: (recipeId) => call('POST', '/api/favorites/' + encodeURIComponent(recipeId)),
      import: (recipeIds) => call('POST', '/api/favorites/import', { recipeIds }),
    },

    // ─── CART (auth) ────────────────────────────────────────
    cart: {
      list: () => call('GET', '/api/cart'),
      add: (item) => call('POST', '/api/cart', item),
      toggleChecked: (id, checked) => call('PATCH', '/api/cart/' + id, { checked }),
      remove: (id) => call('DELETE', '/api/cart/' + id),
      clear: () => call('DELETE', '/api/cart'),
      import: (items) => call('POST', '/api/cart/import', { items }),
    },

    // ─── PANTRY (auth) ──────────────────────────────────────
    pantry: {
      list: () => call('GET', '/api/pantry'),
      add: (name, source = 'manual') => call('POST', '/api/pantry', { name, source }),
      removeByName: (name) => call('DELETE', '/api/pantry/by-name', { name }),  // body via fetch
      clear: () => call('DELETE', '/api/pantry'),
      import: (names) => call('POST', '/api/pantry/import', { names }),

      // Multipart photo upload to OpenAI Vision proxy
      async scan(file) {
        const fd = new FormData();
        fd.append('photo', file);
        const res = await fetch(API + '/api/pantry/scan', {
          method: 'POST',
          credentials: 'include',
          body: fd,
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new ApiError(data.error || 'scan_failed', data.message || `HTTP ${res.status}`);
        }
        return res.json();
      },
    },

    // ─── REVIEWS ────────────────────────────────────────────
    reviews: {
      list: (recipeId) => call('GET', '/api/reviews/recipe/' + encodeURIComponent(recipeId)),
      upsert: (recipeId, rating, comment) => call('POST', '/api/reviews/recipe/' + encodeURIComponent(recipeId), { rating, comment }),
      remove: (recipeId) => call('DELETE', '/api/reviews/recipe/' + encodeURIComponent(recipeId)),
    },

    // ─── PREFERENCES (auth) ─────────────────────────────────
    prefs: {
      get: () => call('GET', '/api/prefs'),
      put: (prefs) => call('PUT', '/api/prefs', prefs),
    },

    // ─── FLAVOR DNA (carte d'identité culinaire) ────────────
    flavorDna: {
      me: () => call('GET', '/api/flavor-dna/me'),
    },

    // ─── NUTRITION (USDA-backed) ────────────────────────────
    nutrition: {
      status: () => call('GET', '/api/nutrition/status'),
      recipe: (recipeId) => call('GET', '/api/nutrition/recipe/' + encodeURIComponent(recipeId)),
    },

    // ─── WEB PUSH (notifications) ───────────────────────────
    push: {
      publicKey: () => call('GET', '/api/push/public-key'),
      subscribe: (subscription) => call('POST', '/api/push/subscribe', subscription),
      unsubscribe: (endpoint) => call('POST', '/api/push/unsubscribe', { endpoint }),
      test: () => call('POST', '/api/push/test'),
    },

    // ─── UGC RECIPE SUBMISSIONS ─────────────────────────────
    submissions: {
      create: (recipe) => call('POST', '/api/submissions', recipe),
      mine: () => call('GET', '/api/submissions/mine'),
      get: (id) => call('GET', '/api/submissions/' + id),
      update: (id, patch) => call('PATCH', '/api/submissions/' + id, patch),
      remove: (id) => call('DELETE', '/api/submissions/' + id),
    },

    // ─── MEAL PLAN (calendrier de recettes) ─────────────────
    mealPlan: {
      list: (from, to, status) => call('GET', '/api/meal-plan' + qs({ from, to, status })),
      create: (recipeId, date, slot, servings, notes) => call('POST', '/api/meal-plan', { recipeId, date, slot, servings, notes }),
      update: (id, patch) => call('PATCH', '/api/meal-plan/' + id, patch),
      remove: (id) => call('DELETE', '/api/meal-plan/' + id),
      shoppingList: (from, to) => call('GET', '/api/meal-plan/shopping-list' + qs({ from, to })),
      toCart: (id) => call('POST', '/api/meal-plan/' + id + '/to-cart'),
      // AI: pick 7 dinners for the week starting at `startDate` (YYYY-MM-DD).
      // replaceExisting=true wipes existing PLANNED dinners in the window first.
      generate: (startDate, servings, replaceExisting) =>
        call('POST', '/api/meal-plan/generate', { startDate, servings, replaceExisting }),
    },

    // ─── GEO / SHOP DISCOVERY ───────────────────────────────
    geo: {
      // Server feature flags (Google Places + AI inference availability)
      status: () => call('GET', '/api/geo/status'),

      /**
       * Find shops near a position.
       * @param {object} params { lat, lng, radius?, limit?, recipeId?, ingredients?, useAi? }
       *   - ingredients: comma-separated string OR array of strings
       *   - recipeId: alternative to ingredients (server fetches recipe)
       */
      shopsNearby(params) {
        const p = { ...params };
        if (Array.isArray(p.ingredients)) p.ingredients = p.ingredients.join(',');
        return call('GET', '/api/geo/shops/nearby' + qs(p));
      },

      /** Crowdsource: report ingredient found/not found at a shop */
      check: (shopId, ingredientKey, found, note) =>
        call('POST', `/api/geo/shops/${encodeURIComponent(shopId)}/check`, { ingredientKey, found, note }),

      /** List recent crowdsourced checks for a shop (public) */
      checks: (shopId) => call('GET', `/api/geo/shops/${encodeURIComponent(shopId)}/checks`),
    },

    // ─── MIGRATION HELPER ───────────────────────────────────
    /**
     * After a successful login, push localStorage data (favorites, cart,
     * pantry) to the user's account on the server. Idempotent (server
     * uses skipDuplicates).
     *
     * @param {string} accountId — internal localStorage account ID
     *        (whatever was used as suffix, e.g. eatrail.v1.cart.<accountId>)
     */
    async migrateFromLocalStorage(accountId) {
      const result = { favorites: 0, cart: 0, pantry: 0, errors: [] };
      const safeJson = (key, fallback) => {
        try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
        catch { return fallback; }
      };

      // Favorites
      try {
        const saved = safeJson(`eatrail.v1.saved.${accountId}`, []);
        if (Array.isArray(saved) && saved.length > 0) {
          const r = await api.favorites.import(saved);
          result.favorites = r.added || 0;
        }
      } catch (e) { result.errors.push('favorites: ' + e.message); }

      // Cart
      try {
        const cart = safeJson(`eatrail.v1.cart.${accountId}`, []);
        if (Array.isArray(cart) && cart.length > 0) {
          const items = cart.map(c => ({
            ingredientName: c.name || c.ingredientName || c.label || 'item',
            qty: typeof c.qty === 'number' ? c.qty : null,
            unit: c.unit || null,
            recipeId: c.recipeId || c.recipe || null,
            shopId: c.shopId || c.shop || null,
            checked: !!c.checked,
          }));
          const r = await api.cart.import(items);
          result.cart = r.added || 0;
        }
      } catch (e) { result.errors.push('cart: ' + e.message); }

      // Pantry (global, not per-account in current SPA)
      try {
        const pantry = safeJson('eatrail.v1.pantry', []);
        if (Array.isArray(pantry) && pantry.length > 0) {
          const r = await api.pantry.import(pantry);
          result.pantry = r.added || 0;
        }
      } catch (e) { result.errors.push('pantry: ' + e.message); }

      return result;
    },
  });

  // Auto-init on load (background, non-blocking)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => api.init());
  } else {
    api.init();
  }
})();
