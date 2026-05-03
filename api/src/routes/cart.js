// /api/cart — list, add, toggle checked, remove, clear, import
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth } from '../auth/middleware.js';
import { validate, sendValidationError } from '../lib/zod-helpers.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const items = await prisma.cartItem.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      recipe: { select: { id: true, title: true, flag: true } },
      shop: { select: { id: true, name: true } },
    },
  });
  return res.json({ items });
});

const addSchema = z.object({
  ingredientName: z.string().min(1).max(200),
  qty: z.number().nullable().optional(),
  unit: z.string().max(20).nullable().optional(),
  recipeId: z.string().max(80).nullable().optional(),
  shopId: z.string().max(80).nullable().optional(),
});

router.post('/', async (req, res) => {
  const { data, error } = validate(addSchema, req.body);
  if (error) return sendValidationError(res, error);

  const item = await prisma.cartItem.create({
    data: {
      userId: req.user.id,
      ingredientName: data.ingredientName,
      qty: data.qty ?? null,
      unit: data.unit ?? null,
      recipeId: data.recipeId ?? null,
      shopId: data.shopId ?? null,
    },
  });
  return res.status(201).json({ item });
});

const updateSchema = z.object({ checked: z.boolean() });
router.patch('/:id', async (req, res) => {
  const { data, error } = validate(updateSchema, req.body);
  if (error) return sendValidationError(res, error);

  const item = await prisma.cartItem.findUnique({ where: { id: req.params.id } });
  if (!item || item.userId !== req.user.id) return res.status(404).json({ error: 'not_found' });

  const updated = await prisma.cartItem.update({
    where: { id: req.params.id },
    data: { checked: data.checked },
  });
  return res.json({ item: updated });
});

router.delete('/:id', async (req, res) => {
  const item = await prisma.cartItem.findUnique({ where: { id: req.params.id } });
  if (!item || item.userId !== req.user.id) return res.status(404).json({ error: 'not_found' });
  await prisma.cartItem.delete({ where: { id: req.params.id } });
  return res.json({ ok: true });
});

router.delete('/', async (req, res) => {
  await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
  return res.json({ ok: true });
});

// Bulk import (for localStorage migration)
const importSchema = z.object({
  items: z.array(z.object({
    ingredientName: z.string().min(1).max(200),
    qty: z.number().nullable().optional(),
    unit: z.string().max(20).nullable().optional(),
    recipeId: z.string().max(80).nullable().optional(),
    shopId: z.string().max(80).nullable().optional(),
    checked: z.boolean().optional(),
  })).max(500),
});

router.post('/import', async (req, res) => {
  const { data, error } = validate(importSchema, req.body);
  if (error) return sendValidationError(res, error);
  if (data.items.length === 0) return res.json({ added: 0 });
  const result = await prisma.cartItem.createMany({
    data: data.items.map(i => ({
      userId: req.user.id,
      ingredientName: i.ingredientName,
      qty: i.qty ?? null,
      unit: i.unit ?? null,
      recipeId: i.recipeId ?? null,
      shopId: i.shopId ?? null,
      checked: !!i.checked,
    })),
  });
  return res.json({ added: result.count });
});

export default router;
