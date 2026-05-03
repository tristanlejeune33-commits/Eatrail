// USDA FoodData Central wrapper — estimates per-serving nutrition for a recipe.
// API: https://fdc.nal.usda.gov/api-guide.html  (free, requires API key)
// Get key at: https://fdc.nal.usda.gov/api-key-signup.html
//
// Strategy:
//   1. For each ingredient in a recipe, query USDA for best match (Foundation/SR Legacy)
//   2. Use the ingredient.qty + unit to scale macros
//   3. Sum across ingredients → per-recipe totals
//   4. Divide by recipe.servings → per-serving
//   5. Cache result on Recipe (caloriesKcal, proteinG, etc.)
//
// Rate limit: 1000 req/h on free tier with key. We batch + cache aggressively.
import { prisma } from '../db.js';

const KEY = process.env.USDA_API_KEY;
const BASE = 'https://api.nal.usda.gov/fdc/v1';

export function isConfigured() { return !!KEY; }

// USDA returns per-100g nutrient values. Convert ingredient qty to grams (rough estimates).
const UNIT_TO_GRAMS = {
  g: 1, kg: 1000, mg: 0.001,
  ml: 1, l: 1000, cl: 10,    // assume density ~1 (oils slightly off but ok for ballpark)
  cs: 15, 'c.s.': 15, cuillère: 15, 'c.s': 15,  // tablespoon
  cc: 5, 'c.c.': 5, 'c.c': 5,                    // teaspoon
  tasse: 240, cup: 240,
  pièce: 100, piece: 100, unit: 100, oeuf: 50, œuf: 50, œufs: 50,  // very rough
};

// Nutrient IDs from USDA FoodData (constant)
const NUT = {
  CAL: 1008,    // Energy (kcal)
  PROT: 1003,   // Protein (g)
  FAT: 1004,    // Total lipid (g)
  CARB: 1005,   // Carbohydrate (g)
  FIBER: 1079,  // Fiber (g)
  SODIUM: 1093, // Sodium (mg)
};

function gramsForIngredient(ing) {
  const qty = typeof ing.qty === 'number' ? ing.qty : 0;
  const unit = (ing.unit || '').toLowerCase().trim();
  const factor = UNIT_TO_GRAMS[unit];
  if (factor) return qty * factor;
  // Unknown unit ('lot', 'pinch', etc.) → estimate small (5g)
  return qty * 5;
}

async function searchFood(query) {
  if (!KEY) return null;
  const url = `${BASE}/foods/search?query=${encodeURIComponent(query)}&dataType=Foundation,SR%20Legacy&pageSize=1&api_key=${KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    return json.foods?.[0] || null;
  } catch { return null; }
}

function nutrientValue(food, nutrientId) {
  if (!food?.foodNutrients) return null;
  const n = food.foodNutrients.find(x => x.nutrientId === nutrientId);
  return n ? n.value : null;
}

/**
 * Compute and persist per-serving nutrition for a recipe.
 * Returns the updated recipe (with nutrition fields filled).
 */
export async function fillRecipeNutrition(recipeId) {
  if (!KEY) return { error: 'usda_not_configured' };

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: { ingredients: { orderBy: { position: 'asc' } } },
  });
  if (!recipe) return { error: 'recipe_not_found' };

  let totalCal = 0, totalProt = 0, totalFat = 0, totalCarb = 0, totalFiber = 0, totalSodium = 0;
  let matchedCount = 0;

  for (const ing of recipe.ingredients) {
    const grams = gramsForIngredient(ing);
    if (!grams) continue;
    // USDA uses English; we'd want translation ideally. For now, query the raw name.
    const food = await searchFood(ing.name.split(/[+,]/)[0].trim().slice(0, 80));
    if (!food) continue;
    matchedCount++;
    const factor = grams / 100;  // USDA gives per 100g
    totalCal += (nutrientValue(food, NUT.CAL) || 0) * factor;
    totalProt += (nutrientValue(food, NUT.PROT) || 0) * factor;
    totalFat += (nutrientValue(food, NUT.FAT) || 0) * factor;
    totalCarb += (nutrientValue(food, NUT.CARB) || 0) * factor;
    totalFiber += (nutrientValue(food, NUT.FIBER) || 0) * factor;
    totalSodium += (nutrientValue(food, NUT.SODIUM) || 0) * factor;
  }

  const servings = recipe.servings || 1;
  const updated = await prisma.recipe.update({
    where: { id: recipeId },
    data: {
      caloriesKcal: Number((totalCal / servings).toFixed(0)),
      proteinG: Number((totalProt / servings).toFixed(1)),
      carbsG: Number((totalCarb / servings).toFixed(1)),
      fatG: Number((totalFat / servings).toFixed(1)),
      fiberG: Number((totalFiber / servings).toFixed(1)),
      sodiumMg: Number((totalSodium / servings).toFixed(0)),
      nutritionFetchedAt: new Date(),
    },
  });

  return { recipe: updated, matchedIngredients: matchedCount, totalIngredients: recipe.ingredients.length };
}
