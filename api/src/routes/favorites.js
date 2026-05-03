// /api/favorites — list / toggle / bulk import (for localStorage migration)
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth } from '../auth/middleware.js';
import { validate, sendValidationError } from '../lib/zod-helpers.js';

const router = Router();
router.use(requireAuth);

// GET /api/favorites
router.get('/', async (req, res) => {
  const favs = await prisma.favorite.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      recipe: {
        select: {
          id: true, title: true, country: true, region: true, flag: true,
          authScore: true, durationMin: true, budgetLevel: true, gradient: true,
          summary: true, imageUrl: true,
        },
      },
    },
  });
  return res.json({ items: favs.map(f => ({ recipeId: f.recipeId, addedAt: f.createdAt, recipe: f.recipe })) });
});

// POST /api/favorites/:recipeId — toggle
router.post('/:recipeId', async (req, res) => {
  const { recipeId } = req.params;
  const recipe = await prisma.recipe.findUnique({ where: { id: recipeId }, select: { id: true } });
  if (!recipe) return res.status(404).json({ error: 'recipe_not_found' });

  const existing = await prisma.favorite.findUnique({
    where: { userId_recipeId: { userId: req.user.id, recipeId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { userId_recipeId: { userId: req.user.id, recipeId } } });
    return res.json({ saved: false });
  } else {
    await prisma.favorite.create({ data: { userId: req.user.id, recipeId } });
    return res.json({ saved: true });
  }
});

// POST /api/favorites/import — bulk add (for first login from localStorage)
const importSchema = z.object({ recipeIds: z.array(z.string().max(80)).max(2000) });
router.post('/import', async (req, res) => {
  const { data, error } = validate(importSchema, req.body);
  if (error) return sendValidationError(res, error);
  if (data.recipeIds.length === 0) return res.json({ added: 0 });

  // Filter to existing recipe IDs only
  const existing = await prisma.recipe.findMany({
    where: { id: { in: data.recipeIds } },
    select: { id: true },
  });
  const validIds = existing.map(r => r.id);

  const result = await prisma.favorite.createMany({
    data: validIds.map(recipeId => ({ userId: req.user.id, recipeId })),
    skipDuplicates: true,
  });
  return res.json({ added: result.count });
});

export default router;
