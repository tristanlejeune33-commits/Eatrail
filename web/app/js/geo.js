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

    // ── Deep links to native Maps apps ─────────────────────
    /** True if we're on iOS/iPadOS (Plans is the native default app there). */
    isIos() {
      if (typeof navigator === 'undefined') return false;
      return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    },

    /**
     * Build a directions URL for one or more stops.
     *
     * Strategy:
     *   - On iOS, single destination → `maps://` (opens Apple Plans).
     *   - Otherwise (multi-stop, or non-iOS) → Google Maps universal URL,
     *     which opens the Google Maps app on iOS/Android and the web map on desktop.
     *     Multi-stop trails use `waypoints=` to chain stops.
     *
     * @param {Array} stops    [{coords:{lat,lng}, address?, name?}, ...] OR [{lat,lng}, ...]
     * @param {object} [opts]
     * @param {{lat,lng}} [opts.origin]   user's current position (else app picks it)
     * @param {string}  [opts.mode]       'walking' (default) | 'driving' | 'bicycling' | 'transit'
     * @returns {string|null}             URL or null if no usable coords
     */
    directionsUrl(stops, opts = {}) {
      const mode = opts.mode || 'walking';
      const origin = opts.origin && Number.isFinite(opts.origin.lat) ? opts.origin : null;

      const points = (stops || [])
        .map(s => {
          const c = s.coords || s;
          return { lat: Number(c.lat), lng: Number(c.lng) };
        })
        .filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng));
      if (points.length === 0) return null;

      const dest = points[points.length - 1];
      const isSingle = points.length === 1;

      // Apple Plans (iOS only, single dest) — `maps://` lets iOS open the native app.
      if (geo.isIos() && isSingle) {
        const p = new URLSearchParams();
        if (origin) p.set('saddr', `${origin.lat},${origin.lng}`);
        p.set('daddr', `${dest.lat},${dest.lng}`);
        const dirflg = mode === 'walking' ? 'w' : mode === 'driving' ? 'd' : mode === 'transit' ? 'r' : 'w';
        p.set('dirflg', dirflg);
        return `maps://?${p.toString()}`;
      }

      // Google Maps universal URL — works on desktop, iOS, Android. App-deep-links if installed.
      const p = new URLSearchParams();
      p.set('api', '1');
      if (origin) p.set('origin', `${origin.lat},${origin.lng}`);
      p.set('destination', `${dest.lat},${dest.lng}`);
      if (points.length > 1) {
        p.set('waypoints', points.slice(0, -1).map(x => `${x.lat},${x.lng}`).join('|'));
      }
      p.set('travelmode', mode);
      return `https://www.google.com/maps/dir/?${p.toString()}`;
    },

    /**
     * Open the user's native Maps app with directions to the given stops.
     * Uses location.assign so Safari iOS doesn't pop-up-block us.
     * Returns false if no usable coords were found.
     */
    async openDirections(stops, opts = {}) {
      // Auto-fill origin from cached/current position if not provided.
      if (!opts.origin) {
        const pos = geo.getCached();
        if (pos && Number.isFinite(pos.lat)) opts = { ...opts, origin: { lat: pos.lat, lng: pos.lng } };
      }
      const url = geo.directionsUrl(stops, opts);
      if (!url) return false;
      window.location.href = url;
      return true;
    },
  });
})();
