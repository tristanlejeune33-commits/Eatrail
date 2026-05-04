# 🤝 Handoff — eatrail (4 mai 2026)

> **Lis-moi en premier** si tu es un nouvel agent qui reprend ce projet.
> Tout le contexte critique est ici. Les détails sont dans `AUDIT.md` et `DEPLOY.md`.

---

## TL;DR (10 secondes)

**eatrail** = app web + PWA mobile-first qui relie une **envie de cuisiner** à **où acheter les ingrédients à proximité**.
- 🇫🇷 UI en français (parfois bilingue FR/EN via `eat.t()`)
- 📍 Cible géo : NYC en priorité, mais marche partout dans le monde via Google Places
- 🍽️ 625 recettes × 25 cuisines · 30 magasins curés NYC + découverte dynamique mondiale
- 🚀 **EN LIGNE sur Railway** : repo `github.com/tristanlejeune33-commits/Eatrail`
- 👤 Vrais comptes Postgres (bcrypt + sessions cookies httpOnly), multi-device
- 🤖 Toute l'IA passe par **Claude (Anthropic)** — Opus 4.7 vision + inference

---

## 🏗️ Architecture (single-service deploy)

```
                    https://eatrail-xxx.up.railway.app
                             │
       ┌─────────────────────┴─────────────────────┐
       │  Express API (api/src/index.js, port 8080) │
       │                                           │
       │  GET  /                ─→ serves web/app/index.html (SPA)
       │  GET  /styles.css      ─→ web/app/styles.css
       │  GET  /js/*            ─→ web/app/js/*
       │  GET  /assets/recipes/ ─→ web/app/assets/recipes/*.jpg (51MB Pexels)
       │  GET  /sw.js           ─→ web/app/sw.js
       │  GET  /manifest.json   ─→ web/app/manifest.json
       │                                           │
       │  GET  /api             ─→ JSON intro
       │  GET  /health          ─→ { status, db }
       │  POST /api/auth/*      ─→ signup/login/logout/me/oauth-google
       │  GET  /api/recipes     ─→ filtrer + paginer
       │  GET  /api/shops       ─→ listing curated
       │  GET  /api/geo/*       ─→ shops/nearby + crowdsource checks
       │  POST /api/cart        ─→ + GET, PATCH, DELETE
       │  POST /api/favorites   ─→ + GET, import
       │  POST /api/pantry      ─→ + scan (multipart photo, Claude Vision)
       │  POST /api/meal-plan   ─→ CRUD + shopping-list aggregate
       │  GET  /api/flavor-dna/me
       │  GET  /api/nutrition/recipe/:id
       │  POST /api/push/*      ─→ subscribe/test
       │  POST /api/submissions ─→ UGC recipes
       └────────────────────┬──────────────────────┘
                            ▼
                    Railway Postgres (19 tables)
```

**Pourquoi single-service** : 1 URL, pas de CORS, cookies marchent direct, plus simple à déployer/débugger. À splitter sur Vercel + Railway plus tard si scale.

---

## 📁 Structure du repo

