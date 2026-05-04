// /api/meal-plan — meal calendar (CRUD + aggregated weekly shopping list + AI weekly generator)
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth } from '../auth/middleware.js';
import { validate, sendValidationError } from '../lib/zod-helpers.js';
import { filterCandidates, generateWeeklyPlan, isConfigured as aiConfigured } from '../lib/meal-plan-ai.js';

const router = Router();
router.use(requireAuth);

const SLOTS = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];
const STATUSES = ['PLANNED', 'COOKED', 'SKIPPED'];

// ─── GET /api/meal-plan?from=YYYY-MM-DD&to=YYYY-MM-DD ─────
const listSchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(STATUSES).optional(),
});

router.get('/', async (req, res) => {
  const { data, error } = validate(listSchema, req.query);
  if (error) return sendValidationError(res, error);

  const where = {
    userId: req.user.id,
    date: { gte: new Date(data.from), lte: new Date(data.to) },
  };
  if (data.status) where.status = data.status;

  const plans = await prisma.mealPlan.findMany({
    where,
    orderBy: [{ date: 'asc' }, { slot: 'asc' }, { position: 'asc' }],
    include: {
      recipe: {
        select: {
          id: true, title: true, country: true, region: true, flag: true,
          authScore: true, durationMin: true, servings: true,
          budgetPerPerson: true, budgetLevel: true, gradient: true,
          summary: true, imageUrl: true,
        },
      },
    },
  });

  return res.json({ items: plans });
});

// ─── POST /api/meal-plan ──────────────────────────────────
const createSchema = z.object({
  recipeId: z.string().min(1).max(80),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slot: z.enum(SLOTS).default('DINNER'),
  servings: z.number().int().min(1).max(50).default(2),
  notes: z.string().max(500).optional().nullable(),
  position: z.number().int().min(0).max(20).optional(),
});

router.post('/', async (req, res) => {
  const { data, error } = validate(createSchema, req.body);
  if (error) return sendValidationError(res, error);

  const recipe = await prisma.recipe.findUnique({ where: { id: data.recipeId }, select: { id: true } });
  if (!recipe) return res.status(404).json({ error: 'recipe_not_found' });

  // Compute next position in slot if not provided
  let position = data.position;
  if (position === undefined) {
    const last = await prisma.mealPlan.findFirst({
      where: { userId: req.user.id, date: new Date(data.date), slot: data.slot },
      orderBy: { position: 'desc' },
      select: { position: true },
    });
    position = (last?.position ?? -1) + 1;
  }

  const plan = await prisma.mealPlan.create({
    data: {
      userId: req.user.id,
      recipeId: data.recipeId,
      date: new Date(data.date),
      slot: data.slot,
      servings: data.servings,
      notes: data.notes ?? null,
      position,
    },
    include: { recipe: true },
  });

  return res.status(201).json({ plan });
});

// ─── PATCH /api/meal-plan/:id ─────────────────────────────
const updateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  slot: z.enum(SLOTS).optional(),
  servings: z.number().int().min(1).max(50).optional(),
  notes: z.string().max(500).nullable().optional(),
  status: z.enum(STATUSES).optional(),
  position: z.number().int().min(0).max(20).optional(),
});

router.patch('/:id', async (req, res) => {
  const { data, error } = validate(updateSchema, req.body);
  if (error) return sendValidationError(res, error);

  const existing = await prisma.mealPlan.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.userId !== req.user.id) return res.status(404).json({ error: 'not_found' });

  const updateData = { ...data };
  if (updateData.date) updateData.date = new Date(updateData.date);

  const plan = await prisma.mealPlan.update({
    where: { id: req.params.id },
    data: updateData,
    include: { recipe: true },
  });

  return res.json({ plan });
});

// ─── DELETE /api/meal-plan/:id ────────────────────────────
router.delete('/:id', async (req, res) => {
  const existing = await prisma.mealPlan.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.userId !== req.user.id) return res.status(404).json({ error: 'not_found' });
  await prisma.mealPlan.delete({ where: { id: req.params.id } });
  return res.json({ ok: true });
});

// ─── GET /api/meal-plan/shopping-list?from&to ─────────────
// Aggregates ingredients across all PLANNED meals in date range.
// Returns one entry per (normalized name, unit) with summed quantities.
router.get('/shopping-list', async (req, res) => {
  const { data, error } = validate(listSchema.extend({ status: z.enum(STATUSES).default('PLANNED') }), req.query);
  if (error) return sendValidationError(res, error);

  const plans = await prisma.mealPlan.findMany({
    where: {
      userId: req.user.id,
      date: { gte: new Date(data.from), lte: new Date(data.to) },
      status: data.status,
    },
    include: {
      recipe: {
        select: {
          id: true, title: true, servings: true,
          ingredients: { orderBy: { position: 'asc' } },
        },
      },
    },
  });

  // Aggregate
  const agg = new Map(); // key = name|unit  →  { name, unit, qty, sources, tags, isRare }
  for (const plan of plans) {
    const scale = plan.servings / Math.max(1, plan.recipe.servings);
    for (const ing of plan.recipe.ingredients) {
      const name = ing.name.trim();
      const unit = ing.unit || '';
      const key = name.toLowerCase() + '|' + unit.toLowerCase();
      const scaled = (ing.qty || 0) * scale;
      if (!agg.has(key)) {
        agg.set(key, {
          name,
          unit: ing.unit,
          qty: 0,
          tags: ing.tags || [],
          isRare: !!ing.isRare,
          sources: [],
        });
      }
      const entry = agg.get(key);
      entry.qty += scaled;
      entry.sources.push({ recipeId: plan.recipe.id, title: plan.recipe.title, plannedDate: plan.date, slot: plan.slot });
    }
  }

  // Convert to array, round qty to 2 decimals, sort by category (rare first → produce → pantry)
  const items = [...agg.values()].map(e => ({
    ...e,
    qty: e.qty ? Number(e.qty.toFixed(2)) : null,
  })).sort((a, b) => {
    if (a.isRare !== b.isRare) return a.isRare ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return res.json({
    items,
    range: { from: data.from, to: data.to },
    mealCount: plans.length,
    uniqueIngredients: items.length,
  });
});

// ─── POST /api/meal-plan/generate ──────────────────────────
// Ask Claude to fill a 7-day window with DINNER suggestions based on the
// user's preferences. Creates the MealPlan rows and returns them.
//
// Body: {
//   startDate:        'YYYY-MM-DD',           // first day of the week
//   servings?:        int (default 2),
//   replaceExisting?: bool (default false)    // if true, deletes existing PLANNED dinners in the range first
// }
const generateSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  servings: z.number().int().min(1).max(50).default(2),
  replaceExisting: z.boolean().default(false),
});

