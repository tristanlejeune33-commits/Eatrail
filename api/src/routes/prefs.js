// /api/prefs — get + upsert user preferences (cuisines, allergens, diet, budget…)
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth } from '../auth/middleware.js';
import { validate, sendValidationError } from '../lib/zod-helpers.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const prefs = await prisma.userPreferences.findUnique({
    where: { userId: req.user.id },
  });
  return res.json({ prefs: prefs || null });
});

const upsertSchema = z.object({
  locale: z.string().max(8).optional(),
  cuisines: z.array(z.string().max(60)).max(40).optional(),
  allergens: z.array(z.string().max(40)).max(30).optional(),
  dietary: z.array(z.string().max(40)).max(20).optional(),
  budgetPerPerson: z.number().min(0).max(1000).nullable().optional(),
  householdSize: z.number().int().min(1).max(50).optional(),
  onboardingStep: z.number().int().min(1).max(20).optional(),
  onboardingComplete: z.boolean().optional(),
  extra: z.record(z.any()).optional(),
});

router.put('/', async (req, res) => {
  const { data, error } = validate(upsertSchema, req.body);
  if (error) return sendValidationError(res, error);

  const prefs = await prisma.userPreferences.upsert({
    where: { userId: req.user.id },
    update: data,
    create: { userId: req.user.id, ...data },
  });
  return res.json({ prefs });
});

export default router;
