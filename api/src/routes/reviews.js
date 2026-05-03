// /api/reviews — list per recipe, upsert (one review per user per recipe), delete
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth } from '../auth/middleware.js';
import { validate, sendValidationError } from '../lib/zod-helpers.js';

const router = Router();

// GET /api/reviews/recipe/:recipeId  — public, list reviews + aggregate
router.get('/recipe/:recipeId', async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { recipeId: req.params.recipeId },
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { user: { select: { id: true, name: true, avatarColor: true } } },
  });
  const agg = await prisma.review.aggregate({
    where: { recipeId: req.params.recipeId },
    _avg: { rating: true },
    _count: { rating: true },
  });
  return res.json({
    items: reviews.map(r => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      author: r.user,
    })),
    stats: {
      count: agg._count.rating,
      avg: agg._avg.rating ? Number(agg._avg.rating.toFixed(2)) : null,
    },
  });
});

// POST /api/reviews/recipe/:recipeId — upsert review (auth required)
const upsertSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional().nullable(),
});

router.post('/recipe/:recipeId', requireAuth, async (req, res) => {
  const { data, error } = validate(upsertSchema, req.body);
  if (error) return sendValidationError(res, error);

  const recipe = await prisma.recipe.findUnique({ where: { id: req.params.recipeId }, select: { id: true } });
  if (!recipe) return res.status(404).json({ error: 'recipe_not_found' });

  const review = await prisma.review.upsert({
    where: { userId_recipeId: { userId: req.user.id, recipeId: recipe.id } },
    update: { rating: data.rating, comment: data.comment ?? null },
    create: {
      userId: req.user.id,
      recipeId: recipe.id,
      rating: data.rating,
      comment: data.comment ?? null,
    },
  });
  return res.json({ review });
});

router.delete('/recipe/:recipeId', requireAuth, async (req, res) => {
  await prisma.review.deleteMany({ where: { userId: req.user.id, recipeId: req.params.recipeId } });
  return res.json({ ok: true });
});

export default router;
