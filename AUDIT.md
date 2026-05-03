# Audit eatrail · v2 (4 mai 2026)

> Mise à jour de l'audit après plusieurs sessions de dev intensif.
> Beaucoup d'items du v1 sont **terminés**. Voici la nouvelle photo.

Effort : 🟢 < 1h · 🟡 1-4h · 🟠 1-2 jours · 🔴 > 2 jours

---

## ✅ DÉJÀ EN PROD (récap des wins)

L'app est **en ligne sur Railway** et fonctionnelle :

- **Backend** : Node + Express + Prisma + Postgres, 12 modules de routes (auth, recipes, shops, favorites, cart, pantry, reviews, prefs, geo, meal-plan, flavor-dna, nutrition, push, oauth, submissions)
- **Frontend** : SPA branché sur l'API (auth réelle, sessions cookies httpOnly, multi-device)
- **Données** : 625 recettes (623 avec photos Pexels) + 30 magasins NYC curés + découverte dynamique mondiale via Google Places
- **AI** : Claude Opus 4.7 (vision pour scan provisions + inference shop×ingredient avec prompt caching)
- **Carte** : Mapbox interactive avec pins colorés par authScore + trail tracé
- **Calendrier** : Meal planner avec drag-drop + agrégation shopping list
- **PWA** : Installable + offline (service worker)
- **i18n** : FR/EN
- **Identity card** : Flavor DNA shareable
- **Tests** : Playwright e2e (10 smoke tests)

---

## 🚨 LISTE 1 — RESTE AVANT LAUNCH PUBLIC (8 items, ~3-5 jours)

### ⚠️ UX Killer Demo (3 items, ~3-4h)

#### 1. **Picker date/slot calendrier** 🟡 1-2h
**Problème** : Bouton "📅 Programmer ce repas" sur la page recette ouvre 2 `prompt()` natifs (date + slot). Affreux mobile.
**Fix** : Modal HTML avec :
- `<input type="date">` (sélecteur natif iOS/Android)
- 4 boutons radio pour slot (🍳 Petit-déj / 🥗 Déj / 🍽 Dîner / 🍪 Snack)
- Slider servings 1-12
- Bouton "Programmer" → ferme modal + render

#### 2. **Boutons crowdsource ✓/✗ ingrédients** 🟡 1-2h ⭐
**Problème** : L'endpoint `/api/geo/shops/:id/check` existe mais aucune UI ne l'appelle. C'est le **moat #1 du design brief** ("Ingredient Radar communautaire").
**Fix** : Sur la page shop OU dans la liste après recherche par recette, afficher pour chaque ingrédient :
- Bouton "✓ Trouvé ici" (vert)
- Bouton "✗ Plus en stock" (rouge)
- Au clic → POST `/api/geo/shops/:id/check` + toast confirmation
- Affichage de "Maya l'a trouvé il y a 2h" si dispo

#### 3. **Page shopping-list dédiée** 🟡 1-2h
**Problème** : Bouton "📋 Liste de courses semaine" dans calendrier fait un `alert()` puis push tout au panier. Pas de prévisualisation, pas de control.
**Fix** : Nouvelle vue `#/shopping-list?from=X&to=Y` :
- Liste des ingrédients agrégés groupés par tag/magasin
- Checkboxes pour décocher avant export
- Bouton "Ajouter au panier" + "Envoyer à un·e ami·e" (deep link partage)

### ⚠️ Cohérence design (1 item, ~1 jour)

#### 4. **Refonte design v1.6 sur les vues legacy** 🟠 1 jour
**Problème** : Login/signup/cart/account/onboarding sont en design v1.5 (ancien), home/recettes/recette sont en v1.6. Fait tâche.
**Fix** : Appliquer les mêmes tokens (Fraunces title + Inter body, validator-card style, button rounded pill) sur :
- `viewLogin`, `viewSignup`, `viewForgot`, `viewReset`
- `viewCart` (utiliser `.recipe-card` style pour les items)
- `viewAccount*` (settings, security, preferences)
- `viewOnboarding` (5 écrans)

### 🔒 Sécurité prod (3 items, ~3h)

#### 5. **CSP (Content Security Policy) headers** 🟡 1h
**Problème** : `helmet()` actif mais `contentSecurityPolicy: false` (désactivé pour pas casser les CDN externes).
**Fix** : Activer CSP avec allowlist :
```js
helmet.contentSecurityPolicy({
  directives: {
    'default-src': ["'self'"],
    'img-src': ["'self'", 'data:', 'images.pexels.com', 'upload.wikimedia.org', 'maps.googleapis.com'],
    'script-src': ["'self'", 'api.mapbox.com'],
    'connect-src': ["'self'", 'api.mapbox.com', 'events.mapbox.com'],
    'style-src': ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
    'font-src': ["'self'", 'fonts.gstatic.com'],
  },
});
```

