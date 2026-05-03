# eatrail — Dossier projet

**Cuisine le monde. Achète à côté.**

Projet d'app mobile qui relie les recettes du monde aux magasins locaux où acheter les ingrédients, à commencer par New York. Ce dossier contient l'ensemble du concept produit : branding, UX, features, MVP, stratégie de lancement, pitch investisseur, et une landing page HTML.

---

## Structure du dossier

```
eatrail_project/
├── README.md                         ← tu es ici
├── docs/
│   └── eatrail_concept_document.docx ← le concept complet (33 pages)
├── web/
│   ├── index.html                    ← landing page version terracotta (orange chaud)
│   ├── index-green.html              ← landing page version vert food (basil/sage)
│   └── app/                          ← APP v1 — prototype-green grand public
│       ├── index.html                ← shell SPA (zéro build, double-clic = ça marche)
│       ├── styles.css                ← thème green (cohérent avec landing)
│       ├── data/
│       │   ├── recipes.js            ← 20 recettes du monde, validées par natifs
│       │   └── shops.js              ← 30 magasins NYC ciblés par cuisine
│       └── js/
│           ├── utils.js              ← lookups, trail optimizer, persistance locale
│           ├── router.js             ← hash router (8 routes)
│           ├── views.js              ← templates HTML pour chaque vue
│           └── app.js                ← bootstrap + délégation d'événements
└── scripts/
    └── build_doc.py                  ← script qui génère le .docx
```

Les deux landings ont exactement le même contenu (hero, concept, features, démo, cibles, modèle économique, pitch, vision). Seule la palette visuelle change. Un bouton dans la nav permet de passer de l'une à l'autre.

L'**app v1** (`web/app/`) est le vrai produit prototype-green : SPA vanilla JS qui fait tourner les 5 features clés sur 20 recettes et 30 magasins NYC. Aucun build, aucun serveur — il suffit d'ouvrir `web/app/index.html` dans Chrome.

---

## Ce qu'il y a dans chaque fichier

### `docs/eatrail_concept_document.docx`
Document Word de 33 pages qui couvre tout le brief produit en DEUX versions stratégiques :

- **Version 1 — Startup sérieuse** (nom Savora, positionnement premium accessible, investor-ready)
- **Version 2 — Agressive croissance / viralité** (nom Mama Map, social-first, content-as-product)
- **Option avancée — Pitch fondateur** pour lever des fonds

Chaque version inclut : branding · identité visuelle · UX détaillée · features différenciantes · arborescence · modèle économique · analyse concurrentielle · MVP 30 jours avec tech stack · UI · copywriting · stratégie de lancement · 3 idées virales + 1 hack de croissance + 1 feature future.

### `web/index.html`
Landing page autonome (un seul fichier HTML + CSS + JS inline). Ouvre directement dans un navigateur. Responsive. Contient : hero, concept en 4 étapes, problème/solution, 6 features clés, 3 cibles, 4 différenciateurs, vision, footer.

### `web/app/` — App v1 prototype-green
SPA vanilla JS, zéro dépendance. Ouvre `web/app/index.html` dans le navigateur. Routes :

- `#/` — découverte (hero, humeurs, sélections du jour)
- `#/recipes` — catalogue 20 recettes, filtres pays/humeur/régime + recherche live
- `#/recipe/:slug` — fiche recette : story validée par natif, ingrédients ajustables (servings +/-), étapes, score d'authenticité
- `#/trail/:slug` — Trail Optimizer : regroupement greedy ingrédients × magasins par auth × distance, export liste de courses
- `#/shops` — annuaire 30 magasins NYC, filtre par type
- `#/shop/:slug` — fiche magasin avec ingrédients rares en stock + recettes qui passent par ici
- `#/pantry` — Pantry AI mock : ajoute des ingrédients en localStorage → recettes anti-gaspi suggérées
- `#/saved` — recettes sauvegardées (localStorage)

Les fichiers `data/recipes.js` et `data/shops.js` sont conçus pour être réutilisés tels quels par l'app mobile React Native (même schéma JSON).

### `scripts/build_doc.py`
Script Python qui régénère le document Word. Utilise `python-docx`. À exécuter avec :

```bash
python3 scripts/build_doc.py docs/eatrail_concept_document.docx
```

---

## Le concept en une phrase

Tu veux cuisiner un plat du monde → eatrail te donne les ingrédients → et te dit où les acheter près de chez toi, au meilleur prix et le plus authentique possible.

## Les 5 features qui font la différence

1. **Score d'authenticité** — chaque recette notée 0-100 par des natifs.
2. **Trail Optimizer** — itinéraire multi-magasins optimal (distance + prix + authenticité).
3. **Scan recette** — photo d'une recette → ingrédients + magasins locaux instantanés.
4. **Mode budget** — recettes et magasins s'ajustent à ta limite hebdo.
5. **Pantry AI** — garde-manger connecté, suggestions anti-gaspi.

## Stack MVP recommandée

- **Mobile** : React Native (Expo, TypeScript)
- **Backend** : Supabase (Postgres + Auth + Storage)
- **Map** : Mapbox GL Native
- **Analytics** : PostHog
- **IA** : OpenAI API (parsing recette, recos)
- **Paiement** : RevenueCat + Stripe

## Prochaines étapes possibles

1. Étendre la v1 web : auth + map Mapbox réelle + scan recette (OpenAI Vision)
2. Wrapper React Native autour des mêmes fichiers `data/*.js` (publication App Store / Play Store)
3. Backend Supabase : sync `saved` + `pantry` cross-device, contributions communautaires sur les magasins
4. Plan d'acquisition 100 premiers users à NYC
5. Pitch deck investisseur à partir du document

---

© 2026 eatrail · Follow the flavor trail.
