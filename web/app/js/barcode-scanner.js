/* eatrail · barcode scanner
 *
 * Real (not-mock) barcode scanning for the cart page.
 *   1. Try the native `BarcodeDetector` API first (Chrome Android, Safari iOS 16.4+,
 *      Edge). Zero JS to download — just spins up getUserMedia + a detect() loop.
 *   2. Fall back to html5-qrcode loaded from jsdelivr CDN if the native API is
 *      unavailable (older Safari, Chrome desktop without the flag).
 *
 * Once a barcode is decoded, we look it up against Open Food Facts (free, public,
 * 3M+ products): https://world.openfoodfacts.org/api/v2/product/<barcode>.json
 *
 * Public surface: window.eat.barcode = { open(opts) }
 *   opts.onProduct({ barcode, name, brand, ingredients }) — called on each scan
 *   opts.onClose()                                        — called when modal closes
 *
 * Note: requires HTTPS (camera access). Already true on Railway.
 */
(function () {
  const eat = (window.eat = window.eat || {});
  if (eat.barcode) return; // already loaded

  const HTML5_QR_CDN = 'https://cdn.jsdelivr.net/npm/html5-qrcode@2.3.8/html5-qrcode.min.js';

  // ── Native BarcodeDetector path ──────────────────────────
  function nativeAvailable() {
    return typeof window.BarcodeDetector === 'function';
  }

  async function startNative({ videoEl, onDetect, onError }) {
    let stream = null;
    let detector = null;
    let stopped = false;

    try {
      detector = new window.BarcodeDetector({
        formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'qr_code'],
      });
    } catch (e) {
      onError && onError(new Error('barcode_detector_unsupported'));
      return () => {};
    }

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
    } catch (e) {
      onError && onError(new Error('camera_denied'));
      return () => {};
    }

    videoEl.srcObject = stream;
    await videoEl.play().catch(() => {});

    let lastSeen = '';
    let lastSeenAt = 0;
    const tick = async () => {
      if (stopped) return;
      try {
        const codes = await detector.detect(videoEl);
        if (codes && codes[0]) {
          const value = String(codes[0].rawValue || '').trim();
          const now = Date.now();
          // Debounce same-code reads (BarcodeDetector fires rapidly when locked on)
          if (value && (value !== lastSeen || now - lastSeenAt > 2000)) {
            lastSeen = value;
            lastSeenAt = now;
            onDetect(value);
          }
        }
      } catch { /* keep going */ }
      if (!stopped) requestAnimationFrame(tick);
    };
    tick();

    return () => {
      stopped = true;
      try { stream.getTracks().forEach(t => t.stop()); } catch {}
      videoEl.srcObject = null;
    };
  }

  // ── html5-qrcode fallback ────────────────────────────────
  let _html5qrLoadPromise = null;
  function loadHtml5Qrcode() {
    if (window.Html5Qrcode) return Promise.resolve();
    if (_html5qrLoadPromise) return _html5qrLoadPromise;
    _html5qrLoadPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = HTML5_QR_CDN;
      s.async = true;
      s.onload = resolve;
      s.onerror = () => reject(new Error('html5_qrcode_load_failed'));
      document.head.appendChild(s);
    });
    return _html5qrLoadPromise;
  }

  async function startFallback({ containerId, onDetect, onError }) {
    try {
      await loadHtml5Qrcode();
    } catch (e) { onError && onError(e); return () => {}; }
    const Html5Qrcode = window.Html5Qrcode;
    const reader = new Html5Qrcode(containerId);
    let stopped = false;
    try {
      await reader.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 280, height: 180 } },
        (decoded) => { if (!stopped) onDetect(decoded); },
        () => { /* per-frame failures: ignore */ },
      );
    } catch (e) {
      onError && onError(new Error('camera_denied'));
      return () => {};
    }
    return async () => {
      stopped = true;
      try { await reader.stop(); } catch {}
      try { await reader.clear(); } catch {}
    };
  }

  // ── Open Food Facts lookup ───────────────────────────────
  async function lookupBarcode(barcode) {
    const url = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json?fields=product_name,product_name_fr,brands,ingredients_text,ingredients_text_fr,categories_tags`;
    const res = await fetch(url, { credentials: 'omit' });
    if (!res.ok) throw new Error('off_http_' + res.status);
    const data = await res.json();
    if (data.status === 0 || !data.product) {
      return { barcode, found: false };
    }
    const p = data.product;
    const name = p.product_name_fr || p.product_name || '';
    const brand = (p.brands || '').split(',')[0].trim();
    return {
      barcode,
      found: true,
      name,
      brand,
      ingredients: p.ingredients_text_fr || p.ingredients_text || '',
      categories: p.categories_tags || [],
    };
  }
  eat.barcodeLookup = lookupBarcode;

  // ── Modal UI ─────────────────────────────────────────────
  function buildModalHtml() {
    return `
      <div class="bc-modal-backdrop" id="bc-modal-backdrop">
        <div class="bc-modal" role="dialog" aria-label="Scanner code-barres">
          <div class="bc-modal-head">
            <strong>📡 Scan code-barres</strong>
            <button type="button" class="bc-modal-close" id="bc-modal-close" aria-label="Fermer">×</button>
          </div>
          <div class="bc-modal-body">
            <video id="bc-video" playsinline muted style="width:100%;border-radius:8px;background:#000;"></video>
            <div id="bc-fallback" style="width:100%;min-height:240px;display:none;"></div>
            <div class="bc-status" id="bc-status">Démarrage de la caméra…</div>
            <div class="bc-result" id="bc-result"></div>
          </div>
          <div class="bc-modal-foot">
            <span class="bc-engine" id="bc-engine"></span>
            <button type="button" class="btn btn-ghost btn-sm" id="bc-modal-done">Terminer</button>
          </div>
        </div>
      </div>
    `;
  }

  function setStatus(msg, isError) {
    const el = document.getElementById('bc-status');
    if (!el) return;
    el.textContent = msg;
    el.style.color = isError ? '#A33B3B' : 'var(--muted)';
  }

  function appendResult(text, ok) {
    const el = document.getElementById('bc-result');
    if (!el) return;
    const line = document.createElement('div');
    line.style.cssText = `padding:6px 10px;margin-top:6px;border-radius:6px;font-size:13px;background:${ok ? 'rgba(63,139,84,.12)' : 'rgba(200,90,58,.12)'};color:${ok ? 'var(--primary)' : 'var(--accent)'};`;
    line.textContent = text;
    el.appendChild(line);
    el.scrollTop = el.scrollHeight;
  }

  /**
   * Open the barcode scanner modal.
   * @param {object} opts
   * @param {(product) => void} [opts.onProduct]  called for each successful lookup
   * @param {() => void}        [opts.onClose]    called once when the modal closes
   */
  eat.barcode = {
    /** Quick capability check for UI gating. */
    isAvailable() {
      return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    },

    async open(opts = {}) {
      if (!this.isAvailable()) {
        alert('Ton navigateur ne permet pas l\'accès caméra (HTTPS + permission requis).');
        return;
      }

      // Inject modal
      const wrap = document.createElement('div');
      wrap.innerHTML = buildModalHtml();
      document.body.appendChild(wrap.firstElementChild);
      document.body.style.overflow = 'hidden';

      const video = document.getElementById('bc-video');
      const engineLbl = document.getElementById('bc-engine');
      let stop = () => {};
      const seen = new Set(); // dedupe successive same-code reads
      let inFlight = 0;

      const handleDecoded = async (raw) => {
        const code = String(raw).trim();
        if (!code || seen.has(code)) return;
        seen.add(code);
        inFlight++;
        setStatus(`Recherche ${code}…`);
        try {
          const product = await lookupBarcode(code);
          if (!product.found) {
            appendResult(`✗ ${code} — produit inconnu (Open Food Facts)`, false);
          } else {
            const label = product.brand ? `${product.brand} — ${product.name}` : (product.name || code);
            appendResult(`✓ ${label}`, true);
            try { opts.onProduct && opts.onProduct(product); } catch (e) { console.warn('[bc] onProduct:', e); }
          }
        } catch (e) {
          appendResult(`✗ ${code} — lookup échoué`, false);
        } finally {
          inFlight--;
          setStatus('Pointe un autre code-barres ou clique Terminer.');
        }
      };

      const close = async () => {
        try { await stop(); } catch {}
        const m = document.getElementById('bc-modal-backdrop');
        if (m) m.remove();
        document.body.style.overflow = '';
        try { opts.onClose && opts.onClose(); } catch (e) { console.warn('[bc] onClose:', e); }
      };

      document.getElementById('bc-modal-close').addEventListener('click', close);
      document.getElementById('bc-modal-done').addEventListener('click', close);
      document.getElementById('bc-modal-backdrop').addEventListener('click', (e) => {
        if (e.target.id === 'bc-modal-backdrop') close();
      });

      // Engine selection
      if (nativeAvailable()) {
        engineLbl.textContent = 'Moteur : natif';
        stop = await startNative({
          videoEl: video,
          onDetect: handleDecoded,
          onError: (err) => setStatus('Caméra refusée ou indisponible.', true),
        });
        setStatus('Pointe un code-barres dans le viseur.');
      } else {
        // html5-qrcode runs the camera itself in its container element.
        video.style.display = 'none';
        const fb = document.getElementById('bc-fallback');
        fb.style.display = 'block';
        fb.id = 'bc-html5qr';
        engineLbl.textContent = 'Moteur : html5-qrcode';
        setStatus('Chargement du décodeur…');
        stop = await startFallback({
          containerId: 'bc-html5qr',
          onDetect: handleDecoded,
          onError: (err) => setStatus('Caméra refusée ou décodeur indisponible.', true),
        });
        setStatus('Pointe un code-barres dans le viseur.');
      }
    },
  };
})();
