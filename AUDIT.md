# Audit eatrail · 3 mai 2026

> Audit complet par "chef de chantier". Deux listes :
> 1. **À FAIRE** — bloquants + essentiels avant de mettre en ligne
> 2. **À AMÉLIORER** — post-launch / phase 2-3

Effort : 🟢 < 1h · 🟡 1-4h · 🟠 1-2 jours · 🔴 > 2 jours

---

## 🚨 LISTE 1 — À FAIRE AVANT MISE EN LIGNE

### 🔴 BLOQUEURS (sans ça l'app ne marche pas en prod)

#### 1. **Brancher le frontend sur l'API** 🟠
**État** : `api-client.js` existe mais **0 appel** depuis `auth.js`, et **1 seul appel** depuis `views.js` (le scan pantry). Tout le reste (login, signup, cart, favoris, pantry, calendrier, reviews) utilise encore `localStorage`.
**Impact** : utilisateur ne peut pas avoir de vrai compte sync entre devices. Tout disparaît si cache navigateur vidé.
**À faire** :
- [ ] `auth.js` → `eat.api.auth.login/signup/logout/me` au lieu du SHA-256 localStorage
- [ ] `eat.cart()` / `eat.cartAdd()` → utilise `eat.api.cart.*` quand connecté (fallback localStorage sinon)
- [ ] `eat.savedIds()` / `eat.toggleSaved()` → `eat.api.favorites.*`
- [ ] `eat.recipeRating()` / `eat.addReview()` → `eat.api.reviews.*`
- [ ] `eat.prefs.*` → `eat.api.prefs.*`
- [ ] **Migration auto** au 1er login : appeler `eat.api.migrateFromLocalStorage(accountId)` (déjà codé, juste appelée nulle part)

#### 2. **Tester la chaîne complète en local** 🟡
**État** : aucun bout n'a été testé end-to-end. Le code parse, le schéma Prisma valide, mais on ne sait pas si le tout tourne ensemble.
**À faire** :
- [ ] Suivre `DEPLOY.md` étape 1 (Docker Postgres + `npm run dev` + seed)
- [ ] Test manuel : signup → login → ajout favori → refresh → vérifier persistance via Prisma Studio
- [ ] Si bug, fixer

#### 3. **Migration Prisma `add_meal_planner` + `add_geo_features`** 🟢
**État** : 2 changements de schema (calendrier + tables geo) jamais migrés.
**À faire** :
- [ ] Quand on lance la 1ère fois : `npx prisma migrate dev --name init` créera tout
- [ ] Si la DB existe déjà avant ces ajouts : `npx prisma migrate dev --name add_meal_planner_and_geo`

#### 4. **Variables d'env de prod sur Railway** 🟢
**État** : `.env.example` documente bien, mais aucune var n'est encore set.
**À faire** : sur Railway, créer :
- [ ] `DATABASE_URL` (référence Postgres)
- [ ] `SESSION_SECRET` (généré 48 bytes random)
- [ ] `IP_HASH_SALT` (généré 32 bytes random)
- [ ] `NODE_ENV=production`
- [ ] `OPENAI_API_KEY` (optionnel, pour scan + AI inference shops)
- [ ] `GOOGLE_PLACES_API_KEY` (optionnel, pour geo discovery)

---

### ⚠️ ESSENTIELS (cassent l'UX si non fait)

#### 5. **Calendrier — picker date/slot avec UI au lieu de `prompt()`** 🟡
**État** : le bouton "📅 Programmer ce repas" sur la page recette ouvre 2 `prompt()` natifs successifs (date + slot). Affreux mobile.
**À faire** :
- [ ] Remplacer par modal ou dropdown avec :
  - Sélecteur de date (input type="date" ou 7 boutons "Aujourd'hui / Demain / Mercredi / ...")
  - Boutons radio pour slot (🍳 / 🥗 / 🍽 / 🍪)
  - Slider servings
  - Optionnel : champ notes