```
eatrail_project/
├── api/                     # Backend Express + Prisma
│   ├── prisma/
│   │   ├── schema.prisma    # 19 tables (User, Session, Recipe, Shop, Favorite, CartItem, PantryItem, Review, MealPlan, IngredientCheck, InferredAvailability, PushSubscription, UserRecipeSubmission, AuthEvent, etc.)
│   │   └── seed.js          # Charge 625 recettes + 30 shops depuis web/app/data/*.js
│   ├── src/
│   │   ├── index.js         # Serveur principal, sert SPA + API
│   │   ├── db.js            # Prisma singleton
│   │   ├── auth/
│   │   │   ├── bcrypt.js    # hash + verify (rounds=10)
│   │   │   ├── sessions.js  # createSession, setSessionCookie, etc.
│   │   │   └── middleware.js # loadSession + requireAuth
│   │   ├── lib/
│   │   │   ├── anthropic.js          # Client Anthropic singleton (DEFAULT_MODEL = claude-opus-4-7)
│   │   │   ├── ai-inference.js       # Shop × ingredient probability via Claude (prompt caching + JSON schema)
│   │   │   ├── google-places.js      # Wrapper Google Places + cache 30j en DB
│   │   │   ├── shop-matching.js      # Scoring 3-couches (heuristic + crowd + AI) + greedy trail
│   │   │   ├── nutrition.js          # USDA FoodData wrapper
│   │   │   └── zod-helpers.js        # validate() + sendValidationError()
│   │   └── routes/
│   │       ├── auth.js          # signup, login, logout, me, sessions/revoke-all
│   │       ├── oauth.js         # /api/auth/google + /callback (no passport, native fetch)
│   │       ├── recipes.js       # list (filterable) + detail
│   │       ├── shops.js         # list curated + detail
│   │       ├── favorites.js     # CRUD + import
│   │       ├── cart.js          # CRUD + import (snapshot sync)
│   │       ├── pantry.js        # CRUD + scan (Claude Vision)
│   │       ├── reviews.js       # upsert + list
│   │       ├── prefs.js         # get/put user preferences
│   │       ├── geo.js           # /shops/nearby + /shops/:id/check (crowdsource)
│   │       ├── meal-plan.js     # CRUD + shopping-list aggregate + to-cart
│   │       ├── flavor-dna.js    # GET /me (aggregate culinary identity)
│   │       ├── nutrition.js     # GET /recipe/:id (USDA-backed lazy)
│   │       ├── push.js          # VAPID public-key + subscribe + test
│   │       └── submissions.js   # UGC recipes (PENDING/APPROVED/REJECTED)
│   ├── package.json         # deps: @anthropic-ai/sdk, @prisma/client, bcryptjs, cookie-parser, cors, express, helmet, multer, web-push, zod
│   └── .env.example
│
├── web/app/                 # Frontend SPA (vanilla JS + hash router)
│   ├── index.html           # Charge dans cet ordre : i18n → config → api-client → geo → map → push → auth → prefs → utils → router → views → app + sw register
│   ├── styles.css           # ~3500 lignes, design v1.6 (tokens cream/ink/leaf, Fraunces+Inter)
│   ├── manifest.json        # PWA
│   ├── sw.js                # Service worker (cache-first images, network-first API, push handler)
│   ├── icons/icon.svg       # Logo "leaf-route" (feuille avec nervure-itinéraire)
│   ├── data/
│   │   ├── recipes/         # 25 fichiers cuisine (italian.js → polish.js, 25 recettes chacun)
│   │   ├── shops.js         # 30 magasins NYC curés (avec coords, story, tags)
│   │   └── images.js        # window.EATRAIL_IMAGES = { "carbonara": "assets/recipes/carbonara.jpg", ... }
│   ├── assets/recipes/      # 623 photos JPG (Pexels) — ~51MB total, COMMIT dans le repo (gitignored before, restored)
│   ├── scripts/
│   │   ├── fetch-images.js  # Script local : Pexels search → DL → optionnellement Wikipedia + DALL-E fallback
│   │   └── .env             # PEXELS_API_KEY (gitignored)
│   └── js/
│       ├── i18n.js          # eat.t('key', vars) — dicts FR/EN (50+ clés)
│       ├── config.js        # window.EATRAIL_CONFIG = { apiUrl } — auto-détecte localhost vs prod (same origin)
│       ├── api-client.js    # eat.api.* — namespaces : auth, recipes, shops, favorites, cart, pantry, reviews, prefs, geo, mealPlan, flavorDna, nutrition, push, submissions
│       ├── geo.js           # eat.geo — wrapper navigator.geolocation + cache 7j + fallback NYC default
│       ├── map.js           # eat.map — lazy-load Mapbox CDN + addShops + drawTrail
│       ├── push.js          # eat.push — subscribe/unsubscribe via VAPID
│       ├── auth.js          # eat.auth.signup/login/logout/current — API quand online, localStorage fallback (mode invité)
│       ├── prefs.js         # Onboarding preferences (cuisines, allergens, diet, budget)
│       ├── utils.js         # eat.cart, eat.savedIds, eat.pantry, eat.mealPlan — sync getters (localStorage) + push API en background
│       ├── router.js        # Hash router (#/, #/recipes, #/recipe/:id, #/shops, #/calendar, #/flavor-dna, etc.)
│       ├── views.js         # ~3500 lignes, tous les renderers (viewHome, viewRecipes, viewRecipe, viewShops async, viewCalendar async, viewFlavorDna async, etc.)
│       └── app.js           # render() switch + event delegation (clicks, submits, drag-drop, etc.)
│
├── tests/                   # Playwright e2e
│   ├── playwright.config.js # baseURL = http://localhost:3001, projects: chromium + mobile-chrome
│   └── e2e/smoke.spec.js    # 10 smoke tests (home, recipes, recipe, signup, calendar, sw, shops, flavor-dna, mobile nav, health)
│
├── marketing/               # Landing pages SÉPARÉES (PAS déployées par défaut)
│   ├── index.html           # Theme terracotta
│   ├── index-green.html     # Theme vert
│   └── README.md            # Comment les déployer sur Vercel plus tard
│
├── docs/eatrail_concept_document.docx
├── scripts/build_doc.py
│
├── package.json             # ROOT — délègue tout à api/ (postinstall + start)
├── .gitignore               # node_modules, .env, scripts/.env, images.cache.json
├── DEPLOY.md                # Guide Railway clic-par-clic (à jour)
├── AUDIT.md                 # ⭐ État actuel + reste à faire (v2, 4 mai 2026)
├── HANDOFF.md               # ← TU ES ICI
└── README.md
```

