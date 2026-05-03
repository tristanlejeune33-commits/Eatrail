# Guide de déploiement eatrail · pour débutants

Tu vas mettre en ligne **tout sur Railway** (le plus simple). Site + API + base de données = **1 seul URL**, 1 seule plateforme.

```
┌─────────────────────────────────────────────────────┐
│              eatrail.up.railway.app                 │
│  ┌──────────────────┐    ┌──────────────────────┐   │
│  │  SITE WEB (SPA)  │ ←→ │  API (Express)       │   │
│  │  /               │    │  /api/*              │   │
│  └──────────────────┘    └──────────────────────┘   │
│                                  ↓                  │
│                          ┌──────────────────┐       │
│                          │  PostgreSQL      │       │
│                          └──────────────────┘       │
└─────────────────────────────────────────────────────┘
                  RAILWAY (1 service + 1 DB)
```

**Temps total** : 1h30 si tout va bien · 2h si tu installes Node/Git pour la 1ère fois.

---

## ⚙️ Étape 0 — Préparer ton PC (30 min)

### 0.1 — Node.js
1. https://nodejs.org → bouton **LTS** (à gauche)
2. Lance le `.msi` → suivant suivant suivant → installe
3. Vérifie dans **PowerShell** (touche Windows → tape "powershell" → Enter) :
   ```powershell
   node --version
   ```
   Doit afficher `v20.x.x` ou plus.

### 0.2 — Git
1. https://git-scm.com/download/win → installe (toutes options par défaut)
2. Vérifie : `git --version`

### 0.3 — Docker Desktop (uniquement pour tester en local)
- Optionnel mais recommandé. https://www.docker.com/products/docker-desktop
- Si tu sautes ça, tu pourras pas tester en local — mais tu peux quand même déployer direct.

### 0.4 — Comptes en ligne (gratuits)
- **GitHub** : https://github.com/signup
- **Railway** : https://railway.app → "Login with GitHub"

---

## 🧪 Étape 1 — Tester en local (15 min, OPTIONNEL)

Si tu veux vérifier avant de déployer. Sinon saute à l'étape 2.

### 1.1 — Lancer Postgres en local
```powershell
docker run -d --name eatrail-pg -p 5432:5432 -e POSTGRES_PASSWORD=password -e POSTGRES_DB=eatrail postgres:16
```

### 1.2 — Configurer l'API
```powershell
cd C:\Users\trist\OneDrive\Documents\Claude\Projects\eatrail_project\api
copy .env.example .env
```

Ouvre `.env` dans Notepad. Mets :
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/eatrail?schema=public"
```

Génère 2 clés (lance, copie le résultat dans `.env` après `SESSION_SECRET=` puis `IP_HASH_SALT=`) :
```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 1.3 — Migrate + seed + lancer
```powershell
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Si tu vois `eatrail-api listening on :3001` → ouvre :
- http://localhost:3001/health → `{"status":"ok"}` ✅
- http://localhost:3001/ → **ton site** (servi par Express) 🎉

✅ Tout marche en local. Coupe avec Ctrl+C.

---

## 🐙 Étape 2 — Pousser sur GitHub (15 min)

### 2.1 — Créer le repo
1. https://github.com/new
2. Nom : `eatrail`
3. **Private** (pour pas que ton code soit public)
4. Ne coche rien d'autre
5. Clique **"Create repository"**
6. Note l'URL : `https://github.com/TON-USER/eatrail.git`

### 2.2 — Pousser ton code
```powershell
cd C:\Users\trist\OneDrive\Documents\Claude\Projects\eatrail_project
git init
git add .
git commit -m "Initial commit — eatrail v1.6"
git branch -M main
git remote add origin https://github.com/TON-USER/eatrail.git
git push -u origin main
```

Remplace `TON-USER` par ton pseudo. Pour le mot de passe, utilise un **Personal Access Token** :
- https://github.com/settings/tokens/new
- Coche `repo` (toutes les options sous repo)
- "Generate"
- Utilise ce token comme mot de passe

✅ Code sur GitHub.

---

## 🚂 Étape 3 — Déployer sur Railway (20 min)

### 3.1 — Créer le projet + Postgres
1. https://railway.app/new
2. Clique **"Deploy PostgreSQL"** d'abord (ça crée juste la DB)
3. Une fois la DB créée, dans le même projet : **"+ New" → "GitHub Repo"** → autorise → choisis `eatrail`

### 3.2 — Configurer le service eatrail
Clique sur le service `eatrail` (PAS le service Postgres) :

**Settings** :
- **Service Name** → `eatrail`
- **Root Directory** → `/api` ⚠️ **TRÈS IMPORTANT**
- **Watch Paths** → `/api/**` (Railway redéploie quand on push dans ce dossier)
- **Build Command** → laisse vide
- **Start Command** → `npx prisma migrate deploy && node src/index.js`

**Variables** — clique **"+ New Variable"** pour chaque ligne :

