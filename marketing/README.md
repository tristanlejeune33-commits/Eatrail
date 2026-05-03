# marketing/

Pages d'accueil **marketing** d'eatrail (le site vitrine, séparé de l'app).

⚠️ **Ces pages ne sont PAS déployées par défaut sur Railway.**
Le serveur Express ne sert que `web/app/` (la SPA).

## Fichiers

- `index.html` — landing page **theme terracotta** (orange chaleureux, ton "investor / press")
- `index-green.html` — landing page **theme vert** (cohérent avec l'app)

## Pour les déployer (plus tard)

Quand tu voudras un vrai site marketing à `eatrail.com` (séparé de `app.eatrail.com`) :

### Option 1 — Vercel (gratuit)
1. Crée un nouveau projet Vercel
2. Connecte le même repo GitHub
3. **Root Directory** → `marketing`
4. Framework preset → `Other`
5. Build / Output → laisse vide
6. Deploy → tu obtiens `eatrail-marketing.vercel.app`
7. Configure ton domaine custom `eatrail.com` dans les settings Vercel

### Option 2 — Cloudflare Pages (gratuit)
Identique à Vercel, intégration GitHub directe.

### Option 3 — Servi par Railway aussi
Modifier `api/src/index.js` pour servir `marketing/` sous un sous-path comme `/landing/*`.
Pas recommandé : moins clean qu'un domaine dédié.

## Ce que tu choisis

Recommandé : Vercel pour le marketing (CDN edge, ultra rapide), Railway pour l'app (Postgres + API).