---

## 🔑 Décisions architecturales importantes

### 1. **Frontend = localStorage cache, API = source of truth**
Les vues utilisent des getters synchrones (`eat.cart()`, `eat.savedIds()`, `eat.pantry()`) qui lisent localStorage. Les mutations écrivent localStorage **ET** font un fire-and-forget push vers l'API. Au login, on pull l'état API → localStorage. Permet de garder les vues sync sans refactor massif tout en ayant une persistance multi-device.

```js
// utils.js — pattern
eat.toggleSave = function (id) {
  // 1. Update localStorage immediately (sync)
  const list = eat.savedIds();
  /* mutation */
  safeWrite(LS_SAVED, list);
  // 2. Fire-and-forget push to API
  if (eat.api && eat.api.currentUser) {
    eat.api.favorites.toggle(id).catch(e => console.warn(e));
  }
  return idx < 0;
};
```

### 2. **Auth hybride API + localStorage**
`eat.auth.signup/login/logout/current` essayent l'API d'abord, fallback localStorage si offline ou API down. Le user en mémoire `_apiUser` est rempli à l'init via `/api/auth/me`. **Mode invité** marche entièrement offline avec localStorage.

### 3. **Toute l'IA = Anthropic Claude Opus 4.7**
- Pantry scan (vision) : `claude-opus-4-7` avec `effort: 'medium'`, JSON schema garanti, base64 image directement
- Shop ingredient inference : `claude-opus-4-7` avec **prompt caching** sur le system prompt + `effort: 'low'` + cache DB 90j
- OpenAI gardé uniquement pour `web/app/scripts/fetch-images.js --openai` (DALL-E pour les 2 recettes manquantes — quasi jamais utilisé)
- Lib helper : `api/src/lib/anthropic.js` (singleton + DEFAULT_MODEL constant)

### 4. **Discovery shops = Google Places (cache 30j) + 30 curés**
- Curés : authScore ≥ 90, descriptions riches éditoriales
- Google : authScore=70 par défaut, basique (juste nom/adresse/rating Google)
- Cache : table `Shop` avec `source` enum (CURATED/GOOGLE/USER_SUBMITTED), `expiresAt` 30j
- Scoring 3-couches dans `lib/shop-matching.js` :
  - Heuristic (tags overlap immédiat)
  - Crowdsourced (table `IngredientCheck`, weighted decay 21j half-life) — **endpoint prêt, UI manquante**
  - AI inference (Claude, table `InferredAvailability` cache 90j)
