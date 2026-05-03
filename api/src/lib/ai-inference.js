// AI-based ingredient × shop probability inference.
// For shops where we have NO crowd data, we ask GPT-4o-mini:
// "Probability shop X carries ingredient Y given (shop type, name, location)?"
//
// Results cached 90 days in `inferred_availability` table.
import { prisma } from '../db.js';

const KEY = process.env.OPENAI_API_KEY;
const MODEL = 'gpt-4o-mini';
const TTL_DAYS = 90;

export function isConfigured() { return !!KEY; }

function expiresAt() {
  return new Date(Date.now() + TTL_DAYS * 24 * 60 * 60 * 1000);
}

/**
 * Infer probabilities for a list of ingredients at a single shop.
 * Skips ingredients already cached (and not expired).
 *
 * @param {object} shop  — { id, name, address, type, googleTypes, neighborhood, inferredCuisines, tags }
 * @param {string[]} ingredientKeys — normalized ingredient names (e.g. "tamarin", "yuzu")
 * @returns {object} { [ingKey]: probability 0-1 }
 */
export async function inferShopAvailability(shop, ingredientKeys) {
  if (!KEY) return {};
  if (!ingredientKeys || ingredientKeys.length === 0) return {};

  const keys = [...new Set(ingredientKeys.map(k => k.toLowerCase()))];

  // Check cache first
  const existing = await prisma.inferredAvailability.findMany({
    where: {
      shopId: shop.id,
      ingredientKey: { in: keys },
      expiresAt: { gt: new Date() },
    },
  });
  const cached = Object.fromEntries(existing.map(e => [e.ingredientKey, e.probability]));
  const missing = keys.filter(k => !(k in cached));

  if (missing.length === 0) return cached;

  // Build prompt
  const tags = (shop.tags || []).map(t => t.tag || t);
  const cuisines = shop.inferredCuisines || [];
  const types = shop.googleTypes || (shop.type ? [shop.type] : []);
  const shopDesc = [
    `Name: "${shop.name}"`,
    shop.address ? `Address: ${shop.address}` : null,
    shop.neighborhood ? `Neighborhood: ${shop.neighborhood}` : null,
    types.length ? `Categories: ${types.join(', ')}` : null,
    tags.length ? `Cuisine tags: ${tags.join(', ')}` : null,
    cuisines.length ? `Inferred cuisines: ${cuisines.join(', ')}` : null,
    shop.description ? `Description: ${shop.description.slice(0, 200)}` : null,
  ].filter(Boolean).join('\n');

  const prompt = `You are an expert in NYC ethnic groceries and specialty food shops.

Given this shop:
${shopDesc}

For EACH of the following ingredients, estimate the probability (0.0 to 1.0) that this shop carries it on a typical day. Use these heuristics:
- Mainstream items at supermarkets: 0.95
- Common ingredients of the shop's cuisine specialty: 0.85-0.95
- Adjacent cuisines (e.g. Korean shop carrying Japanese basics): 0.5-0.7
- Rare specialty ingredients of OTHER cuisines: 0.05-0.2
- Unknown / unclear specialty match: 0.3

Ingredients:
${missing.map(k => `- ${k}`).join('\n')}

Respond with JSON only, no commentary, in this exact format:
{"probabilities": {"ingredient_name": 0.85, ...}}`;

  let res;
  try {
    res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + KEY },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        max_tokens: 800,
      }),
    });
  } catch (e) {
    console.warn('[ai-inference] network error:', e.message);
    return cached;
  }

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    console.warn(`[ai-inference] HTTP ${res.status} ${txt.slice(0, 200)}`);
    return cached;
  }

  let parsed;
  try {
    const json = await res.json();
    parsed = JSON.parse(json.choices?.[0]?.message?.content || '{}');
  } catch {
    return cached;
  }

  const probs = parsed.probabilities || {};
  const exp = expiresAt();
  const inferences = [];
  for (const k of missing) {
    const raw = probs[k];
    if (typeof raw !== 'number') continue;
    const clamped = Math.max(0, Math.min(1, raw));
    cached[k] = clamped;
    inferences.push({
      shopId: shop.id,
      ingredientKey: k,
      probability: clamped,
      inferredBy: MODEL,
      expiresAt: exp,
    });
  }

  if (inferences.length > 0) {
    await prisma.$transaction(
      inferences.map(inf =>
        prisma.inferredAvailability.upsert({
          where: { shopId_ingredientKey: { shopId: inf.shopId, ingredientKey: inf.ingredientKey } },
          create: inf,
          update: { probability: inf.probability, inferredBy: inf.inferredBy, expiresAt: inf.expiresAt, createdAt: new Date() },
        })
      )
    ).catch(e => console.warn('[ai-inference] save failed:', e.message));
  }

  return cached;
}

// Batch helper: infer for multiple shops in parallel (cap concurrency to be polite to OpenAI)
export async function inferManyShops(shops, ingredientKeys, { concurrency = 3 } = {}) {
  const out = {};
  let i = 0;
  async function worker() {
    while (i < shops.length) {
      const idx = i++;
      const shop = shops[idx];
      const probs = await inferShopAvailability(shop, ingredientKeys);
      out[shop.id] = probs;
    }
  }
  await Promise.all(Array(concurrency).fill(0).map(worker));
  return out;
}