| Variable | Valeur |
|---|---|
| `DATABASE_URL` | clique **"Add Reference"** → choisis Postgres → `DATABASE_URL` |
| `SESSION_SECRET` | génère une clé : `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `IP_HASH_SALT` | autre clé générée pareil |
| `NODE_ENV` | `production` |
| `OPENAI_API_KEY` | ta clé OpenAI (pour le scan pantry + AI inference shops) — optionnel |
| `GOOGLE_PLACES_API_KEY` | ta clé Google Places (pour découvrir les vrais magasins autour du user) — optionnel |

⚠️ **Pas besoin de `ALLOWED_ORIGINS`** (le site et l'API sont sur la même URL).

### 🗺️ Optionnel — Activer la géo-découverte (Google Places)

Sans cette clé, l'app utilise les 30 magasins NYC curés. Avec, elle découvre dynamiquement n'importe quel magasin autour du user (NYC, Paris, Tokyo, etc.).

1. Va sur https://console.cloud.google.com/google/maps-apis
2. **Create project** (gratuit)
3. **APIs & Services → Library** → cherche "Places API" → **Enable**
4. **APIs & Services → Credentials → Create Credentials → API Key**
5. Copie la clé → mets-la dans Railway `GOOGLE_PLACES_API_KEY`
6. **Restreins-la** : sur la page de la clé, restreins à ton domaine Railway pour éviter les abus

**Coût** : Google offre $200 de crédit gratuit par mois (≈ 11.000 requêtes Place Details). Avec notre cache 30 jours par magasin, tu tiens largement à plusieurs milliers d'utilisateurs/mois sans payer.

**Networking** :
- Clique **"Generate Domain"**
- Tu reçois `https://eatrail-production-xxxx.up.railway.app` → **NOTE-LA**

### 3.3 — Premier déploiement
Railway redéploie auto. Attends 1-2 min. Va dans **Deployments** :
- Si la dernière ligne est verte ✅ → c'est bon
- Si rouge ❌ → clique dessus, regarde les logs, copie l'erreur et reviens me voir

### 3.4 — Charger les recettes (seed)
Le serveur est déployé mais la DB est vide. Pour la peupler :

**Méthode 1 — depuis ton PC** (la plus simple) :
1. Sur Railway, va dans le service Postgres → **Variables** → `DATABASE_URL` → clique l'icône "Copy"
2. Dans PowerShell :
   ```powershell
   cd C:\Users\trist\OneDrive\Documents\Claude\Projects\eatrail_project\api
   $env:DATABASE_URL="<colle-la-valeur-ici>"
   npm run seed
   ```
3. Tu vois : `recipes: 625, shops: 30` ✅

**Méthode 2 — modifier le start command** pour faire le seed au 1er déploiement :
- Dans Railway → Settings → Start Command :
  ```
  npx prisma migrate deploy && npm run seed && node src/index.js
  ```
- Redéploie une fois, puis remets le start command sans le seed

### 3.5 — Test
Va sur `https://eatrail-production-xxxx.up.railway.app/` → tu dois voir **ton site complet en ligne** 🎉

Test que la DB répond :
- `https://...up.railway.app/api/recipes?perPage=3` → JSON avec 3 recettes

---

## ✅ Étape 4 — Test final

1. Ouvre ton URL Railway
2. Crée un compte → ajoute des favoris → **rafraîchis la page** → tes favoris doivent persister (ils sont dans la DB Postgres, pas dans le navigateur)
3. F12 → onglet "Console" → tu dois voir :
   ```
   [eatrail] API: https://...up.railway.app (local: false)
   ```

🎉 **Tout est en ligne.**

---

## 🔄 Workflow après déploiement

Quand tu modifies du code :
```powershell
git add .
git commit -m "Décris ton changement"
git push
```
Railway redéploie automatiquement en ~1 min.

---

## 🚨 Si ça plante

| Erreur | Solution |
|---|---|
| Build Railway échoue avec `prisma command not found` | Vérifie que **Root Directory** est `/api` dans Settings |
| `prisma migrate deploy` échoue | Vérifie `DATABASE_URL` Reference Postgres |
| Site charge mais `[eatrail] API: undefined` dans console | Vérifie que `js/config.js` est bien chargé avant les autres scripts |
| `401 invalid_credentials` au login | Mauvais mot de passe — créé un nouveau compte sur la version en ligne |
| Page blanche | F12 → Console → copie l'erreur, reviens me voir |
| `ECONNREFUSED` au seed local | Ton Docker Postgres n'est pas démarré : `docker start eatrail-pg` |

---

## 💸 Budget réel

| Service | Free tier | Quand tu paies |
|---|---|---|
| **Railway** | $5 de crédit gratuit/mois | Au-delà — pour ton MVP, ces $5 suffisent largement le 1er mois |
| **Postgres Railway** | Inclus dans le forfait | idem |
| **GitHub** | Repos privés gratuits | Jamais pour ce genre de projet |

**Total estimé** : **0 à 5$/mois** tant que tu testes (et même au-delà si trafic faible).

Si tu deviens viral et que Railway devient cher → on splittera frontend sur Vercel (gratuit jusqu'à 100GB bandwidth) à ce moment-là.

---

## 📞 Si tu coinces

Reviens avec :
1. **À quelle étape exacte** (ex: "étape 3.4")
2. **Le message d'erreur copié-collé** (pas un screen — du texte)
3. **Capture d'écran** si c'est visuel

Je débogue avec toi.