- **Bug courant** : si la clé Google a Application Restrictions = "HTTP referrers", Google bloque les call server-to-server (pas de Referer). Fix : Application restrictions = "None" + API restrictions = "Places API".

### 5. **Single-service Railway deploy**
- Root Directory = vide (pas `api`)
- Start Command = `npm start` (root package.json délègue à api/)
- Le serveur Express détecte automatiquement `web/app/` via 6 candidate paths (cf `findSpaDir()` dans `api/src/index.js`)
- Logs `[startup] SPA_DIR resolved to: /app/web/app` au démarrage
- Variable `SERVE_STATIC=false` pour désactiver si on splits frontend sur Vercel plus tard

### 6. **Prisma `db push` au lieu de migrations**
Pour rapidité prototype. À switcher vers `migrate dev --name <X>` proper avant le scale public sérieux. Les tables sont créées dynamiquement à chaque `db push`. Contient l'extension `citext` activée via `previewFeatures: ['postgresqlExtensions']`.

---

## 🔐 Variables d'environnement Railway (état actuel)

### ✅ Configurées par le user
| Var | Origine | Usage |
|---|---|---|
| `DATABASE_URL` | Reference vers Postgres Railway | Prisma |
| `SESSION_SECRET` | Généré crypto.randomBytes(48) hex | Sessions cookies HMAC |
| `IP_HASH_SALT` | Généré crypto.randomBytes(32) hex | Anonymise IPs (RGPD) |
| `NODE_ENV` | `production` | Active cookies Secure + SameSite=none |
| `ANTHROPIC_API_KEY` | console.anthropic.com | Pantry scan + AI inference |
| `GOOGLE_PLACES_API_KEY` | console.cloud.google.com | Découverte shops |
| `MAPBOX_TOKEN` | account.mapbox.com (free) | Carte interactive |
| `USDA_API_KEY` | fdc.nal.usda.gov | Nutrition |

### ⏳ Optionnelles non encore configurées
| Var | Effort | Pour |
|---|---|---|
| `VAPID_PUBLIC_KEY` + `VAPID_PRIVATE_KEY` | `npx web-push generate-vapid-keys` (30 sec) | Web Push notifs (code prêt) |
| `VAPID_SUBJECT` | `mailto:contact@eatrail.com` | idem |
| `GOOGLE_OAUTH_CLIENT_ID` + `_SECRET` | console.cloud.google.com (~10 min setup) | Login avec Google (code prêt) |
| `RESEND_API_KEY` | resend.com (gratuit 3K/mois) | Email verification + password reset (à coder, pas encore fait) |

---

## ✅ État des features

### En production et fonctionnelles
- [x] Auth réelle Postgres (signup, login, logout, sessions revoke-all)
- [x] 625 recettes seedées avec photos (623/625 = 99.7%)
- [x] Liste recettes filtrable (cuisine, mood, diet, budget, durée) + paginée
- [x] Page recette avec hero image + 4-stat grid + ingrédients + steps + reviews
- [x] Favoris (toggle + import legacy)
- [x] Panier (CRUD + snapshot sync debounced 600ms)
- [x] Provisions (CRUD + scan photo via Claude Vision)
- [x] Reviews (upsert avec étoiles 1-5)
- [x] Géolocalisation browser + fallback NYC default
- [x] Découverte shops nearby (Google + curated, scoring + greedy trail)
- [x] Carte Mapbox interactive (pins par authScore + ligne trail)
- [x] Calendrier meal planner (week view + drag-drop + shopping-list aggregate)
- [x] Flavor DNA shareable card (passport-style)
- [x] PWA installable + offline (service worker)
- [x] i18n FR/EN
- [x] OAuth Google (code en place, config GCP TODO côté user)
- [x] Web Push (code en place, VAPID keys TODO côté user)
- [x] Nutrition USDA (code en place, clé activée)
- [x] UGC recipe submissions (CRUD + admin queue stub)
- [x] Playwright e2e (10 tests)

