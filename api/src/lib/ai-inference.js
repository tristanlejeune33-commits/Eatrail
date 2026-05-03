// AI-based ingredient × shop probability inference (Claude Opus 4.7).
// For shops where we have NO crowd data, we ask Claude:
// "Probability shop X carries ingredient Y given (shop type, name, location)?"
//
// Results cached 90 days in `inferred_availability` table.
//
// Optimizations:
// - Prompt caching on the system prompt (stable across all calls → 90% cheaper after warmup)
// - Structured outputs via JSON schema (guaranteed parse-able)
// - effort: 'low' (this is a classification task — Opus 4.7's extra thinking adds nothing here)
import { prisma } from '../db.js';
import { anthropic, isConfigured as anthropicConfigured, DEFAULT_MODEL } from './anthropic.js';

const TTL_DAYS = 90;
const MODEL_TAG = DEFAULT_MODEL;  // for traceability in DB rows

export function isConfigured() { return anthropicConfigured(); }

function expiresAt() {
  return new Date(Date.now() + TTL_DAYS * 24 * 60 * 60 * 1000);
}

// Stable system prompt — cached across requests.
const SYSTEM_PROMPT = `You are an expert in NYC ethnic groceries and specialty food shops.

Given a shop's profile (name, address, neighborhood, cuisine tags, categories), estimate the probability (0.0 to 1.0) that the shop carries each requested ingredient on a typical day.

Use these heuristics:
- Mainstream items at supermarkets: 0.95
- Common ingredients of the shop's cuisine specialty: 0.85-0.95
- Adjacent cuisines (e.g. Korean shop carrying Japanese basics): 0.5-0.7
- Rare specialty ingredients of OTHER cuisines: 0.05-0.2
- Unknown / unclear specialty match: 0.3

Respond with ONLY valid JSON matching the requested schema. No commentary, no markdown.`;

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    probabilities: {
      type: 'object',
      additionalProperties: { type: 'number', minimum: 0, maximum: 1 },
    },
  },
  required: ['probabilities'],
  additionalProperties: false,
};

/**
 * Infer probabilities for a list of ingredients at a single shop.
 * Skips ingredients already cached (and not expired).
 *
 * @param {object} shop  — { id, name, address, type, googleTypes, neighborhood, inferredCuisines, tags }
 * @param {string[]} ingredientKeys — normalized ingredient names (e.g. "tamarin", "yuzu")
 * @returns {object} { [ingKey]: probability 0-1 }
 */
export async function inferShopAvailability(shop, ingredientKeys) {
  if (!anthropicConfigured()) return {};
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

  // Build user prompt (volatile — not cached)
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

  const userPrompt = `Shop:\n${shopDesc}\n\nIngredients to evaluate:\n${missing.map(k => `- ${k}`).join('\n')}`;

  let response;
  try {
    response = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 1024,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      output_config: {
        format: {
          type: 'json_schema',
          schema: RESPONSE_SCHEMA,
          name: 'shop_ingredient_probabilities',
        },
        effort: 'low',  // simple classification — no need for high-effort reasoning
      },
      messages: [{ role: 'user', content: userPrompt }],
    });
  } catch (e) {
    console.warn('[ai-inference] Anthropic call failed:', e.message);
    return cached;
  }

  // Extract text from response (content is an array of typed blocks)
  const textBlock = (response.content || []).find(b => b.type === 'text');
  if (!textBlock) {
    console.warn('[ai-inference] no text block in response');
    return cached;
  }

  let parsed;
  try {
    parsed = JSON.parse(textBlock.text);
  } catch {
    console.warn('[ai-inference] JSON parse failed');
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
      inferredBy: MODEL_TAG,
      expiresAt: exp,
    });
  }

  if (inferences.length > 0) {
    await prisma.$transaction(
      inferences.map(inf =>
        prisma.inferredAvailability.upsert({
          where: { shopId_ingredientKey: { shopId: inf.shopId, ingredientKey: inf.ingredientKey } },
          create: inf,
          update: {
            probability: inf.probability,
            inferredBy: inf.inferredBy,
            expiresAt: inf.expiresAt,
            createdAt: new Date(),
          },
        })
      )
    ).catch(e => console.warn('[ai-inference] save failed:', e.message));
  }

  return cached;
}

// Batch helper: infer for multiple shops in parallel (cap concurrency to be polite to the API)
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
