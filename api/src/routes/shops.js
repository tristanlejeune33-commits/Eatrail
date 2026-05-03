// /api/shops — list (with optional ingredient/tag filters) + detail
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { validate, sendValidationError } from '../lib/zod-helpers.js';

const router = Router();

const listSchema = z.object({
  q: z.string().max(100).optional(),
  tag: z.string().max(40).optional(),
  neighborhood: z.string().max(80).optional(),
  ingredient: z.string().max(80).optional(),  // matches ShopIngredient.keyword
});

router.get('/', async (req, res) => {
  const { data, error } = validate(listSchema, req.query);
  if (error) return sendValidationError(res, error);

  const where = {};
  if (data.neighborhood) where.neighborhood = data.neighborhood;
  if (data.tag) where.tags = { some: { tag: data.tag } };
  if (data.ingredient) where.ingredients = { some: { keyword: data.ingredient.toLowerCase() } };
  if (data.q) {
    where.OR = [
      { name: { contains: data.q, mode: 'insensitive' } },
      { neighborhood: { contains: data.q, mode: 'insensitive' } },
      { description: { contains: data.q, mode: 'insensitive' } },
    ];
  }

  const items = await prisma.shop.findMany({
    where,
    include: { tags: { select: { tag: true } } },
    orderBy: [{ authScore: 'desc' }, { name: 'asc' }],
  });

  return res.json({
    items: items.map(s => ({
      id: s.id,
      name: s.name,
      address: s.address,
      neighborhood: s.neighborhood,
      borough: s.borough,
      lat: s.lat,
      lng: s.lng,
      type: s.type,
      hours: s.hours,
      authScore: s.authScore,
      priceLevel: s.priceLevel,
      gradient: s.gradient,
      imageUrl: s.imageUrl,
      description: s.description,
      tags: s.tags.map(t => t.tag),
    })),
  });
});

router.get('/:id', async (req, res) => {
  const shop = await prisma.shop.findUnique({
    where: { id: req.params.id },
    include: {
      tags: { select: { tag: true } },
      ingredients: { select: { keyword: true } },
    },
  });
  if (!shop) return res.status(404).json({ error: 'not_found' });
  return res.json({ shop: {
    ...shop,
    tags: shop.tags.map(t => t.tag),
    ingredients: shop.ingredients.map(i => i.keyword),
  }});
});

export default router;
