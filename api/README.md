# eatrail API

Express + Prisma + Postgres backend for the eatrail SPA.
Sessions are cookie-based (httpOnly), passwords are bcrypt-hashed (10 rounds default).

## 1. Local setup

```bash
cd api
npm install                       # also runs `prisma generate` via postinstall
cp .env.example .env              # then fill in DATABASE_URL + SESSION_SECRET + IP_HASH_SALT
```

Generate strong secrets:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## 2. Postgres (local OR Railway)

### Option A — Railway (recommended for prod)

1. Create a new project on [railway.app](https://railway.app), add a **Postgres** plugin.
2. Click the Postgres service → "Connect" → copy the `DATABASE_URL`.
3. Paste it into `api/.env` (or use a Railway environment variable when deploying).

### Option B — Local Postgres (Docker)

```bash
docker run -d --name eatrail-pg -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=eatrail \
  postgres:16
# DATABASE_URL=postgresql://postgres:password@localhost:5432/eatrail?schema=public
```

## 3. Migrations + seed

```bash
# First-time: create schema + first migration
npx prisma migrate dev --name init

# Then seed: 625 recipes + 30 shops from web/app/data/*.js
npm run seed
```

After this you should see:
```
=== DB STATE ===
recipes: 625
shops:   30
users:   0
```

## 4. Run

```bash
npm run dev          # node --watch — auto-reload on file change
# or
npm start
```

API listens on `http://localhost:3001` by default.

## 5. Endpoints (overview)

### Auth
- `POST /api/auth/signup` `{ email, password, name, avatarColor? }` → sets cookie, returns `{ user }`
- `POST /api/auth/login`  `{ email, password }` → sets cookie, returns `{ user }`
- `POST /api/auth/logout` → clears cookie
- `GET  /api/auth/me` → `{ user | null }`
- `POST /api/auth/sessions/revoke-all` → log out everywhere (auth required)

### Recipes (public)
- `GET /api/recipes` query: `q, country, category, diet, mood, budget, maxDuration, page, perPage, sort`
- `GET /api/recipes/:id` → full recipe + ingredients + steps + stats

### Shops (public)
- `GET /api/shops` query: `q, tag, neighborhood, ingredient`
- `GET /api/shops/:id`

### Favorites (auth)
- `GET /api/favorites`
- `POST /api/favorites/:recipeId` → toggle, returns `{ saved: boolean }`
- `POST /api/favorites/import` `{ recipeIds: [...] }` — for localStorage migration

### Cart (auth)
- `GET /api/cart`
- `POST /api/cart` `{ ingredientName, qty?, unit?, recipeId?, shopId? }`
- `PATCH /api/cart/:id` `{ checked }`
- `DELETE /api/cart/:id`
- `DELETE /api/cart` — empty cart
- `POST /api/cart/import` `{ items: [...] }`

### Pantry (auth)
- `GET /api/pantry`
- `POST /api/pantry` `{ name, source? }`
- `DELETE /api/pantry/by-name` `{ name }`
- `DELETE /api/pantry` — clear all
- `POST /api/pantry/import` `{ names: [...] }`
- `POST /api/pantry/scan` (multipart `photo`) — proxy to OpenAI Vision, auto-adds detected items

### Reviews
- `GET /api/reviews/recipe/:recipeId` → list + aggregate (public)
- `POST /api/reviews/recipe/:recipeId` `{ rating, comment? }` — upsert (auth)
- `DELETE /api/reviews/recipe/:recipeId` (auth)

### Preferences (auth)
- `GET /api/prefs`
- `PUT /api/prefs` `{ cuisines?, allergens?, dietary?, budgetPerPerson?, ... }`

## 6. Deploy on Railway

1. Push `api/` to a GitHub repo (or the same monorepo at `api/` subfolder).
2. On Railway, **New Project → Deploy from GitHub** → pick the repo + `api/` root path.
3. Add env vars in Railway: `DATABASE_URL` (auto-linked from Postgres plugin), `SESSION_SECRET`, `IP_HASH_SALT`, `ALLOWED_ORIGINS`, `OPENAI_API_KEY`, `NODE_ENV=production`.
4. Set the start command to: `npx prisma migrate deploy && node src/index.js`
5. Open the generated `*.up.railway.app` URL — `/health` should return `{ status: 'ok', db: 'up' }`.

## 7. Useful Prisma commands

```bash
npx prisma studio              # GUI to inspect data
npx prisma migrate dev --name <something>   # create new migration after schema edits
npx prisma migrate deploy      # apply migrations in prod
npx prisma generate            # regenerate client after schema changes
```

## 8. Testing manually

```bash
# Signup
curl -i -X POST http://localhost:3001/api/auth/signup \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"hunter2pass","name":"Test"}' \
  -c cookies.txt

# Me
curl -b cookies.txt http://localhost:3001/api/auth/me

# Recipes (public)
curl 'http://localhost:3001/api/recipes?country=Italie&perPage=5'

# Toggle favorite
curl -b cookies.txt -X POST http://localhost:3001/api/favorites/carbonara

# Logout
curl -b cookies.txt -X POST http://localhost:3001/api/auth/logout
```

## Architecture notes

- **Sessions over JWT**: simple to revoke, debug, audit. Token is opaque (48 random bytes), stored in `sessions` table.
- **Bcrypt** rounds=10 (≈100ms/hash) — adjust via `BCRYPT_ROUNDS` if hardware permits.
- **CORS** with `credentials: true` — the SPA must `fetch(..., { credentials: 'include' })`.
- **OpenAI Vision proxy** for pantry scan — keeps the API key server-side (not in localStorage).
- **AuthEvent** table logs login attempts — useful for ratelimit tuning + security review.