#### 6. **Boutons crowdsource ✓/✗ ingrédients sur shops** 🟡
**État** : endpoint `/api/geo/shops/:id/check` existe côté backend, mais **aucune UI** pour l'appeler.
**À faire** : sur la page shop ou dans la liste après une recherche par recette, afficher des boutons "✓ J'ai trouvé" / "✗ Plus en stock" sur chaque ingrédient. C'est le **moat** mentionné dans le design brief.

#### 7. **Page liste de courses dédiée (au lieu d'`alert()`)** 🟡
**État** : le bouton "📋 Liste de courses de la semaine" sur le calendrier fait juste un `alert()` puis push tout au panier. Pas de prévisualisation.
**À faire** :
- [ ] Nouvelle vue `#/shopping-list?from=...&to=...` qui affiche les ingrédients agrégés groupés par tag/magasin
- [ ] Bouton "Ajouter au panier" plus contextualisé (peut décocher des items avant)

#### 8. **Cohérence design v1.6 sur toutes les vues** 🟠
**État** : nouveau design appliqué seulement à : `viewHome`, `viewRecipes` (cards), `viewRecipe` (détail). Pas appliqué à : `viewLogin`, `viewSignup`, `viewAccount*`, `viewCart`, `viewSaved`, `viewOnboarding`, `viewCalendar` (partiellement).
**À faire** :
- [ ] Refonte visuelle des pages login/signup avec les nouveaux tokens (greeting, validator-card style)
- [ ] Cart : utiliser `.recipe-card` style pour les items
- [ ] Saved : déjà OK (utilise recipeCard refactoré)
- [ ] Onboarding : modernise les écrans 1-5

#### 9. **Bottom nav : afficher l'icône Calendrier en mobile** 🟢
**État** : déjà fait ✅ (ajouté dans cette session). Vérifier que ça marche bien sur iPhone (safe-area-inset).

#### 10. **Nettoyage des 8 anciens fichiers `data/recipes/<region>.js`** 🟢
**État** : 3033 lignes de dead code (east-asian.js, european.js, etc.) — plus chargés depuis index.html, mais toujours dans le repo.
**À faire** :
- [ ] Supprimer les 8 fichiers (action destructive — nécessite ta confirmation)

#### 11. **Nettoyage `styles-v1-backup.css` (2695 lignes inutilisées)** 🟢
**État** : backup créé pendant le refactor v1.6, plus chargé.
**À faire** :
- [ ] Supprimer le fichier

#### 12. **Commit + push initial sur GitHub** 🟢
**État** : aucun commit n'a été fait. Tout est local.
**À faire** :
- [ ] `git init` + premier commit (les 51 MB d'images iront avec)
- [ ] Créer repo GitHub + push (suivre DEPLOY.md étape 2)

---

### 🔒 SÉCURITÉ (à régler avant trafic public)

#### 13. **Retirer le système localStorage de comptes (SHA-256 client)** 🟡
**État** : `auth.js` fait du SHA-256 + salt côté navigateur. Ça marchait pour le proto mais c'est un **trou de sécurité** (n'importe qui inspectant le localStorage voit le hash + salt + email).
**À faire** :
- [ ] Une fois l'API branchée (point #1), **supprimer tout le code de hash client-side** dans `auth.js`. Ne garder que les appels API (qui font bcrypt côté serveur).
- [ ] Garder une "migration" : à l'ouverture, si `eatrail.v1.accounts` existe, proposer "Recrée ton compte avec ton email" (le hash localStorage n'est PAS portable car salt différent du bcrypt serveur).

#### 14. **Retirer la clé OpenAI du localStorage** 🟢
**État** : `eat.openaiKey()` stocke la clé OpenAI en clair dans `localStorage.eatrail.openai_key`. Trou de sécurité.
**À faire** :
- [ ] Le scan pantry doit appeler le **proxy serveur** `/api/pantry/scan` (déjà codé !) qui utilise la clé serveur-side
- [ ] Supprimer le code client qui demande la clé via `prompt()`
- [ ] Le user n'a plus besoin de fournir sa clé

