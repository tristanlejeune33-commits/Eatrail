// Multi-layer shop ↔ ingredient matching.
// Combines 3 signals into a final probability score (0..1):
//
//   1. Heuristic (immediate, free): tag overlap (shop.tags ∩ ingredient.tags)
//   2. Crowdsourced (database): recent IngredientCheck.found events
//   3. AI inference (cached): InferredAvailability.probability
//
// Weights per layer can be tuned. Returns per-ingredient scores + overall coverage.
import { prisma } from '../db.js';

// ─── Tag → cuisine keyword map (for heuristic) ────────────
// Maps recipe-side tags (set in data/recipes/*.js) to shop cuisine tags.
const TAG_ALIASES = {
  asian: ['asian','japanese','korean','chinese','se-asian','thai','vietnamese'],
  'se-asian': ['se-asian','thai','vietnamese','indonesian','filipino','asian'],
  korean: ['korean','asian'],
  japanese: ['japanese','asian'],
  chinese: ['chinese','asian'],
  thai: ['thai','se-asian'],
  vietnamese: ['vietnamese','se-asian'],
  'south-asian': ['south-asian','indian','asian'],
  indian: ['indian','south-asian'],
  'middle-east': ['middle-east','lebanese','turkish','persian'],
  lebanese: ['lebanese','middle-east'],
  turkish: ['turkish','middle-east'],
  african: ['african','ethiopian','moroccan'],
  ethiopian: ['ethiopian','african'],
  moroccan: ['moroccan','african','middle-east'],
  caribbean: ['caribbean','latin'],
  latin: ['latin','mexican','peruvian','brazilian','caribbean'],
  mexican: ['mexican','latin'],
  european: ['european','italian','french','spanish','greek','german','british','russian','polish'],
  italian: ['italian','european'],
  french: ['french','european'],
  butcher: ['butcher','meat'],
  fish: ['fish','seafood'],
  produce: ['produce','farmers'],
  pantry: ['pantry','supermarket'],
  spice: ['spice','specialty','middle-east','asian'],
};

function expandTags(tags) {
  const out = new Set();
  for (const t of tags || []) {
    out.add(t);
    for (const alias of TAG_ALIASES[t] || []) out.add(alias);
  }
  return [...out];
}

// ─── 1. Heuristic score ───────────────────────────────────
// shop has at least one tag matching the ingredient's tags → 0.5
// shop has multiple matches → up to 0.7
// shop is "supermarket" tag and ingredient is "pantry" → 0.6 (general grocery probably has it)
export function heuristicScore(ingredient, shopTags) {
  const ingTags = expandTags(ingredient.tags || []);
  if (ingTags.length === 0) return 0.4;  // unknown — neutral
  const overlap = ingTags.filter(t => shopTags.includes(t)).length;
  if (overlap === 0) return 0.1;
  if (overlap === 1) return 0.5;
  if (overlap === 2) return 0.65;
  return 0.75;
}

