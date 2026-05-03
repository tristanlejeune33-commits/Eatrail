/* eatrail · runtime config
 * Where the API lives. Auto-detects 3 modes:
 *
 * - file:// (local file)        → http://localhost:3001 (dev API)
 * - localhost/127.0.0.1         → http://localhost:3001 (dev API)
 * - any deployed origin (Railway/Vercel) → SAME origin as the page
 *   (because the API serves the SPA from the same Express in production)
 *
 * Override via URL param: ?api=https://other-host
 */
(function () {
  const proto = window.location.protocol;
  const host = window.location.hostname;
  const isFile = proto === 'file:';
  const isLocal = isFile || host === 'localhost' || host === '127.0.0.1' || host === '' || host.startsWith('192.168.');

  const config = {
    // Same origin in production (single-service deploy on Railway)
    // → API at /api/*, SPA at /
    apiUrl: isLocal ? 'http://localhost:3001' : window.location.origin,

    forceOnline: false,
    forceOffline: false,
  };

  const urlOverride = new URLSearchParams(window.location.search).get('api');
  if (urlOverride) config.apiUrl = urlOverride;

  window.EATRAIL_CONFIG = config;
  console.log('[eatrail] API:', config.apiUrl, '(local:', isLocal, ')');
})();