#### 15. **CSP (Content Security Policy) headers** 🟡
**État** : `helmet()` est en mode "minimal" (CSP désactivé).
**À faire** :
- [ ] Activer CSP avec liste blanche : Pexels CDN, Wikipedia upload.wikimedia.org, Google Maps, OpenAI API, fonts.googleapis.com, fonts.gstatic.com

#### 16. **Email verification pour signup** 🟠
**État** : signup crée le compte direct, sans vérifier l'email. Mauvais pour anti-spam.
**À faire** :
- [ ] Ajouter `User.emailVerifiedAt` dans schema
- [ ] Endpoint `/api/auth/send-verification` qui mail un magic link
- [ ] Service email : Resend (gratuit 3K/mois), SendGrid, Postmark
- [ ] Bloquer la création de session tant que pas vérifié OU laisser créer + flag dans UI

#### 17. **Password reset par email réel** 🟠
**État** : `viewForgot` / `viewReset` existent mais ne font qu'écrire en localStorage.
**À faire** : pareil que #16 (besoin d'un service email)

---

## 💡 LISTE 2 — À AMÉLIORER (POST-LAUNCH)

### 🗺️ Carte & Géo (le plus impactant pour le UX)

#### A. **Mapbox map sur la page Magasins** 🟡
- Pin différencié par tier d'authenticité (taille = auth, couleur = prix)
- Bottom sheet style Uber pour la liste
- Trail tracé sur la carte (ligne entre les stops)
- 50K req/mois gratuit Mapbox

#### B. **Trail navigation deep links** 🟢
- Bouton "Ouvrir dans Maps" qui ouvre Apple Plans / Google Maps avec les stops pré-remplis
- iOS : `maps://?daddr=...&saddr=...`
- Android : `geo:...`

#### C. **Mode "trail" piéton vs vélo vs voiture** 🟡
- Calcul de durée selon mode (Mapbox Directions API)

#### D. **Notifications push "Maya a trouvé ton yuzu"** 🔴
- Web Push API + service worker
- Service : Firebase Cloud Messaging (gratuit)

---

### 📅 Calendrier

#### E. **Drag-drop entre slots / jours** 🟠
- Sortable.js ou HTML5 drag API native

#### F. **Patterns récurrents** 🟡
- "Tous les lundis = batch cooking"
- "Tous les matins = même petit-déj"
- Schema : ajout `recurrence` JSON sur MealPlan

#### G. **Export .ics → Google/Apple Calendar** 🟢
- Endpoint `/api/meal-plan/export.ics?from=&to=`
- Format iCalendar standard

#### H. **Suggestions IA pour la semaine** 🟠
- Bouton "Remplis ma semaine" qui prend en compte : préférences user + recettes déjà cuisinées + budget + temps dispo
- Appel Claude/GPT pour générer un planning

---

### 👤 Comptes & Identity

#### I. **Onboarding "Flavor DNA"** 🟠 (mentionné dans le design brief)
- Carte design éditoriale type passeport après onboarding
- Shareable Instagram Stories / TikTok
- Update mensuel façon Spotify Wrapped

#### J. **Login Google / Apple** 🟡
- OAuth 2.0
- Réduit la friction signup de 80%

#### K. **2FA TOTP** 🟡
- Pour compte premium plus tard

#### L. **Profils publics** 🟠
- `/u/<username>` qui montre les recettes faites + reviews
- Follow / followers

---

### 🍽️ Recettes

#### M. **Submission user de recettes** 🔴
- Workflow modération (status: PENDING → APPROVED)
- Photo upload (S3 / Cloudflare R2)

#### N. **Photos par les users sur les reviews** 🟡
- Upload + modération

#### O. **Comments threadés** 🟡
- Conversation sous chaque recette

#### P. **Collections / cookbooks** 🟡
- "Mes plats d'hiver", "Pour les invités", etc.
- L'utilisateur groupe ses favoris

#### Q. **Nutrition info** 🟠
- API USDA FoodData Central (gratuite)
- Calculs calories/protéines/etc.

