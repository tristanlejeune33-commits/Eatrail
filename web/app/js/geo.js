/* eatrail · geolocation helper
 * Wraps navigator.geolocation with caching + permission UX.
 *
 * Usage:
 *   const pos = await eat.geo.getPosition();    // { lat, lng, accuracy }
 *   const pos = eat.geo.getCached();            // null or last known
 *   eat.geo.setManual(40.7193, -73.9577);       // user typed an address (Williamsburg)
 *   eat.geo.clear();                            // forget cached position
 *
 * Permission UX:
 *   - We never auto-prompt. Always require an explicit user action (button click).
 *   - On denial, fall back to NYC default + offer manual override.
 */
(function () {
  const eat = (window.eat = window.eat || {});
  const STORAGE_KEY = 'eatrail.v1.geo';
  const NYC_DEFAULT = { lat: 40.7128, lng: -74.0060, label: 'NYC (default)' };

  function read() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); }
    catch { return null; }
  }
  function write(pos) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(pos)); }
    catch {}
  }

  const geo = (eat.geo = {
    NYC_DEFAULT,

    /** @returns {{lat:number, lng:number, source:string, savedAt:number}|null} */
    getCached() {
      const p = read();
      if (!p) return null;
      // Auto-expire after 7 days for browser-detected positions (people move).
      // Manual / fallback positions never expire.
      if (p.source === 'browser' && Date.now() - (p.savedAt || 0) > 7 * 24 * 3600 * 1000) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return p;
    },

    isAvailable() {
      return typeof navigator !== 'undefined' && 'geolocation' in navigator;
    },

    /** Ask the browser. Returns position or throws.
     * @param {object} opts {timeout, maximumAge, highAccuracy}
     * @returns {Promise<{lat:number,lng:number,accuracy:number,source:'browser',savedAt:number}>}
     */
    getPosition(opts = {}) {
      if (!geo.isAvailable()) {
        return Promise.reject(new Error('geolocation_unavailable'));
      }
      const options = {
        enableHighAccuracy: !!opts.highAccuracy,
        timeout: opts.timeout || 10000,
        maximumAge: opts.maximumAge || 60000,
      };
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const out = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
              source: 'browser',
              savedAt: Date.now(),
            };
            write(out);
            resolve(out);
          },
          (err) => {
            const code = err.code === 1 ? 'permission_denied' : err.code === 2 ? 'position_unavailable' : err.code === 3 ? 'timeout' : 'unknown';
            const e = new Error(code);
            e.original = err;
            reject(e);
          },
          options
        );
      });
    },

    /** User typed an address in a manual input — persist as override */
    setManual(lat, lng, label) {
      const out = { lat: Number(lat), lng: Number(lng), source: 'manual', label: label || null, savedAt: Date.now() };
      write(out);
      return out;
    },

    /** Use NYC default (no permission needed) */
    useDefault() {
      const out = { ...NYC_DEFAULT, source: 'default', savedAt: Date.now() };
      write(out);
      return out;
    },

    clear() {
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
    },

    /**
     * Get a position by ANY means: cached → ask browser → fallback default.
     * Quiet (no prompts) unless `interactive: true`.
     */
    async resolve({ interactive = false } = {}) {
      const cached = geo.getCached();
      if (cached) return cached;
      if (interactive) {
        try { return await geo.getPosition(); }
        catch (e) {
          console.warn('[geo] permission denied, falling back:', e.message);
          return geo.useDefault();
        }
      }
      return geo.useDefault();
    },

    /** Distance helper (Haversine, miles) */
    distMiles(lat1, lng1, lat2, lng2) {
      const R = 3958.8;
      const toRad = d => d * Math.PI / 180;
      const dLat = toRad(lat2 - lat1);
      const dLng = toRad(lng2 - lng1);
      const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
      return 2 * R * Math.asin(Math.sqrt(a));
    },
  });
})();
