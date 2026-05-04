/* eatrail · flag emoji renderer
 *
 * Windows + many Chrome/Firefox builds don't ship a color emoji font that
 * renders the regional-indicator-letter pairs (🇫🇷, 🇮🇹, 🇯🇵, …) as actual
 * country flags — they fall back to the bare two-letter codes ("FR", "IT").
 * macOS, iOS, Android and Linux distros with Noto Color Emoji are fine.
 *
 * Rather than ship 25+ SVGs ourselves or pull in the full ~100 KB Twemoji
 * library, we surgically convert ONLY the flag emojis we actually use into
 * `<img>` tags pointing at the small SVG file in the Twemoji CDN. Total
 * payload per flag is ~1-2 KB and they cache aggressively.
 *
 * Strategy:
 *   1. Walk the DOM (after each render) for text nodes that contain a flag
 *      emoji (regional indicator pair).
 *   2. Replace each occurrence with `<img class="flag-emoji" src="…" />`.
 *   3. Done. Static images render the same on every OS.
 *
 * Uses the Twemoji CDN on jsdelivr — already whitelisted in our CSP for
 * scripts; img-src is updated alongside this module.
 *
 * Public surface: window.eat.flagEmoji.parse(rootEl)
 */
(function () {
  const eat = (window.eat = window.eat || {});

  // Regional Indicator Symbol Letter range: U+1F1E6..U+1F1FF
  const RIS_PAIR = /[\u{1F1E6}-\u{1F1FF}]{2}/gu;

  // jsdelivr-hosted Twemoji SVG (color flags). 14.0.2 is the latest stable
  // tag; pinning avoids surprise breakage if the CDN refreshes.
  const TWEMOJI_BASE = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/';

  function flagToCodepoints(flag) {
    return [...flag].map(c => c.codePointAt(0).toString(16)).join('-');
  }

  function flagToImgHtml(flag) {
    const cp = flagToCodepoints(flag);
    return `<img class="flag-emoji" src="${TWEMOJI_BASE}${cp}.svg" alt="${flag}" draggable="false" />`;
  }

  // Walk text nodes only — never touches existing markup, attributes, or
  // emoji that aren't flags (so 🍽 / 🍳 / etc. keep their native rendering).
  function parseNode(root) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const v = node.nodeValue || '';
        if (!v || v.length < 2) return NodeFilter.FILTER_REJECT;
        // Skip script/style content
        const p = node.parentNode;
        if (!p) return NodeFilter.FILTER_REJECT;
        const tag = (p.tagName || '').toLowerCase();
        if (tag === 'script' || tag === 'style' || tag === 'textarea') return NodeFilter.FILTER_REJECT;
        // Skip nodes already inside a flag-emoji <img> alt (alt is text but it's an attribute, walker won't see anyway)
        if (p.classList && p.classList.contains('flag-emoji')) return NodeFilter.FILTER_REJECT;
        return RIS_PAIR.test(v) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });

    const targets = [];
    let node;
    while ((node = walker.nextNode())) targets.push(node);

    for (const text of targets) {
      RIS_PAIR.lastIndex = 0;
      const html = (text.nodeValue || '').replace(RIS_PAIR, (m) => flagToImgHtml(m));
      const span = document.createElement('span');
      span.className = 'flag-emoji-wrap';
      span.innerHTML = html;
      text.parentNode.replaceChild(span, text);
    }
  }

  eat.flagEmoji = {
    parse: parseNode,
    flagToImgHtml,
  };

  // Convenience: auto-parse on every render. Hooks into the global render()
  // by listening for a custom event fired right after #app-root is updated.
  document.addEventListener('eat:render', () => {
    const root = document.getElementById('app-root');
    if (root) parseNode(root);
  });
})();