#### R. **Carbon footprint per recipe** 🟠
- Données : Eaternity API ou tableaux open-data

---

### 📱 Performance & PWA

#### S. **PWA installable + offline mode** 🟡
- `manifest.json`
- Service Worker qui cache HTML/CSS/JS/images
- Offline: lecture des recettes même sans réseau

#### T. **Lazy loading des vues** 🟡
- Actuellement tout `views.js` chargé d'un coup (~3500 lignes)
- Découper par route et charger à la demande

#### U. **Image optimization** 🟢
- WebP au lieu de JPG (-30% taille)
- `srcset` pour retina
- Placeholder LQIP (low-quality image placeholder)

#### V. **CDN edge caching** 🟢
- Si trafic monte, mettre Cloudflare devant Railway

---

### 🌐 Internationalisation & multi-villes

#### W. **i18n (FR/EN/ES…)** 🟠
- Toutes les strings dans un fichier de traduction
- Currently FR-only

#### X. **Multi-villes (Paris, Tokyo, Londres…)** 🔴
- DB shops scalable (déjà compatible — `Shop.source = GOOGLE` rend universel)
- Curation de magasins par ville
- Adapter "trail Bryant Park (Midtown)" en dynamique

---

### 🛠️ DevOps & Qualité

#### Y. **Sentry pour error tracking** 🟢
- Free tier 5K erreurs/mois
- Plug Sentry SDK dans `index.js` backend + frontend

#### Z. **Tests E2E avec Playwright** 🟠
- Au minimum : signup → login → ajout favori → calendrier → shopping list

#### AA. **Tests unitaires backend** 🟡
- Vitest ou Jest sur les helpers (shop-matching, ai-inference)

#### BB. **Logging structuré** 🟢
- Pino ou Winston au lieu de `console.log`

#### CC. **Backup auto Postgres** 🟢
- Railway fait des backups quotidiens automatiquement (PRO plan)
- Sinon `pg_dump` + S3

#### DD. **Healthcheck enrichi** 🟢
- Actuellement `/health` check juste la DB
- Ajouter : version, uptime, dernière migration, latence Google/OpenAI

---

### 💰 Monétisation (pour quand t'es prêt)

#### EE. **Recipes premium** 🟠
- Tier gratuit : 100 recettes
- Tier pro 5€/mois : 625 + accès AI inference shops + meal plan AI

#### FF. **Sponsored shops** 🔴
- Magasins paient pour être en haut des résultats geo

#### GG. **Partenariats marques** 🔴
- "Cette recette utilise [marque]" + lien d'achat affilié

---

## 📊 Récap chiffré

| Catégorie | Nombre items | Effort cumulé |
|---|---|---|
| Bloqueurs | 4 (#1-4) | ~2 jours dev |
| Essentiels UX | 8 (#5-12) | ~3 jours dev |
| Sécurité | 5 (#13-17) | ~2 jours + setup email service |
| **TOTAL avant launch** | **17 items** | **~7-10 jours dev solo** |
| Améliorations Phase 2 | ~30 items | À étaler sur 6-12 mois |

---

## 🎯 Ma reco priorisée pour les 2 prochaines semaines

1. **Jour 1-2** : faire les bloqueurs #1 (brancher API) + #3 (migration Prisma)
2. **Jour 3** : tester en local end-to-end #2 + nettoyer dead code #10 #11
3. **Jour 4** : déployer sur Railway #4 + push GitHub #12
4. **Jour 5-6** : sécurité #13 + #14 (retirer SHA-256 client + clé OpenAI client)
5. **Jour 7-8** : UX du calendrier #5 + #7 (picker propre + page shopping list)
6. **Jour 9-10** : crowdsource buttons #6 + cohérence design #8

Après ça, l'app est **shippable** pour des early users à NYC.

Phase 2 : Mapbox map + Flavor DNA + premium tier.

---

*Audit généré le 3 mai 2026 — fait sur la base d'une revue manuelle du code.*
