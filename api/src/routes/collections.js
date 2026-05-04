// /api/collections — user-curated recipe groups ("cookbooks").
// All routes require authentication and are scoped to req.user.
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth } from '../auth/middleware.js';
import { validate, sendValidationError } from '../lib/zod-helpers.js';

const router = Router();
router.use(requireAuth);

const createSchema = z.object({
  name: z.string().min(1).max(80),
  description: z.string().max(500).optional().nullable(),
  emoji: z.string().max(8).optional().nullable(),
  isPublic: z.boolean().optional().default(false),
});

const updateSchema = z.object({
  name: z.string().min(1).max(80).optional(),
  description: z.string().max(500).nullable().optional(),
  emoji: z.string().max(8).nullable().optional(),
  isPublic: z.boolean().optional(),
});

const recipeIdSchema = z.object({ recipeId: z.string().min(1).max(80) });

// Recipe fields the UI needs in a card view (kept small to keep payloads light).
const RECIPE_CARD_SELECT = {
  id: true, title: true, country: true, region: true, flag: true,
  authScore: true, durationMin: true, servings: true,
  budgetPerPerson: true, budgetLevel: true, gradient: true,
  summary: true, imageUrl: true, category: true,
};

// ─── GET /api/collections — list current user's collections ───
router.get('/', async (req, res) => {
  const cols = await prisma.collection.findMany({
    where: { userId: req.user.id },
    orderBy: [{ updatedAt: 'desc' }],
    include: {
      _count: { select: { recipes: true } },
      // Up to 4 recipes for thumbnail mosaic in the list view
      recipes: {
        take: 4,
        orderBy: [{ position: 'asc' }, { addedAt: 'asc' }],
        include: { recipe: { select: { id: true, imageUrl: true, gradient: true } } },
      },
    },
  });
  return res.json({ items: cols });
});

// ─── GET /api/collections/:id — detail with full recipes ───
router.get('/:id', async (req, res) => {
  const col = await prisma.collection.findUnique({
    where: { id: req.params.id },
    include: {
      recipes: {
        orderBy: [{ position: 'asc' }, { addedAt: 'asc' }],
        include: { recipe: { select: RECIPE_CARD_SELECT } },
      },
    },
  });
  if (!col || col.userId !== req.user.id) return res.status(404).json({ error: 'not_found' });
  return res.json({ collection: col });
});

// ─── POST /api/collections — create ───
router.post('/', async (req, res) => {
  const { data, error } = validate(createSchema, req.body);
  if (error) return sendValidationError(res, error);
  const col = await prisma.collection.create({
    data: {
      userId: req.user.id,
      name: data.name.trim(),
      description: data.description?.trim() || null,
      emoji: data.emoji?.trim() || null,
      isPublic: !!data.isPublic,
    },
  });
  return res.status(201).json({ collection: col });
});

// ─── PATCH /api/collections/:id — rename, update emoji/description/visibility ───
router.patch('/:id', async (req, res) => {
  const { data, error } = validate(updateSchema, req.body);
  if (error) return sendValidationError(res, error);

  const existing = await prisma.collection.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.userId !== req.user.id) return res.status(404).json({ error: 'not_found' });

  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name.trim();
  if (data.description !== undefined) updateData.description = data.description ? data.description.trim() : null;
  if (data.emoji !== undefined) updateData.emoji = data.emoji ? data.emoji.trim() : null;
  if (data.isPublic !== undefined) updateData.isPublic = !!data.isPublic;

  const col = await prisma.collection.update({ where: { id: req.params.id }, data: updateData });
  return res.json({ collection: col });
});

// ─── DELETE /api/collections/:id ───
router.delete('/:id', async (req, res) => {
  const existing = await prisma.collection.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.userId !== req.user.id) return res.status(404).json({ error: 'not_found' });
  await prisma.collection.delete({ where: { id: req.params.id } });
  return res.json({ ok: true });
});

// ─── POST /api/collections/:id/recipes — add a recipe to this collection ───
router.post('/:id/recipes', async (req, res) => {
  const { data, error } = validate(recipeIdSchema, req.body);
  if (error) return sendValidationError(res, error);

  const col = await prisma.collection.findUnique({ where: { id: req.params.id } });
  if (!col || col.userId !== req.user.id) return res.status(404).json({ error: 'not_found' });

  const recipe = await prisma.recipe.findUnique({ where: { id: data.recipeId }, select: { id: true } });
  if (!recipe) return res.status(404).json({ error: 'recipe_not_found' });

  // Compute next position
  const last = await prisma.collectionRecipe.findFirst({
    where: { collectionId: col.id },
    orderBy: { position: 'desc' },
    select: { position: true },
  });
  const position = (last?.position ?? -1) + 1;

  const link = await prisma.collectionRecipe.upsert({
    where: { collectionId_recipeId: { collectionId: col.id, recipeId: data.recipeId } },
    create: { collectionId: col.id, recipeId: data.recipeId, position },
    update: {}, // already there → no-op
  });
  // Bump collection updatedAt so list view reorders
  await prisma.collection.update({ where: { id: col.id }, data: { updatedAt: new Date() } });
  return res.status(201).json({ added: true, link });
});

// ─── DELETE /api/collections/:id/recipes/:recipeId — remove a recipe ───
router.delete('/:id/recipes/:recipeId', async (req, res) => {
  const col = await prisma.collection.findUnique({ where: { id: req.params.id } });
  if (!col || col.userId !== req.user.id) return res.status(404).json({ error: 'not_found' });

  await prisma.collectionRecipe.deleteMany({
    where: { collectionId: col.id, recipeId: req.params.recipeId },
  });
  await prisma.collection.update({ where: { id: col.id }, data: { updatedAt: new Date() } });
  return res.json({ ok: true });
});

export default router;
