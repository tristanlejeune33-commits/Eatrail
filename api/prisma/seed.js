// Seed: import all 625 recipes + 30 shops from web/app/data/*.js
// into Postgres via Prisma. Idempotent (uses upsert).
//
// Usage:
//   DATABASE_URL=... node prisma/seed.js
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const DATA_ROOT = path.resolve(__dirname, '..', '..', 'web', 'app', 'data');
const RECIPES_DIR = path.join(DATA_ROOT, 'recipes');
const SHOPS_FILE = path.join(DATA_ROOT, 'shops.js');
const IMAGES_FILE = path.join(DATA_ROOT, 'images.js');

const CUISINES = [
  'italian','french','american','mexican','japanese','chinese','indian','thai','korean',
  'spanish','greek','turkish','lebanese','vietnamese','brazilian','peruvian','caribbean',
  'german','british','moroccan','ethiopian','philippine','indonesian','russian','polish'
];

// Load recipe files using a sandbox `window.EATRAIL_RECIPES` global.
function loadRecipes() {
  const fakeWindow = { EATRAIL_RECIPES: [] };
  for (const cuisine of CUISINES) {
    const filePath = path.join(RECIPES_DIR, `${cuisine}.js`);
    if (!fs.existsSync(filePath)) {
      console.warn(`  ⚠ missing: ${cuisine}.js`);
      continue;
    }
    const code = fs.readFileSync(filePath, 'utf8');
    // Run code with `window` mapped to our sandbox
    const fn = new Function('window', code);
    fn(fakeWindow);
  }
  return fakeWindow.EATRAIL_RECIPES;
}

function loadShops() {
  if (!fs.existsSync(SHOPS_FILE)) return [];
  const fakeWindow = { EATRAIL_SHOPS: [] };
  const code = fs.readFileSync(SHOPS_FILE, 'utf8');
  new Function('window', code)(fakeWindow);
  return fakeWindow.EATRAIL_SHOPS;
}

function loadImages() {
  if (!fs.existsSync(IMAGES_FILE)) return {};
  const fakeWindow = { EATRAIL_IMAGES: {} };
  const code = fs.readFileSync(IMAGES_FILE, 'utf8');
  try {
    new Function('window', code)(fakeWindow);
  } catch { return {}; }
  return fakeWindow.EATRAIL_IMAGES || {};
}

async function seedRecipes() {
  console.log('→ Loading recipe files…');
  const recipes = loadRecipes();
  const images = loadImages();
  console.log(`  loaded ${recipes.length} recipes, ${Object.keys(images).length} images`);

  let inserted = 0, ingCount = 0, stepCount = 0;

  for (const r of recipes) {
    const orig = r.origin || {};
    const validator = r.validator || {};
    const budget = r.budget || {};

    await prisma.recipe.upsert({
      where: { id: r.id },
      update: {
        title: r.title,
        country: orig.country || 'Inconnu',
        region: orig.region || null,
        flag: orig.flag || null,
        authScore: r.auth ?? 80,
        durationMin: r.duration ?? 30,
        servings: r.servings ?? 4,
        difficulty: r.difficulty ?? 2,
        budgetPerPerson: budget.perPerson ?? 5.0,
        budgetLevel: budget.level || '$$',
        gradient: r.gradient || null,
        summary: r.summary || '',
        story: r.story || null,
        category: r.category || null,
        validatorName: validator.name || null,
        validatorRole: validator.role || null,
        validatorCity: validator.city || null,
        imageUrl: images[r.id] || null,
      },
      create: {
        id: r.id,
        title: r.title,
        country: orig.country || 'Inconnu',
        region: orig.region || null,
        flag: orig.flag || null,
        authScore: r.auth ?? 80,
        durationMin: r.duration ?? 30,
        servings: r.servings ?? 4,
        difficulty: r.difficulty ?? 2,
        budgetPerPerson: budget.perPerson ?? 5.0,
        budgetLevel: budget.level || '$$',
        gradient: r.gradient || null,
        summary: r.summary || '',
        story: r.story || null,
        category: r.category || null,
        validatorName: validator.name || null,
        validatorRole: validator.role || null,
        validatorCity: validator.city || null,
        imageUrl: images[r.id] || null,
      },
    });

    // Replace child rows (delete + recreate, simpler than diffing)
    await prisma.recipeIngredient.deleteMany({ where: { recipeId: r.id } });
    await prisma.recipeStep.deleteMany({ where: { recipeId: r.id } });
    await prisma.recipeDiet.deleteMany({ where: { recipeId: r.id } });
    await prisma.recipeMood.deleteMany({ where: { recipeId: r.id } });
    await prisma.recipeAllergen.deleteMany({ where: { recipeId: r.id } });

    if (Array.isArray(r.ingredients) && r.ingredients.length > 0) {
      await prisma.recipeIngredient.createMany({
        data: r.ingredients.map((ing, i) => ({
          recipeId: r.id,
          position: i,
          name: String(ing.name || '').slice(0, 500),
          qty: typeof ing.qty === 'number' ? ing.qty : null,
          unit: ing.unit ? String(ing.unit).slice(0, 30) : null,
          tags: Array.isArray(ing.tags) ? ing.tags : [],
          isRare: !!ing.rare,
          substitutes: Array.isArray(ing.substitutes) ? ing.substitutes : [],
        })),
      });
      ingCount += r.ingredients.length;
    }

    if (Array.isArray(r.steps) && r.steps.length > 0) {
      await prisma.recipeStep.createMany({
        data: r.steps.map((s, i) => ({
          recipeId: r.id,
          position: i,
          title: String(s.title || `Étape ${i + 1}`).slice(0, 200),
          instruction: String(s.instruction || '').slice(0, 5000),
          timeMin: typeof s.time === 'number' ? s.time : null,
        })),
      });
      stepCount += r.steps.length;
    }

    if (Array.isArray(r.diets) && r.diets.length > 0) {
      await prisma.recipeDiet.createMany({
        data: [...new Set(r.diets)].map(diet => ({ recipeId: r.id, diet: String(diet).slice(0, 40) })),
        skipDuplicates: true,
      });
    }
    if (Array.isArray(r.moods) && r.moods.length > 0) {
      await prisma.recipeMood.createMany({
        data: [...new Set(r.moods)].map(mood => ({ recipeId: r.id, mood: String(mood).slice(0, 40) })),
        skipDuplicates: true,
      });
    }
    if (Array.isArray(r.allergens) && r.allergens.length > 0) {
      await prisma.recipeAllergen.createMany({
        data: [...new Set(r.allergens)].map(a => ({ recipeId: r.id, allergen: String(a).slice(0, 40) })),
        skipDuplicates: true,
      });
    }

    inserted++;
    if (inserted % 50 === 0) process.stdout.write(`\r  recipes: ${inserted}/${recipes.length}     `);
  }
  console.log(`\r  ✓ recipes: ${inserted}, ingredients: ${ingCount}, steps: ${stepCount}        `);
}

