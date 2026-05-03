/* eatrail · Mapbox map module
 * Lazy-loaded interactive map for shops + trail visualization.
 *
 * Setup: requires window.EATRAIL_CONFIG.mapboxToken (from /api/geo/status or hardcoded).
 * Free tier: 50K map loads/month.
 *
 * Usage:
 *   eat.map.init('map-container', { center: [lng, lat], zoom: 13 });
 *   eat.map.addShops([{ id, name, lat, lng, authScore, ... }]);
 *   eat.map.drawTrail([shop1, shop2, shop3]);  // line connecting stops
 *   eat.map.destroy();
 */
(function () {
  const eat = (window.eat = window.eat || {});
  let mapInstance = null;
  let mapboxLoaded = false;
  let loadPromise = null;

  // Lazy-load Mapbox GL JS from CDN (only when first map is requested)
  function loadMapbox() {
    if (mapboxLoaded) return Promise.resolve();
    if (loadPromise) return loadPromise;
    loadPromise = new Promise((resolve, reject) => {
      // CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.6.0/mapbox-gl.css';
      document.head.appendChild(link);
      // JS
      const script = document.createElement('script');
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.6.0/mapbox-gl.js';
      script.onload = () => { mapboxLoaded = true; resolve(); };
      script.onerror = () => reject(new Error('Failed to load Mapbox GL JS'));
      document.head.appendChild(script);
    });
    return loadPromise;
  }

  async function getToken() {
    if (eat.api?.geo?.status) {
      try {
        const r = await eat.api.geo.status();
        if (r.mapboxToken) return r.mapboxToken;
      } catch {}
    }
    return window.EATRAIL_CONFIG?.mapboxToken || null;
  }

  eat.map = {
    isAvailable: async () => !!(await getToken()),

    async init(containerId, { center = [-73.9874, 40.7479], zoom = 13 } = {}) {
      const container = document.getElementById(containerId);
      if (!container) throw new Error('container not found: ' + containerId);

      const token = await getToken();
      if (!token) {
        container.innerHTML = `
          <div style="background:var(--cream-deep);border-radius:14px;padding:40px 20px;text-align:center;">
            <div style="font-size:32px;margin-bottom:10px;">🗺️</div>
            <p style="color:var(--muted);font-size:13px;">Carte interactive non disponible.<br/>Définis <code>MAPBOX_TOKEN</code> côté serveur pour activer.</p>
          </div>`;
        return null;
      }

      await loadMapbox();
      window.mapboxgl.accessToken = token;

      mapInstance = new window.mapboxgl.Map({
        container: containerId,
        style: 'mapbox://styles/mapbox/light-v11',
        center,
        zoom,
        attributionControl: false,
      });

      mapInstance.addControl(new window.mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
      mapInstance.addControl(new window.mapboxgl.AttributionControl({ compact: true }), 'bottom-right');

      return mapInstance;
    },

    addShops(shops) {
      if (!mapInstance) return;
      shops.forEach(s => {
        if (!s.lat || !s.lng) return;
        const tier = s.authScore >= 90 ? 'a' : s.authScore >= 75 ? 'b' : 'c';
        const color = tier === 'a' ? '#3F8B54' : tier === 'b' ? '#D9A441' : '#5F6E62';
        const size = tier === 'a' ? 24 : tier === 'b' ? 20 : 16;

        const el = document.createElement('div');
        el.className = 'map-pin';
        el.style.cssText = `width:${size}px;height:${size}px;background:${color};border:2px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.3);cursor:pointer;`;
        el.title = s.name;

        new window.mapboxgl.Marker(el)
          .setLngLat([s.lng, s.lat])
          .setPopup(new window.mapboxgl.Popup({ offset: 14, className: 'map-popup' }).setHTML(`
            <div style="font-family:'Inter',sans-serif;padding:6px;">
              <div style="font-family:'Fraunces',serif;font-weight:700;font-size:14px;color:#15211A;">${escapeHtml(s.name)}</div>
              <div style="font-size:11px;color:#5F6E62;margin-top:2px;">${escapeHtml(s.neighborhood || '')}</div>
              <div style="font-size:11px;color:#3F8B54;margin-top:6px;">★ ${s.authScore} · ${escapeHtml(s.priceLevel || '$$')}</div>
              ${s.id ? `<a href="#/shop/${encodeURIComponent(s.id)}" style="display:inline-block;margin-top:8px;font-size:11px;color:#3F8B54;font-weight:600;">Voir →</a>` : ''}
            </div>
          `))
          .addTo(mapInstance);
      });
    },

    drawTrail(stops) {
      if (!mapInstance || stops.length < 2) return;
      const coordinates = stops.filter(s => s.lat && s.lng).map(s => [s.lng, s.lat]);
      if (coordinates.length < 2) return;

      mapInstance.on('load', () => {
        if (mapInstance.getSource('trail-line')) {
          mapInstance.removeLayer('trail-line');
          mapInstance.removeSource('trail-line');
        }
        mapInstance.addSource('trail-line', {
          type: 'geojson',
          data: { type: 'Feature', geometry: { type: 'LineString', coordinates } },
        });
        mapInstance.addLayer({
          id: 'trail-line',
          type: 'line',
          source: 'trail-line',
          paint: {
            'line-color': '#3F8B54',
            'line-width': 4,
            'line-dasharray': [2, 2],
          },
        });
      });

      // Fit bounds to show all stops
      const bounds = coordinates.reduce(
        (b, c) => b.extend(c),
        new window.mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
      );
      mapInstance.fitBounds(bounds, { padding: 60, maxZoom: 15 });
    },

    destroy() {
      if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
      }
    },
  };

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }
})();