router.post('/generate', async (req, res) => {
  if (!aiConfigured()) {
    return res.status(503).json({ error: 'ai_not_configured', message: 'Anthropic API key not set on server' });
  }

  const { data, error } = validate(generateSchema, req.body);
  if (error) return sendValidationError(res, error);

  // 1) Load user prefs (graceful default if no row yet)
  const prefsRow = await prisma.userPreferences.findUnique({ where: { userId: req.user.id } });
  const prefs = {
    cuisines: prefsRow?.cuisines || [],
    allergens: prefsRow?.allergens || [],
    dietary: prefsRow?.dietary || [],
    budgetPerPerson: prefsRow?.budgetPerPerson ?? null,
    householdSize: prefsRow?.householdSize ?? data.servings,
  };

  // 2) Load the recipe pool with the relations the AI needs to read
  const recipes = await prisma.recipe.findMany({
    select: {
      id: true, title: true, country: true, region: true,
      durationMin: true, budgetPerPerson: true, summary: true,
      allergens: { select: { allergen: true } },
      diets: { select: { diet: true } },
      moods: { select: { mood: true } },
    },
  });

  // 3) Filter to a manageable candidate pool
  const candidates = filterCandidates(recipes, prefs);
  if (candidates.length < 7) {
    return res.status(422).json({
      error: 'not_enough_candidates',
      message: `Only ${candidates.length} recipes match your preferences — relax allergens or dietary to broaden the pool.`,
      candidateCount: candidates.length,
    });
  }

  // 4) Compute date range (7 days starting at startDate)
  const start = new Date(data.startDate + 'T00:00:00.000Z');
  const end = new Date(start.getTime() + 7 * 24 * 3600 * 1000);

  // 5) Optional: clear existing PLANNED dinners in the window before regenerating
  if (data.replaceExisting) {
    await prisma.mealPlan.deleteMany({
      where: {
        userId: req.user.id,
        slot: 'DINNER',
        status: 'PLANNED',
        date: { gte: start, lt: end },
      },
    });
  }

  // 6) Ask Claude
  let selections;
  try {
    selections = await generateWeeklyPlan(prefs, candidates, data.startDate);
  } catch (e) {
    console.error('[meal-plan/generate] AI failed:', e.message);
    return res.status(502).json({ error: 'ai_failed', message: e.message });
  }

  // 7) Persist the chosen meals
  const created = [];
  for (const s of selections) {
    const date = new Date(start.getTime() + s.dayOffset * 24 * 3600 * 1000);

    // Find next position in slot for this date (so we don't collide with manual entries)
    const last = await prisma.mealPlan.findFirst({
      where: { userId: req.user.id, date, slot: 'DINNER' },
      orderBy: { position: 'desc' },
      select: { position: true },
    });
    const position = (last?.position ?? -1) + 1;

    const plan = await prisma.mealPlan.create({
      data: {
        userId: req.user.id,
        recipeId: s.recipeId,
        date,
        slot: 'DINNER',
        servings: data.servings,
        notes: s.rationale ? `✨ ${s.rationale}` : null,
        position,
      },
      include: { recipe: { select: { id: true, title: true, country: true, flag: true, durationMin: true, budgetPerPerson: true, gradient: true, imageUrl: true } } },
    });
    created.push(plan);
  }

  return res.status(201).json({ created: created.length, items: created });
});

// ─── POST /api/meal-plan/:id/to-cart ──────────────────────
// Push this single meal's ingredients into the cart.
router.post('/:id/to-cart', async (req, res) => {
  const plan = await prisma.mealPlan.findUnique({
    where: { id: req.params.id },
    include: { recipe: { include: { ingredients: { orderBy: { position: 'asc' } } } } },
  });
  if (!plan || plan.userId !== req.user.id) return res.status(404).json({ error: 'not_found' });

  const scale = plan.servings / Math.max(1, plan.recipe.servings);
  const items = plan.recipe.ingredients.map(ing => ({
    userId: req.user.id,
    ingredientName: ing.name,
    qty: ing.qty ? Number((ing.qty * scale).toFixed(2)) : null,
    unit: ing.unit,
    recipeId: plan.recipe.id,
    checked: false,
  }));

  const result = await prisma.cartItem.createMany({ data: items });
  return res.json({ added: result.count });
});

export default router;
