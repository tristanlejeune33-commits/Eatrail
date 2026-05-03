// /api/geo — geolocation-aware shop discovery + ingredient matching
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth } from '../auth/middleware.js';
import { validate, sendValidationError } from '../lib/zod-helpers.js';
import { discoverNearbyShops, isConfigured as gpConfigured, haversineMiles } from '../lib/google-places.js';
import { scoreShopsForIngredients, greedyTrail } from '../lib/shop-matching.js';
import { inferManyShops, isConfigured as aiConfigured } from '../lib/ai-inference.js';

const router = Router();

// ─── GET /api/geo/status ──────────────────────────────────
// Tells the client what features are available
router.get('/status', (_req, res) => {
  res.json({
    googlePlaces: gpConfigured(),
    aiInference: aiConfigured(),
    // Mapbox token is safe to expose to client (it's the public/anon key)
    mapboxToken: process.env.MAPBOX_TOKEN || null,
  });
});

// ─── GET /api/geo/shops/nearby ────────────────────────────
// Find shops near (lat,lng), score them against given ingredients (optional).
//
// Query:
//   lat, lng         (required)
//   radius           (optional, miles, default 1.5)
//   limit            (optional, default 20)
//   recipeId         (optional) — fetch ingredients from DB
//   ingredients      (optional) — comma-separated names, e.g. "tamarin,gochujang"
//   useAi            (optional, default 1) — 0 to disable AI inference
const nearbySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().min(0.1).max(20).default(1.5),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  recipeId: z.string().max(80).optional(),
  ingredients: z.string().max(2000).optional(),
  useAi: z.coerce.boolean().default(true),
});

router.get('/shops/nearby', async (req, res) => {
  const { data, error } = validate(nearbySchema, req.query);
  if (error) return sendValidationError(res, error);

  // ── Resolve target ingredients ──────────────────────────
  let ingredients = [];
  if (data.recipeId) {
    const recipe = await prisma.recipe.findUnique({
      where: { id: data.recipeId },
      include: { ingredients: { orderBy: { position: 'asc' } } },
    });
    if (!recipe) return res.status(404).json({ error: 'recipe_not_found' });
    ingredients = recipe.ingredients.map(i => ({
      key: i.name.split(/[+,]/)[0].trim().toLowerCase(),
      name: i.name,
      tags: i.tags,
      isRare: i.isRare,
    }));
  } else if (data.ingredients) {
    ingredients = data.ingredients.split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean)
      .map(name => ({ key: name, name, tags: [], isRare: false }));
  }

  // ── Discover shops (cache + Google if configured) ──────
  const shops = await discoverNearbyShops({
    lat: data.lat,
    lng: data.lng,
    radiusMiles: data.radius,
    limit: data.limit,
  });

  if (shops.length === 0) {
    return res.json({
      shops: [],
      ingredients: ingredients.map(i => i.key),
      meta: {
        googlePlaces: gpConfigured(),
        aiInference: aiConfigured() && data.useAi,
        radius: data.radius,
        center: { lat: data.lat, lng: data.lng },
      },
    });
  }

  // ── If we have ingredients, run scoring ────────────────
  let scored = shops;
  let trail = null;

  if (ingredients.length > 0) {
    const ingKeys = ingredients.map(i => i.key);

    // Trigger AI inference (lazy/cached) if available + requested
    if (data.useAi && aiConfigured()) {
      // Cap to top-10 nearest shops to control cost
      const topShops = shops.slice(0, 10);
      await inferManyShops(topShops, ingKeys, { concurrency: 3 }).catch(() => {});
    }

    scored = await scoreShopsForIngredients({ shops, ingredients });
    trail = greedyTrail({ scoredShops: scored, ingredients, minScore: 0.55, maxShops: 4 });
  }

  return res.json({
    shops: scored.map(serializeShop),
    ingredients: ingredients.map(i => i.key),
    trail,
    meta: {
      googlePlaces: gpConfigured(),
      aiInference: aiConfigured() && data.useAi,
      radius: data.radius,
      center: { lat: data.lat, lng: data.lng },
      totalFound: scored.length,
    },
  });
});

function serializeShop(s) {
  return {
    id: s.id,
    name: s.name,
    address: s.address,
    neighborhood: s.neighborhood,
    lat: s.lat,
    lng: s.lng,
    type: s.type,
    hours: s.hours,
    phone: s.phone,
    website: s.website,
    description: s.description,
    imageUrl: s.imageUrl,
    gradient: s.gradient,
    authScore: s.authScore,
    priceLevel: s.priceLevel,
    source: s.source,
    rating: s.rating,
    ratingCount: s.ratingCount,
    googlePlaceId: s.googlePlaceId,
    tags: (s.tags || []).map(t => t.tag || t),
    distMiles: s.distMiles ? Number(s.distMiles.toFixed(2)) : null,
    walkMin: s.distMiles ? Math.round(s.distMiles * 20) : null,  // ~20 min/mile walking
    coverageScore: s.coverageScore != null ? Number(s.coverageScore.toFixed(3)) : null,
    ingredientScores: s.ingredientScores || null,
    covering: s.covering || null,
  };
}

// ─── POST /api/geo/shops/:id/check ────────────────────────
// User crowdsource: "I found {ingredient} at this shop" / "Not in stock"
const checkSchema = z.object({
  ingredientKey: z.string().min(1).max(120),
  found: z.boolean(),
  note: z.string().max(500).optional().nullable(),
});

router.post('/shops/:id/check', requireAuth, async (req, res) => {
  const { data, error } = validate(checkSchema, req.body);
  if (error) return sendValidationError(res, error);

  const shop = await prisma.shop.findUnique({ where: { id: req.params.id }, select: { id: true } });
  if (!shop) return res.status(404).json({ error: 'shop_not_found' });

  const check = await prisma.ingredientCheck.create({
    data: {
      shopId: shop.id,
      userId: req.user.id,
      ingredientKey: data.ingredientKey.trim().toLowerCase(),
      found: data.found,
      note: data.note ?? null,
    },
  });
  return res.status(201).json({ check });
});

// ─── GET /api/geo/shops/:id/checks ────────────────────────
// Recent crowdsourced checks for a shop (public)
router.get('/shops/:id/checks', async (req, res) => {
  const checks = await prisma.ingredientCheck.findMany({
    where: { shopId: req.params.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { user: { select: { name: true, avatarColor: true } } },
  });
  return res.json({
    checks: checks.map(c => ({
      ingredientKey: c.ingredientKey,
      found: c.found,
      note: c.note,
      createdAt: c.createdAt,
      author: c.user,
    })),
  });
});

export default router;
