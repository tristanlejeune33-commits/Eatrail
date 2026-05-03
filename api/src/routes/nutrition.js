// /api/nutrition — on-demand recipe nutrition fetch (USDA-backed)
import { Router } from 'express';
import { prisma } from '../db.js';
import { fillRecipeNutrition, isConfigured } from '../lib/nutrition.js';

const router = Router();

router.get('/status', (_req, res) => {
  res.json({ usda: isConfigured() });
});

// GET /api/nutrition/recipe/:id — returns cached or freshly-computed nutrition
router.get('/recipe/:id', async (req, res) => {
  let recipe = await prisma.recipe.findUnique({
    where: { id: req.params.id },
    select: {
      id: true, title: true, servings: true,
      caloriesKcal: true, proteinG: true, carbsG: true, fatG: true,
      fiberG: true, sodiumMg: true, nutritionFetchedAt: true,
    },
  });
  if (!recipe) return res.status(404).json({ error: 'recipe_not_found' });

  // If never fetched OR older than 180 days OR missing data → compute now
  const stale = !recipe.nutritionFetchedAt ||
    (Date.now() - new Date(recipe.nutritionFetchedAt).getTime()) > 180 * 24 * 3600 * 1000 ||
    recipe.caloriesKcal == null;

  if (stale && isConfigured()) {
    const result = await fillRecipeNutrition(req.params.id);
    if (result.recipe) recipe = result.recipe;
  }

  return res.json({
    nutrition: {
      perServing: {
        calories: recipe.caloriesKcal,
        protein: recipe.proteinG,
        carbs: recipe.carbsG,
        fat: recipe.fatG,
        fiber: recipe.fiberG,
        sodium: recipe.sodiumMg,
      },
      servings: recipe.servings,
      fetchedAt: recipe.nutritionFetchedAt,
      source: 'USDA FoodData Central (estimation)',
    },
  });
});

export default router;