async function seedShops() {
  console.log('→ Loading shop file…');
  const shops = loadShops();
  console.log(`  loaded ${shops.length} shops`);
  let inserted = 0;

  for (const s of shops) {
    const coords = s.coords || {};
    await prisma.shop.upsert({
      where: { id: s.id },
      update: {
        name: s.name,
        address: s.address || '',
        neighborhood: s.neighborhood || null,
        lat: coords.lat ?? null,
        lng: coords.lng ?? null,
        type: s.type || null,
        hours: s.hours || null,
        phone: s.phone || null,
        website: s.website || null,
        description: s.story || s.description || null,
        gradient: s.gradient || null,
        imageUrl: s.imageUrl || null,
        authScore: s.auth ?? 80,
        priceLevel: s.priceLevel || '$$',
      },
      create: {
        id: s.id,
        name: s.name,
        address: s.address || '',
        neighborhood: s.neighborhood || null,
        lat: coords.lat ?? null,
        lng: coords.lng ?? null,
        type: s.type || null,
        hours: s.hours || null,
        phone: s.phone || null,
        website: s.website || null,
        description: s.story || s.description || null,
        gradient: s.gradient || null,
        imageUrl: s.imageUrl || null,
        authScore: s.auth ?? 80,
        priceLevel: s.priceLevel || '$$',
      },
    });

    await prisma.shopTag.deleteMany({ where: { shopId: s.id } });
    if (Array.isArray(s.tags) && s.tags.length > 0) {
      await prisma.shopTag.createMany({
        data: [...new Set(s.tags)].map(tag => ({ shopId: s.id, tag: String(tag).slice(0, 40) })),
        skipDuplicates: true,
      });
    }

    await prisma.shopIngredient.deleteMany({ where: { shopId: s.id } });
    if (Array.isArray(s.rareCarried) && s.rareCarried.length > 0) {
      await prisma.shopIngredient.createMany({
        data: [...new Set(s.rareCarried.map(k => String(k).toLowerCase()))].map(keyword => ({
          shopId: s.id, keyword,
        })),
        skipDuplicates: true,
      });
    }
    inserted++;
  }
  console.log(`  ✓ shops: ${inserted}`);
}

async function main() {
  console.log('eatrail · seed start\n');
  console.time('total');
  await seedRecipes();
  await seedShops();

  // Stats
  const [recipeCount, shopCount, userCount] = await Promise.all([
    prisma.recipe.count(),
    prisma.shop.count(),
    prisma.user.count(),
  ]);
  console.log(`\n=== DB STATE ===`);
  console.log(`recipes: ${recipeCount}`);
  console.log(`shops:   ${shopCount}`);
  console.log(`users:   ${userCount}`);
  console.timeEnd('total');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
