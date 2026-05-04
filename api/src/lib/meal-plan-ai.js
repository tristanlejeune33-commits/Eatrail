// AI weekly meal-plan generator (Claude Opus 4.7).
//
// Goal: given user preferences (cuisines, allergens, diet, budget, household size)
// and a curated candidate pool of recipes, ask Claude to pick 7 dinners that:
//   - respect allergies & dietary constraints (HARD constraints, never violate)
//   - lean toward preferred cuisines but introduce variety (no same cuisine 2 days in a row)
//   - average roughly within budget per person
//   - balance prep time across the week (1-2 ambitious days, the rest <40 min)
//
// We do server-side filtering FIRST to keep the prompt small (cost + latency).
// Claude only sees ~30-60 candidates, not 625.
//
// Returns: [{ dayOffset: 0-6, slot: 'DINNER', recipeId, rationale }] (length 7).
import { anthropic, isConfigured as anthropicConfigured, DEFAULT_MODEL } from './anthropic.js';

export function isConfigured() { return anthropicConfigured(); }

const SYSTEM_PROMPT = `You are a thoughtful home-cooking planner.

You are given a user's preferences and a curated pool of recipe candidates. Pick exactly 7 recipes — one DINNER per day for the week — that respect the user's preferences and feel like a balanced, exciting week of cooking.

Hard rules (never violate):
- The user's allergens MUST NOT appear in the chosen recipes (recipes carrying those allergens are filtered out before reaching you, but double-check by reading each recipe's "allergens" field).
- The user's dietary constraint (vegan / vegetarian / pescatarian / etc.) MUST be respected if non-empty.
- Each recipeId must come from the provided candidate list — never invent recipes.
- Each dayOffset (0..6) must be used exactly once.

Soft preferences (optimize for these):
- Variety: do not pick the same country/cuisine on two consecutive days.
- Budget: average per-person cost across the week should be close to the user's budgetPerPerson (within ±30%).
- Time balance: keep at least 4 days under 40 minutes prep+cook. The 1-2 longer recipes are fine on weekends (dayOffset 5 or 6 by convention if startDate is a Monday).
- Lean into the user's preferred cuisines without making 5/7 days the same one.
- Pick recipes the user is likely to enjoy given their flavor profile, not just safe defaults.

Respond with ONLY valid JSON matching the requested schema. No commentary, no markdown.
For "rationale", write ONE short sentence in French (max 80 chars) explaining why this recipe fits this slot.`;

// Anthropic's strict JSON mode requires `additionalProperties: false` to be
// explicitly set on every `type: 'object'` node. We keep the rest of the
// schema lean (no min/max/enum) and rely on the repair pass below for
// count/dedup/invalid-recipeId tolerance.
const RESPONSE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    selections: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          dayOffset: { type: 'integer' },
          slot: { type: 'string' },
          recipeId: { type: 'string' },
          rationale: { type: 'string' },
        },
        required: ['dayOffset', 'recipeId'],
      },
    },
  },
  required: ['selections'],
};

/**
 * Filter the recipe pool down to ~30-60 candidates that respect HARD constraints.
 * The smaller pool keeps the Claude prompt cheap and fast.
 *
 * @param {Array} recipes — full Recipe rows (with included relations: allergens, diet, mood)
 * @param {object} prefs  — { cuisines, allergens, dietary, budgetPerPerson }
 */
