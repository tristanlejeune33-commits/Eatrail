// /api/recipes — list (filterable) + detail
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { validate, sendValidationError } from '../lib/zod-helpers.js';

const router = Router();

const listSchema = z.object({
  q: z.string().max(100).optional(),
  country: z.string().max(80).optional(),
  category: z.string().max(40).optional(),
  diet: z.string().max(40).optional(),
  mood: z.string().max(40).optional(),
  budget: z.enum(['$', '$$', '$$$']).optional(),
  maxDuration: z.coerce.number().int().min(1).max(1000).optional(),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(30),
  sort: z.enum(['recent', 'auth', 'duration', 'budget']).default('auth'),
});

// GET /api/recipes
router.get('/', async (req, res) => {
  const { data, error } = validate(listSchema, req.query);
  if (error) return sendValidationError(res, error);

  const where = {};
  if (data.country) where.country = data.country;
  if (data.category) where.category = data.category;
  if (data.budget) where.budgetLevel = data.budget;
  if (data.maxDuration) where.durationMin = { lte: data.maxDuration };
  if (data.diet) where.diets = { some: { diet: data.diet } };
  if (data.mood) where.moods = { some: { mood: data.mood } };
  if (data.q) {
    const q = data.q.toLowerCase();
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { summary: { contains: q, mode: 'insensitive' } },
      { country: { contains: q, mode: 'insensitive' } },
      { region: { contains: q, mode: 'insensitive' } },
    ];
  }

  const orderBy =
    data.sort === 'recent' ? { createdAt: 'desc' } :
    data.sort === 'duration' ? { durationMin: 'asc' } :
    data.sort === 'budget' ? { budgetPerPerson: 'asc' } :
    [{ authScore: 'desc' }, { title: 'asc' }];

  const [items, total] = await Promise.all([
    prisma.recipe.findMany({
      where,
      orderBy,
      skip: (data.page - 1) * data.perPage,
      take: data.perPage,
      select: {
        id: true, title: true, country: true, region: true, flag: true,
        authScore: true, durationMin: true, servings: true, difficulty: true,
        budgetPerPerson: true, budgetLevel: true, gradient: true,
        summary: true, category: true,
        validatorName: true, validatorRole: true, validatorCity: true,
        imageUrl: true,
        diets: { select: { diet: true } },
        moods: { select: { mood: true } },
        _count: { select: { ingredients: true } },
      },
    }),
    prisma.recipe.count({ where }),
  ]);

  return res.json({
    items: items.map(formatRecipeListItem),
    page: data.page,
    perPage: data.perPage,
    total,
    totalPages: Math.ceil(total / data.perPage),
  });
});

// GET /api/recipes/:id
router.get('/:id', async (req, res) => {
  const recipe = await prisma.recipe.findUnique({
    where: { id: req.params.id },
    include: {
      ingredients: { orderBy: { position: 'asc' } },
      steps: { orderBy: { position: 'asc' } },
      diets: { select: { diet: true } },
      moods: { select: { mood: true } },
      allergens: { select: { allergen: true } },
      _count: { select: { reviews: true, favorites: true } },
    },
  });
  if (!recipe) return res.status(404).json({ error: 'not_found' });

  // Average rating
  const agg = await prisma.review.aggregate({
    where: { recipeId: recipe.id },
    _avg: { rating: true },
    _count: { rating: true },
  });

  return res.json({
    recipe: {
      ...formatRecipeListItem(recipe),
      story: recipe.story,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      allergens: recipe.allergens.map(a => a.allergen),
      stats: {
        favorites: recipe._count.favorites,
        reviews: agg._count.rating,
        avgRating: agg._avg.rating ? Number(agg._avg.rating.toFixed(2)) : null,
      },
    },
  });
});

function formatRecipeListItem(r) {
  return {
    id: r.id, title: r.title,
    origin: { country: r.country, region: r.region, flag: r.flag },
    auth: r.authScore,
    duration: r.durationMin,
    servings: r.servings,
    difficulty: r.difficulty,
    budget: { perPerson: r.budgetPerPerson, level: r.budgetLevel },
    gradient: r.gradient,
    summary: r.summary,
    category: r.category,
    validator: r.validatorName ? { name: r.validatorName, role: r.validatorRole, city: r.validatorCity } : null,
    imageUrl: r.imageUrl,
    diets: r.diets ? r.diets.map(d => d.diet) : [],
    moods: r.moods ? r.moods.map(m => m.mood) : [],
    ingredientCount: r._count?.ingredients,
  };
}

export default router;