### ⏳ Code livré mais activation TODO
- [ ] OAuth Google : créer projet GCP + ajouter `GOOGLE_OAUTH_CLIENT_ID/SECRET` à Railway
- [ ] Web Push : `npx web-push generate-vapid-keys` + ajouter VAPID_PUBLIC/PRIVATE_KEY à Railway

### ❌ Pas encore commencé (cf AUDIT.md LISTE 1)
- [ ] Picker date/slot calendrier (au lieu de 2 `prompt()` natifs)
- [ ] Boutons crowdsource ✓/✗ ingrédients (endpoint prêt, UI manquante) ⭐
- [ ] Page shopping-list dédiée (au lieu d'`alert()`)
- [ ] Refonte design v1.6 sur login/signup/cart/account/onboarding
- [ ] CSP headers (helmet activé mais CSP désactivé)
- [ ] Cleanup code SHA-256 localStorage (cosmetic)
- [ ] Email verification + password reset (besoin Resend ou Postmark)

---

## 🎯 Convention de code & gotchas

### Naming
- Recipe IDs = slugs kebab-case : `carbonara`, `pad-thai`, `cassoulet-toulouse`
- Shop IDs = slugs pour curés (`eastern-europe-bazaar`), Google `place_id` pour Google
- 25 cuisines × 25 recettes = 625 (vérifié, pas de doublon ID)

### Frontend patterns
- Module pattern IIFE : `(function() { window.eat = window.eat || {}; ... })()`
- `eat.t('key')` pour i18n (fallback FR si pas trouvé)
- `esc()` helper dans views.js pour HTML escape (TOUJOURS utiliser sur user content)
- `requestAnimationFrame(loadXxxAsync)` pour les vues async (charge la coquille, fill ensuite)
- Event delegation dans app.js : 1 listener par event type, branchement par `e.target.id` ou `e.target.closest('[data-xxx]')`

### Backend patterns
- Toutes les routes : `validate(zodSchema, payload)` puis `sendValidationError(res, error)` si invalide
- `requireAuth` middleware sur les endpoints qui ont besoin du user
- Réponses JSON structurées : `{ items: [...] }`, `{ user: {...} }`, `{ error: 'code', message: '...' }`
- AuthEvent log pour signup/login/logout/oauth (pour brute-force detection)

### Sync API ↔ localStorage
- Mode connecté : utils.js writeXxx() = localStorage write **ET** API push (fire-and-forget)
- Mode invité (pas connecté) : utils.js writeXxx() = localStorage seul
- Au login : auth.js syncDataAfterLogin() pull API → localStorage, plus migrateGuestDataToApi() push localStorage → API

### Sécurité
- Cookies httpOnly + Secure (en prod) + SameSite=`none` (prod) ou `lax` (dev)
- Bcrypt rounds 10 (~100ms hash)
- Sessions = token aléatoire 48 bytes (base64url) en DB, jamais en JWT
- Rate limit `express-rate-limit` sur `/api/auth/*` (20 req / 15 min)
- IP hash salé (anonymisation pour les AuthEvent)

### Performance
- Photos recettes en local (`assets/recipes/*.jpg`, ~51MB total)
- Service worker cache-first sur images, network-first sur API
- Mapbox lazy-loaded (CDN script + CSS injectés à la demande)
- Pexels images servies depuis Express avec cache headers `max-age=2592000, immutable`
- Prompt caching sur Claude inference (réduit ~90% du coût)

---

## 📚 Ordre de lecture recommandé pour grok le projet

Si tu es l'agent qui reprend, lis dans cet ordre :

1. **Ce fichier HANDOFF.md** ✓ tu y es
2. **AUDIT.md** — état détaillé + LISTE 1 (avant launch) + LISTE 2 (post-launch)
3. **DEPLOY.md** — comment Railway est setup
4. **api/prisma/schema.prisma** — toutes les tables et leurs relations
5. **api/src/index.js** — entry point Express + comment le SPA est servi
6. **web/app/index.html** — ordre de chargement des scripts JS
7. **web/app/js/api-client.js** — toutes les méthodes `eat.api.*` disponibles
8. **web/app/js/utils.js** — sync getters + meal planner
9. **web/app/js/auth.js** — flow API + fallback localStorage + migration guest data
10. **web/app/js/views.js** — chercher `viewXxx` pour le renderer d'une route

---

## 🚦 Recent commits (context git)

```
e05aa72 Audit v2 — reflect current state after major dev push
897ae37 Add diagnostic logging to Google Places discover flow
9740b58 Switch all runtime AI calls from OpenAI to Anthropic Claude
8a12e4a Wire frontend to API: real Postgres-backed accounts ⭐
14daa35 Fix: serve SPA at / instead of API JSON
197ccde Robust SPA dir resolution + startup logs
474150a Add root package.json (monorepo wrapper for Railway)
4a919ed Enable Postgres citext extension via Prisma
b59b4a6 Cleanup orphan files at project root
af12030 Move landing pages to marketing/ folder
62498ef Cleanup: remove 5728 lines of dead code
31e18e7 Initial commit eatrail v1.8
```

---

## 🎬 Prochaine session recommandée

D'après l'AUDIT v2, les **3 prochaines sessions** dans l'ordre :

### Session A — UX killer demo (~4h)
1. **Picker date/slot calendrier** (modal au lieu de prompt) — `web/app/js/views.js` modifie le handler `data-schedule-meal`
2. **Boutons crowdsource ✓/✗** — sur la page shop ou shop card, ajout d'un POST vers `/api/geo/shops/:id/check`
3. **Page shopping-list dédiée** — nouvelle route `#/shopping-list?from=&to=` dans router + vue dans views.js

### Session B — Cohérence design v1.6 (~1 jour)
4. Refonte `viewLogin`, `viewSignup`, `viewForgot`, `viewReset`, `viewCart`, `viewAccount*`, `viewOnboarding` → utiliser les mêmes tokens que `viewHome`/`viewRecipe` (Fraunces serif title, validator-card style, button rounded pill, etc.)

### Session C — Sécurité prod (~3h)
5. CSP headers (helmet config dans `api/src/index.js`)
6. Setup Resend + email verification + password reset (besoin nouvelle clé `RESEND_API_KEY`)
7. Cleanup SHA-256 localStorage dans `web/app/js/auth.js` (cosmetic, gardé comme fallback offline)

Après ça : **prêt pour Product Hunt + presse foodie + beta NYC**.

---

## 💡 Top 5 bonus post-launch (par impact)

Liste 2 bonus prioritaires (ordre par valeur/effort) :

1. **G. Notifications push "Cuisine ce soir X"** (30 min) — engagement quotidien
2. **H. OAuth Google ACTIVATION** (30 min) — friction signup -80%
3. **A. Trail navigation deep links Maps Apple/Google** (1h) — UX mobile critique
4. **F. Suggestions IA semaine "✨ Remplis ma semaine"** (4h) — wow factor démo
5. **U. Sentry error tracking** (1h) — pas être aveugle aux bugs prod

---

## 🆘 Bonnes habitudes pour reprendre

- **Toujours** smoke test après modif : `node -c web/app/js/views.js && echo OK`
- **Toujours** `npx prisma validate` avant de push si tu touches au schéma
- **Jamais** modifier `web/app/data/recipes/*.js` à la main (~625 fichiers, fragile) — utiliser le seed
- **Jamais** commit `.env` ni `images.cache.json` (gitignored)
- Push GitHub → Railway redéploie automatiquement en ~1-2 min
- Logs Railway : Deployments → click le dernier → Deploy Logs (chercher `[startup]`, `[google-places]`, `[ai-inference]`, `[scan]`, `[sync]`)
- Si l'app casse en prod → check `/health` d'abord (`{status:"ok",db:"up"}`)

---

*Handoff écrit le 4 mai 2026 par Claude Sonnet 4.5 après ~3 semaines équivalent de dev cumulé. L'app est dans un état solide, en ligne, fonctionnelle, et prête pour les 3 sessions finales avant un launch beta sérieux.*

**Bon courage à toi qui prends la suite. Tout est documenté. Allez, on lance eatrail. 🚀**
