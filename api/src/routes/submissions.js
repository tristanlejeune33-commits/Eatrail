// /api/submissions — user-generated recipe submissions (UGC, moderated)
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth } from '../auth/middleware.js';
import { validate, sendValidationError } from '../lib/zod-helpers.js';

const router = Router();

const submissionSchema = z.object({
  title: z.string().min(3).max(120),
  country: z.string().min(2).max(80),
  region: z.string().max(80).optional().nullable(),
  flag: z.string().max(8).optional().nullable(),
  durationMin: z.number().int().min(1).max(2000).optional(),
  servings: z.number().int().min(1).max(50).default(4),
  difficulty: z.number().int().min(1).max(5).default(2),
  budgetPerPerson: z.number().min(0).max(1000).optional().nullable(),
  budgetLevel: z.enum(['$', '$$', '$$$']).optional(),
  summary: z.string().max(500).optional().nullable(),
  story: z.string().max(2000).optional().nullable(),
  category: z.string().max(40).optional().nullable(),
  ingredients: z.array(z.object({
    name: z.string().min(1).max(200),
    qty: z.number().nullable().optional(),
    unit: z.string().max(20).nullable().optional(),
    tags: z.array(z.string().max(40)).max(10).optional(),
    isRare: z.boolean().optional(),
    substitutes: z.array(z.string().max(120)).max(5).optional(),
  })).min(1).max(50),
  steps: z.array(z.object({
    title: z.string().max(200),
    instruction: z.string().min(1).max(2000),
    time: z.number().int().min(0).max(2000).optional().nullable(),
  })).min(1).max(30),
  diets: z.array(z.string().max(40)).max(10).optional(),
  moods: z.array(z.string().max(40)).max(10).optional(),
  allergens: z.array(z.string().max(40)).max(20).optional(),
  imageUrl: z.string().url().max(500).optional().nullable(),
});

// POST /api/submissions — create a new submission (auth required)
router.post('/', requireAuth, async (req, res) => {
  const { data, error } = validate(submissionSchema, req.body);
  if (error) return sendValidationError(res, error);

  const sub = await prisma.userRecipeSubmission.create({
    data: {
      userId: req.user.id,
      title: data.title,
      country: data.country,
      region: data.region ?? null,
      flag: data.flag ?? null,
      durationMin: data.durationMin ?? null,
      servings: data.servings,
      difficulty: data.difficulty,
      budgetPerPerson: data.budgetPerPerson ?? null,
      budgetLevel: data.budgetLevel ?? '$$',
      summary: data.summary ?? null,
      story: data.story ?? null,
      category: data.category ?? null,
      ingredients: data.ingredients,
      steps: data.steps,
      diets: data.diets || [],
      moods: data.moods || [],
      allergens: data.allergens || [],
      imageUrl: data.imageUrl ?? null,
    },
  });
  return res.status(201).json({ submission: sub });
});

// GET /api/submissions/mine — list user's submissions
router.get('/mine', requireAuth, async (req, res) => {
  const items = await prisma.userRecipeSubmission.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
  });
  return res.json({ items });
});

// GET /api/submissions/:id — fetch one (owner OR moderator only)
router.get('/:id', requireAuth, async (req, res) => {
  const sub = await prisma.userRecipeSubmission.findUnique({ where: { id: req.params.id } });
  if (!sub || sub.userId !== req.user.id) return res.status(404).json({ error: 'not_found' });
  return res.json({ submission: sub });
});

// PATCH /api/submissions/:id — edit (only if PENDING)
router.patch('/:id', requireAuth, async (req, res) => {
  const sub = await prisma.userRecipeSubmission.findUnique({ where: { id: req.params.id } });
  if (!sub || sub.userId !== req.user.id) return res.status(404).json({ error: 'not_found' });
  if (sub.status !== 'PENDING' && sub.status !== 'CHANGES_REQUESTED') {
    return res.status(403).json({ error: 'locked', message: 'Submission already reviewed.' });
  }
  const { data, error } = validate(submissionSchema.partial(), req.body);
  if (error) return sendValidationError(res, error);
  const updated = await prisma.userRecipeSubmission.update({
    where: { id: req.params.id },
    data: { ...data, status: 'PENDING' },
  });
  res.json({ submission: updated });
});

// DELETE /api/submissions/:id — owner can withdraw
router.delete('/:id', requireAuth, async (req, res) => {
  const sub = await prisma.userRecipeSubmission.findUnique({ where: { id: req.params.id } });
  if (!sub || sub.userId !== req.user.id) return res.status(404).json({ error: 'not_found' });
  await prisma.userRecipeSubmission.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

// ─── ADMIN/MODERATOR ENDPOINTS (TODO: add isModerator middleware) ──
// For now, gated behind requireAuth — add role check before ship.

router.get('/_admin/queue', requireAuth, async (req, res) => {
  // TODO: assert req.user is moderator
  const items = await prisma.userRecipeSubmission.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'asc' },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  res.json({ items });
});

router.post('/:id/_admin/approve', requireAuth, async (req, res) => {
  // TODO: assert req.user is moderator
  const sub = await prisma.userRecipeSubmission.findUnique({ where: { id: req.params.id } });
  if (!sub) return res.status(404).json({ error: 'not_found' });

  // Slugify title to recipe.id
  const baseSlug = sub.title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  let slug = baseSlug;
  let n = 1;
  while (await prisma.recipe.findUnique({ where: { id: slug }, select: { id: true } })) {
    slug = `${baseSlug}-${++n}`;
  }

  const recipe = await prisma.recipe.create({
    data: {
      id: slug,
      title: sub.title,
      country: sub.country,
      region: sub.region,
      flag: sub.flag,
      authScore: 70,  // user-submitted starts lower
      durationMin: sub.durationMin || 30,
      servings: sub.servings,
      difficulty: sub.difficulty,
      budgetPerPerson: sub.budgetPerPerson || 5,
      budgetLevel: sub.budgetLevel || '$$',
      summary: sub.summary || '',
      story: sub.story,
      category: sub.category,
      validatorName: 'User: ' + (await prisma.user.findUnique({ where: { id: sub.userId }, select: { name: true } }))?.name,
      validatorRole: 'Contributeur',
      imageUrl: sub.imageUrl,
      ingredients: {
        create: (sub.ingredients || []).map((i, idx) => ({
          position: idx, name: i.name, qty: i.qty, unit: i.unit,
          tags: i.tags || [], isRare: !!i.isRare, substitutes: i.substitutes || [],
        })),
      },
      steps: {
        create: (sub.steps || []).map((s, idx) => ({
          position: idx, title: s.title || `Étape ${idx + 1}`, instruction: s.instruction, timeMin: s.time,
        })),
      },
      diets: { create: (sub.diets || []).map(diet => ({ diet })) },
      moods: { create: (sub.moods || []).map(mood => ({ mood })) },
      allergens: { create: (sub.allergens || []).map(allergen => ({ allergen })) },
    },
  });

  await prisma.userRecipeSubmission.update({
    where: { id: req.params.id },
    data: { status: 'APPROVED', approvedRecipeId: recipe.id, reviewedAt: new Date(), moderatorNote: req.body?.note ?? null },
  });

  res.json({ recipe });
});

router.post('/:id/_admin/reject', requireAuth, async (req, res) => {
  // TODO: assert req.user is moderator
  const sub = await prisma.userRecipeSubmission.update({
    where: { id: req.params.id },
    data: { status: 'REJECTED', reviewedAt: new Date(), moderatorNote: req.body?.note ?? null },
  });
  res.json({ submission: sub });
});

export default router;