#### 6. **Cleanup SHA-256 localStorage** 🟢 30 min
**Problème** : `auth.js` garde le code de hash SHA-256 localStorage comme fallback offline. C'est OK pour mode invité mais le code dead peut être nettoyé.
**Fix** : Garder uniquement le strict minimum localStorage (favoris/cart/pantry pour mode invité), virer le pseudo-account-system avec hash.

#### 7. **Email verification + password reset** 🟠 2-3h chacun
**Problème** : Signup crée un compte sans vérifier l'email. Reset password est mock (génère un token affiché in-app).
**Fix** : Setup d'un service email :
- **Resend** (gratuit 3K emails/mois) ou **Postmark** (gratuit 100/mois)
- Endpoints `/api/auth/send-verification` + `/api/auth/verify/:token`
- Endpoints `/api/auth/forgot-password` + `/api/auth/reset/:token`
- Variable env `RESEND_API_KEY` + templates HTML

---

## 💡 LISTE 2 — AMÉLIORATIONS POST-LAUNCH

### 🗺️ Carte & Géo (4 items)

#### A. **Trail navigation deep links** 🟢 1h
Boutons "Ouvrir dans Maps" qui ouvrent Apple Plans / Google Maps avec stops pré-remplis :
- iOS : `maps://?daddr=...&saddr=...`
- Android : `google.navigation:q=...`

#### B. **Mode trail piéton vs vélo vs voiture** 🟡 2h
Toggle sur la page shopping-list / trail. Calcul durée selon mode (Mapbox Directions API, ~$2/1000 requests).

#### C. **Multi-villes** 🟠 1-2 jours
Détecter automatiquement la ville de l'utilisateur (reverse-geocode lat/lng). Adapter les textes ("Paris", "Tokyo" au lieu de "NYC"). Curation lente de magasins par ville.

### 📅 Calendrier (4 items)

#### D. **Patterns récurrents** 🟡 2-3h
"Tous les lundis = batch cooking", "Tous les matins = smoothie". Schema : ajout `recurrence` JSON sur MealPlan + UI dans le picker.

#### E. **Export .ics → Google/Apple Calendar** 🟢 1h
Endpoint `/api/meal-plan/export.ics?from=&to=` → format iCalendar standard. Bouton "Ajouter à mon calendrier" dans le picker.

#### F. **Suggestions IA pour la semaine** 🟠 4h
Bouton "✨ Remplis ma semaine" : Claude génère un planning équilibré (variété cuisines + budget + temps) basé sur prefs user.

#### G. **Notifications "Cuisine ce soir X"** 🟢 30 min
Web Push activé hier — il faut juste un cron/scheduled task qui envoie une notif chaque soir 18h pour les meal-plans `PLANNED` du jour.

### 👤 Identité & Comptes (4 items)

#### H. **OAuth Google activation** 🟢 30 min (config)
Code OAuth Google déjà en backend ✅. Reste juste à créer le projet Google Cloud + obtenir CLIENT_ID/SECRET + ajouter à Railway.

#### I. **2FA TOTP** 🟠 1 jour
Google Authenticator-style. Lib : `otplib`. Endpoint `/api/auth/2fa/enable` + `/verify`.

#### J. **Profils publics** 🟠 2-3 jours
`/u/<username>` qui montre les recettes faites + reviews + Flavor DNA. Follow / followers. Schema : ajout `username` unique sur User + table `Follow`.

#### K. **Email notifications hebdo** 🟡 2h
"Bilan culinaire de la semaine" : 5 recettes cuisinées, 3 nouveaux ingrédients explorés, etc.

### 🍽️ Recettes & UGC (5 items)

#### L. **Photos par users sur reviews** 🟡 4h
Upload via `/api/reviews/:id/photos` + storage S3 ou Cloudflare R2. Modération.

#### M. **Comments threadés sur recettes** 🟡 4h
Schema : ajout table `Comment` avec `parentId` self-référence. UI nested.

#### N. **Collections / cookbooks** 🟡 4h
"Mes plats d'hiver", "Pour les invités", etc. L'utilisateur groupe ses favoris en collections.

#### O. **Nutrition info** ✅ DONE (USDA wired)
À activer côté user : ajouter `USDA_API_KEY` sur Railway.