export function filterCandidates(recipes, prefs) {
  const userAllergens = new Set((prefs.allergens || []).map(a => a.toLowerCase()));
  const userDietary = new Set((prefs.dietary || []).map(d => d.toLowerCase()));
  const userCuisines = new Set((prefs.cuisines || []).map(c => c.toLowerCase()));
  const targetBudget = prefs.budgetPerPerson;

  // 1) Eliminate recipes carrying any user allergen
  let pool = recipes.filter(r => {
    const recipeAllergens = (r.allergens || []).map(a => (a.allergen || a).toLowerCase());
    return !recipeAllergens.some(a => userAllergens.has(a));
  });

  // 2) Eliminate recipes that don't match the dietary constraint
  if (userDietary.size > 0) {
    pool = pool.filter(r => {
      const recipeDiets = (r.diets || []).map(d => (d.diet || d).toLowerCase());
      // Match if recipe explicitly has the diet OR if user picked 'omnivore' (accepts all)
      if (userDietary.has('omnivore') || userDietary.has('omnivorous')) return true;
      return recipeDiets.some(d => userDietary.has(d));
    });
  }

  // 3) Soft-prefer cuisines: rank by 'is this a preferred cuisine'
  pool = pool.map(r => {
    const country = (r.country || '').toLowerCase();
    const region = (r.region || '').toLowerCase();
    const cuisineMatch = userCuisines.size === 0
      || userCuisines.has(country)
      || userCuisines.has(region);
    return { ...r, _cuisineMatch: cuisineMatch ? 1 : 0 };
  });

  // 4) Cap to ~50: prioritize preferred cuisines, then random sample of others
  const matchPool = pool.filter(r => r._cuisineMatch === 1);
  const otherPool = pool.filter(r => r._cuisineMatch === 0);
  shuffle(matchPool);
  shuffle(otherPool);
  const TOP = 30;
  const REST = 20;
  const candidates = [...matchPool.slice(0, TOP), ...otherPool.slice(0, REST)];

  return candidates;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/**
 * Ask Claude to pick 7 dinners from the candidate pool.
 *
 * @param {object} prefs       — user's preferences
 * @param {Array}  candidates  — pre-filtered recipes (output of filterCandidates)
 * @param {string} startDate   — 'YYYY-MM-DD' (used only for context in the prompt)
 * @returns {Promise<Array>}   — [{ dayOffset, slot, recipeId, rationale }] of length 7
 */
export async function generateWeeklyPlan(prefs, candidates, startDate) {
  if (!anthropicConfigured()) {
    throw new Error('anthropic_not_configured');
  }
  if (candidates.length < 7) {
    throw new Error('not_enough_candidates');
  }

  const candidateList = candidates.map(r => ({
    id: r.id,
    title: r.title,
    country: r.country,
    region: r.region,
    durationMin: r.durationMin,
    budgetPerPerson: r.budgetPerPerson,
    summary: r.summary ? r.summary.slice(0, 150) : '',
    allergens: (r.allergens || []).map(a => a.allergen || a),
    diets: (r.diets || []).map(d => d.diet || d),
    moods: (r.moods || []).map(m => m.mood || m),
  }));

  const userPrompt = `User preferences:
- preferred cuisines: ${(prefs.cuisines || []).join(', ') || '(none specified)'}
- allergens to avoid: ${(prefs.allergens || []).join(', ') || '(none)'}
- dietary: ${(prefs.dietary || []).join(', ') || 'omnivore'}
- budget per person per meal: ${prefs.budgetPerPerson != null ? '$' + prefs.budgetPerPerson : '(no constraint)'}
- household size: ${prefs.householdSize || 2}
- planning week starting: ${startDate}

Candidate recipes (${candidateList.length}):
${JSON.stringify(candidateList, null, 0)}

Pick exactly 7 dinners — one per dayOffset 0 through 6 — that respect hard rules and optimize the soft preferences. Return ONLY the JSON object matching the schema.`;

  console.log(`[meal-plan-ai] generating week starting ${startDate} from ${candidates.length} candidates`);

  let response;
  try {
    response = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 4096,
      system: [
        { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
      ],
      output_config: {
        format: { type: 'json_schema', schema: RESPONSE_SCHEMA },
        effort: 'medium',
      },
      messages: [{ role: 'user', content: userPrompt }],
    });
  } catch (e) {
    console.error('[meal-plan-ai] Anthropic call failed:',
      'status=', e.status, 'name=', e.name,
      'message=', (e.message || '').slice(0, 400));
    throw new Error('anthropic_call_failed: ' + (e.message || '').slice(0, 200));
  }

  // With output_config.format, the SDK puts the parsed JSON in `parsed_output`.
  // Fall back to a raw text block (legacy / models that don't pre-parse).
  let parsed = null;
  if (response.parsed_output && typeof response.parsed_output === 'object') {
    parsed = response.parsed_output;
  } else {
    const textBlock = (response.content || []).find(b => b.type === 'text');
    if (textBlock && textBlock.text) {
      try { parsed = JSON.parse(textBlock.text); } catch {}
    }
  }
  if (!parsed) {
    console.error('[meal-plan-ai] no parseable response. blocks:',
      (response.content || []).map(b => b.type).join(','),
      'parsed_output:', !!response.parsed_output,
      'stop_reason:', response.stop_reason);
    throw new Error('no_response');
  }

  let selections = parsed.selections || [];
  console.log(`[meal-plan-ai] received ${selections.length} selections from Claude`);

  // Repair pass: be tolerant of common Claude mistakes instead of failing the
  // whole request. The user clicked one button — they want a week back.
  const validIds = new Set(candidates.map(c => c.id));

  // 1) Drop selections with invalid/missing recipeIds and log which ones
  const invalidIds = [];
  selections = selections.filter(s => {
    if (!s || typeof s.recipeId !== 'string' || !validIds.has(s.recipeId)) {
      invalidIds.push(s?.recipeId);
      return false;
    }
    return true;
  });
  if (invalidIds.length) {
    console.warn(`[meal-plan-ai] dropped ${invalidIds.length} invalid recipeIds:`, invalidIds.slice(0, 5));
  }

  // 2) Dedup by dayOffset (keep first), then by recipeId (avoid same recipe twice)
  const seenDays = new Set();
  const seenRecipes = new Set();
  selections = selections.filter(s => {
    if (typeof s.dayOffset !== 'number' || s.dayOffset < 0 || s.dayOffset > 6) return false;
    if (seenDays.has(s.dayOffset)) return false;
    if (seenRecipes.has(s.recipeId)) return false;
    seenDays.add(s.dayOffset);
    seenRecipes.add(s.recipeId);
    return true;
  });

  // 3) Fill missing days with random unused candidates so we always return 7
  if (selections.length < 7) {
    const usedRecipes = new Set(selections.map(s => s.recipeId));
    const pool = candidates.filter(c => !usedRecipes.has(c.id));
    // Shuffle to avoid always picking the same fillers
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    let pi = 0;
    for (let day = 0; day <= 6; day++) {
      if (seenDays.has(day)) continue;
      if (pi >= pool.length) break;
      const c = pool[pi++];
      selections.push({
        dayOffset: day,
        slot: 'DINNER',
        recipeId: c.id,
        rationale: '✨ Suggestion équilibrée',
      });
      seenDays.add(day);
    }
  }

  if (selections.length !== 7) {
    console.error(`[meal-plan-ai] could not assemble 7 dinners; got ${selections.length}, candidates=${candidates.length}`);
    throw new Error('could_not_assemble_week');
  }

  selections.sort((a, b) => a.dayOffset - b.dayOffset);
  console.log(`[meal-plan-ai] returning ${selections.length} dinners (${invalidIds.length} repaired)`);
  return selections;
}