// ─── 2. Crowdsourced score ────────────────────────────────
// Returns score in [0,1] OR null if no data
//
// Most recent N checks (max 50, last 90 days) — exponential decay by age.
async function recentChecks(shopId, ingredientKey) {
  const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  return prisma.ingredientCheck.findMany({
    where: { shopId, ingredientKey: ingredientKey.toLowerCase(), createdAt: { gte: since } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}

export async function crowdScore(shopId, ingredientKey) {
  const checks = await recentChecks(shopId, ingredientKey);
  if (checks.length === 0) return null;

  // Weighted vote: more recent = more weight
  let weightSum = 0, foundWeight = 0;
  const now = Date.now();
  for (const c of checks) {
    const ageDays = (now - new Date(c.createdAt).getTime()) / 86400000;
    const w = Math.exp(-ageDays / 30);  // half-life ~21 days
    weightSum += w;
    if (c.found) foundWeight += w;
  }
  if (weightSum === 0) return null;
  return foundWeight / weightSum;
}

// ─── 3. AI inference score (lazy cache) ───────────────────
export async function aiScore(shopId, ingredientKey) {
  const row = await prisma.inferredAvailability.findUnique({
    where: { shopId_ingredientKey: { shopId, ingredientKey: ingredientKey.toLowerCase() } },
  });
  if (!row || row.expiresAt < new Date()) return null;
  return row.probability;
}

// ─── Combiner ─────────────────────────────────────────────
// Weighting :
//   - crowd if available (it's truth from real users) → 60% weight
//   - ai if available → 25% weight (or 60% if no crowd)
//   - heuristic always → 15% (or higher if nothing else)
export async function ingredientShopScore({ ingredient, shop }) {
  const ingKey = (ingredient.key || ingredient.name || '').toLowerCase();
  const shopTags = (shop.tags || []).map(t => t.tag || t);
  const heur = heuristicScore(ingredient, shopTags);
  const [crowd, ai] = await Promise.all([
    crowdScore(shop.id, ingKey),
    aiScore(shop.id, ingKey),
  ]);

  // Adaptive weights based on which signals exist
  const have = { heur: true, crowd: crowd !== null, ai: ai !== null };
  let total = 0, weight = 0;
  if (have.crowd) { total += crowd * 0.60; weight += 0.60; }
  if (have.ai)    { total += ai * (have.crowd ? 0.25 : 0.60); weight += have.crowd ? 0.25 : 0.60; }
  total += heur * (have.crowd || have.ai ? 0.15 : 1.0);
  weight += (have.crowd || have.ai ? 0.15 : 1.0);

  const score = total / weight;
  return {
    score: Math.max(0, Math.min(1, score)),
    sources: {
      heuristic: heur,
      crowd,
      ai,
    },
  };
}

// ─── Score a list of shops against a list of ingredients ─
// Returns shops with .ingredientScores (per ingredient) and .coverageScore (avg)
export async function scoreShopsForIngredients({ shops, ingredients }) {
  const out = [];
  for (const shop of shops) {
    const perIng = {};
    for (const ing of ingredients) {
      const ingKey = (ing.key || ing.name || '').toLowerCase();
      const r = await ingredientShopScore({ ingredient: ing, shop });
      perIng[ingKey] = r;
    }
    const scores = Object.values(perIng).map(p => p.score);
    const avg = scores.reduce((a, b) => a + b, 0) / (scores.length || 1);
    out.push({
      ...shop,
      ingredientScores: perIng,
      coverageScore: avg,
    });
  }
  return out.sort((a, b) => b.coverageScore - a.coverageScore);
}

// ─── Greedy trail builder (set cover) ─────────────────────
// Picks the minimum number of shops to cover all ingredients (or as many as possible).
// Each shop must score above `minScore` for an ingredient to "count" as covered.
export function greedyTrail({ scoredShops, ingredients, minScore = 0.55, maxShops = 4 }) {
  const remaining = new Set(ingredients.map(i => (i.key || i.name).toLowerCase()));
  const trail = [];
  const shops = [...scoredShops];

  while (remaining.size > 0 && trail.length < maxShops && shops.length > 0) {
    // Pick the shop that covers the most remaining ingredients
    let best = null, bestCovered = [];
    for (const shop of shops) {
      const covered = [];
      for (const ingKey of remaining) {
        const sc = shop.ingredientScores[ingKey]?.score ?? 0;
        if (sc >= minScore) covered.push(ingKey);
      }
      if (covered.length > bestCovered.length) {
        best = shop; bestCovered = covered;
      }
    }
    if (!best || bestCovered.length === 0) break;
    trail.push({ ...best, covering: bestCovered });
    bestCovered.forEach(k => remaining.delete(k));
    const idx = shops.indexOf(best);
    shops.splice(idx, 1);
  }
  return {
    stops: trail,
    coveredCount: ingredients.length - remaining.size,
    totalCount: ingredients.length,
    missing: [...remaining],
  };
}
