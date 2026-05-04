/* eatrail · v1 — hash router
 * Routes :
 *   #/                → home
 *   #/recipes         → catalog (avec ?q=, ?country=, ?mood=, ?diet=)
 *   #/recipe/:slug    → recipe detail
 *   #/trail/:slug     → trail optimizer
 *   #/shops           → shops directory
 *   #/shop/:slug      → shop detail
 *   #/pantry          → pantry AI mock
 *   #/saved           → recettes sauvegardées
 */

window.eat = window.eat || {};

(function (eat) {
  'use strict';

  const routes = [
    { pattern: /^\/?$/,                    name: 'home' },
    { pattern: /^\/recipes\/?$/,           name: 'recipes' },
    { pattern: /^\/recipe\/([^/]+)\/?$/,   name: 'recipe' },
    { pattern: /^\/trail\/([^/]+)\/?$/,    name: 'trail' },
    { pattern: /^\/shops\/?$/,             name: 'shops' },
    { pattern: /^\/shop\/([^/]+)\/?$/,     name: 'shop' },
    { pattern: /^\/pantry\/?$/,            name: 'pantry' },
    { pattern: /^\/saved\/?$/,             name: 'saved' },
    { pattern: /^\/cart\/?$/,              name: 'cart' },
    { pattern: /^\/collections\/?$/,       name: 'collections' },
    { pattern: /^\/collection\/([^/]+)\/?$/, name: 'collection' },
    // v1.7 — meal planner
    { pattern: /^\/calendar\/?$/,          name: 'calendar' },
    // v1.8 — flavor DNA
    { pattern: /^\/flavor-dna\/?$/,        name: 'flavorDna' },
    // v1.2 — auth & account
    { pattern: /^\/login\/?$/,             name: 'login' },
    { pattern: /^\/signup\/?$/,            name: 'signup' },
    { pattern: /^\/forgot\/?$/,            name: 'forgot' },
    { pattern: /^\/reset\/?$/,             name: 'reset' },
    { pattern: /^\/account\/?$/,           name: 'account' },
    { pattern: /^\/settings\/?$/,          name: 'settings' },
    { pattern: /^\/security\/?$/,          name: 'security' },
    // v1.3 — onboarding + préférences
    { pattern: /^\/preferences\/?$/,       name: 'preferences' },
    { pattern: /^\/onboarding\/(\d+)\/?$/, name: 'onboarding' },
    { pattern: /^\/onboarding\/?$/,        name: 'onboarding' },
    // alias /profile → /account (rétrocompat)
    { pattern: /^\/profile\/?$/,           name: 'account' }
  ];

  /** Parse window.location.hash → { name, params, query }. */
  eat.parseRoute = function () {
    let raw = (location.hash || '#/').replace(/^#/, '');
    const queryStart = raw.indexOf('?');
    let query = {};
    if (queryStart >= 0) {
      const qs = raw.slice(queryStart + 1);
      raw = raw.slice(0, queryStart);
      for (const pair of qs.split('&').filter(Boolean)) {
        const [k, v] = pair.split('=');
        query[decodeURIComponent(k)] = decodeURIComponent(v || '');
      }
    }
    if (!raw.startsWith('/')) raw = '/' + raw;

    for (const r of routes) {
      const m = raw.match(r.pattern);
      if (m) {
        return { name: r.name, params: m.slice(1).map(decodeURIComponent), query };
      }
    }
    return { name: 'notfound', params: [], query };
  };

  /** Construit une URL hash à partir d'un nom de route et de params/query. */
  eat.routeUrl = function (name, params, query) {
    params = params || [];
    let path = '/';
    switch (name) {
      case 'home': path = '/'; break;
      case 'recipes': path = '/recipes'; break;
      case 'recipe': path = '/recipe/' + encodeURIComponent(params[0]); break;
      case 'trail': path = '/trail/' + encodeURIComponent(params[0]); break;
      case 'shops': path = '/shops'; break;
      case 'shop': path = '/shop/' + encodeURIComponent(params[0]); break;
      case 'pantry': path = '/pantry'; break;
      case 'saved': path = '/saved'; break;
      case 'cart': path = '/cart'; break;
      case 'collections': path = '/collections'; break;
      case 'collection': path = '/collection/' + encodeURIComponent(params[0]); break;
      case 'calendar': path = '/calendar'; break;
      case 'flavorDna': path = '/flavor-dna'; break;
      case 'login': path = '/login'; break;
      case 'signup': path = '/signup'; break;
      case 'forgot': path = '/forgot'; break;
      case 'reset': path = '/reset'; break;
      case 'account': path = '/account'; break;
      case 'settings': path = '/settings'; break;
      case 'security': path = '/security'; break;
      case 'preferences': path = '/preferences'; break;
      case 'onboarding': path = '/onboarding/' + (params[0] || '1'); break;
      case 'profile': path = '/account'; break; // alias
    }
    let url = '#' + path;
    if (query && Object.keys(query).length) {
      const qs = Object.keys(query)
        .filter(k => query[k] !== '' && query[k] != null)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(query[k]))
        .join('&');
      if (qs) url += '?' + qs;
    }
    return url;
  };

  /** Met à jour l'état actif des liens nav (top + bottom + icones) selon la route courante. */
  eat.updateNav = function (route) {
    const isMatch = (dataRoute) =>
      (route.name === 'home' && dataRoute === '') ||
      (route.name === 'recipes' && dataRoute === 'recipes') ||
      (route.name === 'recipe' && dataRoute === 'recipes') ||
      (route.name === 'trail' && dataRoute === 'recipes') ||
      (route.name === 'shops' && dataRoute === 'shops') ||
      (route.name === 'shop' && dataRoute === 'shops') ||
      (route.name === 'pantry' && dataRoute === 'pantry') ||
      (route.name === 'saved' && dataRoute === 'saved') ||
      ((route.name === 'collections' || route.name === 'collection') && dataRoute === 'saved') ||
      (route.name === 'cart' && dataRoute === 'cart') ||
      (route.name === 'calendar' && dataRoute === 'calendar') ||
      // toutes les sous-routes account ont la même surbrillance dans la nav
      (['account', 'settings', 'security', 'profile', 'preferences', 'onboarding'].includes(route.name) && dataRoute === 'account') ||
      (route.name === 'login' && dataRoute === 'account') ||
      (route.name === 'signup' && dataRoute === 'account');

    document.querySelectorAll('[data-route]').forEach(a => {
      a.classList.toggle('is-active', isMatch(a.getAttribute('data-route') || ''));
    });
  };

})(window.eat);