#### P. **Carbon footprint per recipe** 🟠 1 jour
API : Eaternity ou tableaux open-data USDA. Affichage badge CO2 sur chaque recette.

### 📱 Performance & PWA (4 items)

#### Q. **Lazy loading des vues** 🟡 4h
`views.js` fait ~3500 lignes chargées d'un coup. Découper par route et charger à la demande via dynamic `import()`.

#### R. **Image optimization** 🟡 2h
- Convertir Pexels JPGs en WebP (-30% taille) via sharp à l'upload
- Ajouter `srcset` pour retina
- Placeholder LQIP (low-quality image placeholder)

#### S. **Cloudflare CDN devant Railway** 🟢 1h
Si trafic monte. CNAME ton domaine vers Cloudflare → Cloudflare vers Railway. Cache automatique des assets.

#### T. **Service worker plus malin** 🟡 2h
Actuellement cache simple. Ajouter : background sync pour cart/favorites quand offline → push à reconnexion.

### 🛠️ DevOps & Qualité (5 items)

#### U. **Sentry error tracking** 🟢 1h
Free 5K erreurs/mois. SDK Sentry dans `index.js` backend + frontend. Notifs Slack/email sur erreurs prod.

#### V. **Logging structuré (Pino)** 🟢 1h
Au lieu de `console.log`. Permet recherche/filtre dans les logs Railway.

#### W. **Tests unitaires backend** 🟡 4-6h
Vitest sur les helpers (`shop-matching.js`, `nutrition.js`, `ai-inference.js`). Coverage > 60%.

#### X. **Tests E2E élargis** 🟡 4h
Compléter Playwright (10 → 30 tests) : signup → login → schedule → cart → trail.

#### Y. **Healthcheck enrichi** 🟢 30 min
Actuellement check juste DB. Ajouter : version git commit, uptime, latence Anthropic/Google/Mapbox, dernière migration.

### 💰 Monétisation (3 items, quand prêt)

#### Z. **Tier free vs premium** 🟠 2-3 jours
- Free : 100 recettes + 5 trails/mois + scan provisions limité
- Premium 5€/mois : 625 recettes + trails illimités + AI inference + meal plan AI + carbon footprint
- Stripe integration

#### AA. **Sponsored shops** 🔴 1 semaine
Magasins paient pour être en top des résultats geo. UI badge "✨ Partenaire". Admin dashboard pour les marques.

#### BB. **Partenariats affiliés** 🔴 1 semaine
"Cette recette utilise [marque]" + lien d'achat affilié. Amazon Associates, La Vie Claire, etc.

---

## 📊 Récap chiffré

| Catégorie | Avant launch | Post-launch (Phase 2) |
|---|---|---|
| Items | **8** | **~28** |
| Effort cumulé | **~3-5 jours dev** | **~6-12 mois** |
| Bloqueurs réels | **0** | — |
| Qualité shippable | **Oui pour beta users NYC** | — |

---

## 🎯 Recommandé pour les 3 prochaines sessions

### Session A — UX killer demo (~4h)
1. **Picker calendar** (#1)
2. **Boutons crowdsource ✓/✗** (#2) — c'est le moat unique
3. **Page shopping-list dédiée** (#3)

→ Démo killer : "j'ai planifié 5 repas → liste de courses agrégée → trail multi-shops sur la carte → check d'ingrédient communautaire". Tout le user journey.

### Session B — Cohérence design (~1 jour)
4. **Refonte login/signup/cart/account** au design v1.6 (#4)

### Session C — Sécurité prod (~3h)
5. **CSP headers** (#5)
6. **Cleanup SHA-256 localStorage** (#6)
7. **Setup Resend + email verification + password reset** (#7) — d'un coup vu que c'est le même service email

Après ça, **prêt pour première campagne d'acquisition** (Product Hunt, presse foodie, communautés expat NYC).

---

## 💡 Top 5 bonus à faire après launch

Dans cet ordre, par impact viral :

1. **Notifications push "Cuisine ce soir"** (#G — 30 min) — engagement quotidien
2. **OAuth Google activation** (#H — 30 min) — réduit friction signup -80%
3. **Trail deep links Maps** (#A — 1h) — UX critique mobile
4. **Suggestions IA semaine** (#F — 4h) — wow effect
5. **Sentry** (#U — 1h) — pour pas être aveugle aux bugs prod

---

*Audit v2 — généré 4 mai 2026 après ~3 semaines équivalent de dev.*
