// /api/flavor-dna — aggregated user culinary identity card.
// Inspired by the design brief's "Flavor DNA" feature for viral acquisition.
import { Router } from 'express';
import { prisma } from '../db.js';
import { requireAuth } from '../auth/middleware.js';

const router = Router();
router.use(requireAuth);

router.get('/me', async (req, res) => {
  const userId = req.user.id;

  // Run all aggregates in parallel
  const [favorites, cookedPlans, reviews, prefs] = await Promise.all([
    prisma.favorite.findMany({
      where: { userId },
      include: {
        recipe: {
          select: {
            id: true, country: true, region: true, category: true,
            durationMin: true, budgetPerPerson: true, authScore: true,
            diets: { select: { diet: true } },
            moods: { select: { mood: true } },
            allergens: { select: { allergen: true } },
          },
        },
      },
    }),
    prisma.mealPlan.findMany({
      where: { userId, status: 'COOKED' },
      include: {
        recipe: { select: { id: true, country: true, region: true, durationMin: true, ingredients: { select: { tags: true, isRare: true } } } },
      },
      orderBy: { date: 'desc' },
    }),
    prisma.review.findMany({
      where: { userId },
      include: { recipe: { select: { country: true, authScore: true } } },
    }),
    prisma.userPreferences.findUnique({ where: { userId } }),
  ]);

  // ─── Compute "epicenter" cuisine (most cooked + favorited) ───
  const cuisineWeights = {};
  for (const f of favorites) {
    cuisineWeights[f.recipe.country] = (cuisineWeights[f.recipe.country] || 0) + 1;
  }
  for (const p of cookedPlans) {
    cuisineWeights[p.recipe.country] = (cuisineWeights[p.recipe.country] || 0) + 3; // cooked > favorited
  }
  const sortedCuisines = Object.entries(cuisineWeights).sort((a, b) => b[1] - a[1]);
  const epicenter = sortedCuisines[0]?.[0] || null;
  const topCuisines = sortedCuisines.slice(0, 5).map(([country, score]) => ({ country, score }));

  // ─── Compute "force" — dominant trait ────────────────────────
  const moodCount = {};
  const dietCount = {};
  for (const f of favorites) {
    for (const m of f.recipe.moods) moodCount[m.mood] = (moodCount[m.mood] || 0) + 1;
    for (const d of f.recipe.diets) dietCount[d.diet] = (dietCount[d.diet] || 0) + 1;
  }
  const topMood = Object.entries(moodCount).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  const moodLabels = {
    spicy: 'Épicé',
    comfort: 'Réconfort',
    quick: 'Express',
    festive: 'Festif',
    wow: 'Effet wow',
    street: 'Street food',
    healthy: 'Healthy',
  };
  const force = topMood ? moodLabels[topMood] || topMood : null;

  // ─── Difficulty profile ──────────────────────────────────────
  const cookedCount = cookedPlans.length;
  const favoriteCount = favorites.length;
  const reviewedCount = reviews.length;
  const avgAuth = reviews.length > 0
    ? Number((reviews.reduce((s, r) => s + r.recipe.authScore, 0) / reviews.length).toFixed(1))
    : null;

  // ─── Rare ingredients explored ───────────────────────────────
  const rareIngredients = new Set();
  for (const p of cookedPlans) {
    for (const ing of (p.recipe.ingredients || [])) {
      if (ing.isRare) {
        for (const t of (ing.tags || [])) rareIngredients.add(t);
      }
    }
  }

  // ─── Avg cook time + budget ──────────────────────────────────
  const avgCookTime = cookedPlans.length > 0
    ? Math.round(cookedPlans.reduce((s, p) => s + p.recipe.durationMin, 0) / cookedPlans.length)
    : null;

  // ─── Streak (consecutive days with at least one cooked meal) ─
  const dayKeys = new Set(cookedPlans.map(p => new Date(p.date).toISOString().slice(0, 10)));
  let streak = 0;
  let cursor = new Date();
  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (dayKeys.has(key)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else break;
    if (streak > 365) break;
  }

  // ─── Diet alignment ──────────────────────────────────────────
  const dominantDiet = Object.entries(dietCount).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  // ─── Build the DNA card ──────────────────────────────────────
  const dna = {
    user: {
      id: req.user.id,
      name: req.user.name,
      avatarColor: req.user.avatarColor,
      memberSince: req.user.createdAt,
    },
    epicenter,
    force,
    stats: {
      recipesUnlocked: favoriteCount,
      mealsCooked: cookedCount,
      reviews: reviewedCount,
      streak,
      avgCookTimeMin: avgCookTime,
      avgAuthRated: avgAuth,
    },
    topCuisines,
    dominantMood: topMood,
    dominantDiet,
    rareTags: [...rareIngredients].slice(0, 8),
    preferences: prefs ? {
      cuisines: prefs.cuisines,
      allergens: prefs.allergens,
      dietary: prefs.dietary,
      budgetPerPerson: prefs.budgetPerPerson,
    } : null,
    // Personality archetype derived from data
    archetype: deriveArchetype({ cookedCount, favoriteCount, topMood, dominantDiet, rareCount: rareIngredients.size, avgCookTime }),
  };

  return res.json({ dna });
});

function deriveArchetype({ cookedCount, favoriteCount, topMood, dominantDiet, rareCount, avgCookTime }) {
  if (rareCount > 5 && cookedCount > 10) return { id: 'explorer', label: 'L\'Explorateur', emoji: '🌍' };
  if (cookedCount > 30) return { id: 'devoted', label: 'Le Dévoué', emoji: '🔥' };
  if (avgCookTime && avgCookTime < 25 && cookedCount > 5) return { id: 'speedster', label: 'L\'Express', emoji: '⚡' };
  if (topMood === 'comfort' && cookedCount > 5) return { id: 'comforter', label: 'L\'Apaisant', emoji: '🍲' };
  if (topMood === 'spicy' && cookedCount > 5) return { id: 'firebreather', label: 'Le Pyromane', emoji: '🌶' };
  if (dominantDiet === 'vegan' || dominantDiet === 'vegetarian') return { id: 'plantbased', label: 'Le Jardinier', emoji: '🌱' };
  if (favoriteCount > 20 && cookedCount < 5) return { id: 'dreamer', label: 'Le Rêveur', emoji: '✨' };
  return { id: 'novice', label: 'Le Débutant', emoji: '🌱' };
}

export default router;
