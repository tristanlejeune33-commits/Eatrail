/* eatrail · v1.3 — Préférences utilisateur + moteur de scoring
 *
 * Source de vérité pour : régimes, allergies, aversions, cuisines aimées,
 * tolérance épicé, niveau cuisinier, foyer, budget hebdo, temps dispo,
 * équipement, code postal — collectés via l'onboarding 5 écrans.
 *
 * Stockage : eatrail.v1.prefs.<accountId>  (scopé par compte)
 *            eatrail.v1.prefs               (anonyme si pas connecté)
 *
 * API publique : window.eat.prefs.{...}
 */

window.eat = window.eat || {};

(function (eat) {
  'use strict';

  const LS_PREFS = 'eatrail.v1.prefs';

  // ─────────────────────────────────────────────────────────
  // Constantes : listes affichables dans l'UI
  // ─────────────────────────────────────────────────────────

  /** Régimes (déjà utilisés dans recipes.diets, on garde la cohérence). */
  eat.prefs = eat.prefs || {};
  eat.prefs.DIETS = [
    { id: 'vegetarian',     label: 'Végétarien',     emoji: '🥗' },
    { id: 'vegan',          label: 'Vegan',          emoji: '🌱' },
    { id: 'pescatarian',    label: 'Pescetarian',    emoji: '🐟' },
    { id: 'gluten-free',    label: 'Sans gluten',    emoji: '🌾' },
    { id: 'dairy-free',     label: 'Sans lactose',   emoji: '🥛' },
    { id: 'halal-friendly', label: 'Halal',          emoji: '🕌' },
    { id: 'kosher',         label: 'Kasher',         emoji: '✡' }
  ];

  /** Allergènes : sévérité par défaut "strict" si coché. */
  eat.prefs.ALLERGENS = [
    { id: 'gluten',         label: 'Gluten',          emoji: '🌾' },
    { id: 'lait',           label: 'Lactose',         emoji: '🥛' },
    { id: 'œufs',           label: 'Œufs',            emoji: '🥚' },
    { id: 'soja',           label: 'Soja',            emoji: '🫘' },
    { id: 'sésame',         label: 'Sésame',          emoji: '🌰' },
    { id: 'arachides',      label: 'Arachides',       emoji: '🥜' },
    { id: 'fruits à coque', label: 'Fruits à coque',  emoji: '🌰' },
    { id: 'poisson',        label: 'Poisson',         emoji: '🐟' },
    { id: 'crustacés',      label: 'Crustacés',       emoji: '🦐' },
    { id: 'mollusques',     label: 'Mollusques',      emoji: '🦑' }
  ];

  /** Cuisines : v1.5 — 25 grandes cuisines mondiales. */
  eat.prefs.CUISINES = [
    { id: 'Italie',       label: 'Italie',        flag: '🇮🇹' },
    { id: 'France',       label: 'France',        flag: '🇫🇷' },
    { id: 'États-Unis',   label: 'États-Unis',    flag: '🇺🇸' },
    { id: 'Mexique',      label: 'Mexique',       flag: '🇲🇽' },
    { id: 'Japon',        label: 'Japon',         flag: '🇯🇵' },
    { id: 'Chine',        label: 'Chine',         flag: '🇨🇳' },
    { id: 'Inde',         label: 'Inde',          flag: '🇮🇳' },
    { id: 'Thaïlande',    label: 'Thaïlande',     flag: '🇹🇭' },
    { id: 'Corée',        label: 'Corée',         flag: '🇰🇷' },
    { id: 'Espagne',      label: 'Espagne',       flag: '🇪🇸' },
    { id: 'Grèce',        label: 'Grèce',         flag: '🇬🇷' },
    { id: 'Turquie',      label: 'Turquie',       flag: '🇹🇷' },
    { id: 'Liban',        label: 'Liban',         flag: '🇱🇧' },
    { id: 'Vietnam',      label: 'Vietnam',       flag: '🇻🇳' },
    { id: 'Brésil',       label: 'Brésil',        flag: '🇧🇷' },
    { id: 'Pérou',        label: 'Pérou',         flag: '🇵🇪' },
    { id: 'Caraïbes',     label: 'Caraïbes',      flag: '🇯🇲' },
    { id: 'Allemagne',    label: 'Allemagne',     flag: '🇩🇪' },
    { id: 'Royaume-Uni',  label: 'Royaume-Uni',   flag: '🇬🇧' },
    { id: 'Maroc',        label: 'Maroc',         flag: '🇲🇦' },
    { id: 'Éthiopie',     label: 'Éthiopie',      flag: '🇪🇹' },
    { id: 'Philippines',  label: 'Philippines',   flag: '🇵🇭' },
    { id: 'Indonésie',    label: 'Indonésie',     flag: '🇮🇩' },
    { id: 'Russie',       label: 'Russie',        flag: '🇷🇺' },
    { id: 'Pologne',      label: 'Pologne',       flag: '🇵🇱' }
  ];

  /** Niveaux cuisinier (1..4). */
  eat.prefs.COOKING_LEVELS = [
    { id: 1, label: 'Curieux',   desc: 'Recettes simples, étapes détaillées', emoji: '🌱' },
    { id: 2, label: 'Régulier',  desc: 'Plusieurs fois par semaine',          emoji: '🍳' },
    { id: 3, label: 'Confirmé',  desc: 'À l\'aise avec techniques',            emoji: '👨‍🍳' },
    { id: 4, label: 'Chef',      desc: 'Rien ne me fait peur',                 emoji: '🏆' }
  ];

  /** Tolérance épicé (0..5). */
  eat.prefs.SPICE_LABELS = [
    'Pas du tout', 'Doux uniquement', 'Moyen accepté',
    'J\'aime le piquant', 'Très épicé bienvenu', 'Brûle-moi'
  ];

  /**
   * Moods / styles de cuisine (multi-select, soft preference).
   * Les ids matchent les valeurs `recipe.moods` (voir web/app/data/recipes/*.js).
   */
  eat.prefs.MOODS = [
    { id: 'healthy',  label: 'Sain & léger',    emoji: '🥦', desc: 'Veggies, protéines, peu gras' },
    { id: 'gourmand', label: 'Gourmand',        emoji: '🤤', desc: 'On se fait plaisir, sans culpabiliser' },
    { id: 'comfort',  label: 'Réconfortant',    emoji: '🍲', desc: 'Plats qui te font du bien' },
    { id: 'quick',    label: 'Rapide',          emoji: '⚡', desc: '< 30 min, semaine chargée' },
    { id: 'festive',  label: 'Festif',          emoji: '🎉', desc: 'Pour recevoir, week-end' },
    { id: 'wow',      label: 'Wow',             emoji: '✨', desc: 'Plat impressionnant' },
    { id: 'street',   label: 'Street food',     emoji: '🌮', desc: 'Authentique, à la main' },
    { id: 'spicy',    label: 'Épicé',           emoji: '🌶️', desc: 'Ça pique' },
  ];

  /** Équipement de cuisine (multi-select). */
  eat.prefs.EQUIPMENT = [
    { id: 'wok',      label: 'Wok / poêle',          emoji: '🍳' },
    { id: 'oven',     label: 'Four',                  emoji: '🔥' },
    { id: 'cocotte',  label: 'Cocotte fonte',        emoji: '🥘' },
    { id: 'blender',  label: 'Mixeur / blender',     emoji: '🌀' },
    { id: 'slow',     label: 'Mijoteuse',             emoji: '🍲' },
    { id: 'standmix', label: 'Robot pâtissier',       emoji: '🍞' },
    { id: 'knife',    label: 'Bon couteau',           emoji: '🔪' },
    { id: 'mandolin', label: 'Mandoline',             emoji: '🥒' },
    { id: 'thermo',   label: 'Thermomètre',          emoji: '🌡' },
    { id: 'grill',    label: 'Plancha / grill',       emoji: '🥩' }
  ];

  /** Tranches de budget hebdo (USD pour la cuisine). */
  eat.prefs.BUDGET_STEPS = [30, 60, 100, 150, 200, 300];

  /** Tranches de temps semaine (minutes). */
  eat.prefs.TIME_STEPS = [15, 30, 45, 60, 90];

  /** Plats représentatifs pour le swipe goûts (étape 3 onboarding). */
  eat.prefs.SAMPLE_PLATES = [
    'bibimbap', 'cochinita-pibil', 'pho-bo', 'tagine-poulet-citron',
    'hummus-pita', 'khachapuri-adjarian'
  ];

  // ─────────────────────────────────────────────────────────
  // Storage : valeurs par défaut + read/write scopés
  // ─────────────────────────────────────────────────────────

  function defaults() {
    return {
      diets: [],
      allergens: {},        // { 'gluten': 'strict'|'soft' }
      dislikes: [],         // ['coriandre', ...]
      cuisines: [],         // ['Corée', 'Mexique', ...]
      cuisineWeights: {},   // { 'Corée': 2, 'Mexique': 1 } — implicite via swipe
      moods: [],            // ['healthy', 'gourmand', ...]  soft preference
      spiceTolerance: 2,
      cookingLevel: 2,
      household: { adults: 2, kids: 0 },
      weeklyBudget: 100,
      weeknightMinutes: 30,
      equipment: [],
      zip: '10018',
      onboardingCompleted: false,
      onboardingStep: 1,
      updatedAt: null
    };
  }

  function scopedKey() {
    const u = (eat.auth && eat.auth.current && eat.auth.current()) || null;
    return u ? LS_PREFS + '.' + u.id : LS_PREFS;
  }

  function readPrefs() {
    try {
      const raw = localStorage.getItem(scopedKey());
      if (!raw) return defaults();
      return Object.assign(defaults(), JSON.parse(raw));
    } catch { return defaults(); }
  }
  function writePrefs(obj) {
    try {
      obj.updatedAt = new Date().toISOString();
      localStorage.setItem(scopedKey(), JSON.stringify(obj));
    } catch {}
  }

  /** Lecture complète (deep copy défensif). */
  eat.prefs.get = () => JSON.parse(JSON.stringify(readPrefs()));

  /** Patch partiel (merge top-level + persist). */
  eat.prefs.patch = function (partial) {
    const cur = readPrefs();
    const next = Object.assign({}, cur, partial || {});
    writePrefs(next);
    document.dispatchEvent(new CustomEvent('eat:prefs:change', { detail: next }));
    return next;
  };

  /** Reset à zéro. */
  eat.prefs.reset = function () {
    writePrefs(defaults());
    document.dispatchEvent(new CustomEvent('eat:prefs:change', { detail: defaults() }));
  };

  // ─────────────────────────────────────────────────────────
  // États dérivés
  // ─────────────────────────────────────────────────────────

  /** L'onboarding doit-il être proposé ? */
  eat.prefs.isOnboardingNeeded = function () {
    if (!eat.auth || !eat.auth.isAuthenticated()) return false;
    return !readPrefs().onboardingCompleted;
  };

  /** Étape de reprise (1..5). */
  eat.prefs.onboardingResumeStep = () => Math.max(1, Math.min(5, readPrefs().onboardingStep || 1));

  /** Marque l'onboarding comme terminé (skip ou validation). */
  eat.prefs.completeOnboarding = (skipped) => {
    eat.prefs.patch({ onboardingCompleted: true, onboardingStep: 5, onboardingSkipped: !!skipped });
  };

  // ─────────────────────────────────────────────────────────
  // Filtrage par allergènes (strict vs soft)
  // ─────────────────────────────────────────────────────────

  /**
   * Pour une recette donnée, retourne :
   *   'block' → contient un allergène marqué strict (à cacher)
   *   'warn'  → contient un allergène marqué soft (à afficher avec warning)
   *   'ok'    → aucune intersection
   */
  eat.prefs.matchesAllergens = function (recipe) {
    const al = readPrefs().allergens || {};
    const hits = (recipe.allergens || []).filter(a => al[a]);
    if (!hits.length) return { status: 'ok', hits: [] };
    const strict = hits.filter(h => al[h] === 'strict');
    if (strict.length) return { status: 'block', hits: strict };
    return { status: 'warn', hits };
  };

  /** True si la recette respecte tous les régimes activés. */
  eat.prefs.matchesDiet = function (recipe) {
    const diets = readPrefs().diets || [];
    if (!diets.length) return true;
    const recipeDiets = new Set(recipe.diets || []);
    // Pour chaque régime activé : la recette doit l'inclure
    return diets.every(d => recipeDiets.has(d));
  };

  /** True si un dislike est présent dans les noms d'ingrédients. */
  eat.prefs.containsDislike = function (recipe) {
    const dislikes = readPrefs().dislikes || [];
    if (!dislikes.length) return false;
    const ingNames = (recipe.ingredients || []).map(i => i.name.toLowerCase());
    return dislikes.some(d => {
      const dl = String(d).toLowerCase().trim();
      return dl && ingNames.some(n => n.includes(dl));
    });
  };

  // ─────────────────────────────────────────────────────────
  // Scoring : moteur de recommandation v1.3
  // ─────────────────────────────────────────────────────────

  /**
   * Score de match d'une recette avec les préférences (0..100).
   * 0 = bloquée, 100 = match parfait.
   *
   * Composantes :
   *  - HARD : régime non-respecté → 0
   *  - HARD : allergène strict → 0
   *  - HARD : dislike présent → 0
   *  - SOFT : cuisine aimée → +20
   *  - SOFT : cuisine implicite via swipe → +bonus*pondéré
   *  - SOFT : difficulté ≤ niveau → bonus, > pénalité
   *  - SOFT : durée ≤ tempsDispo → bonus si quick & user prefs court
   *  - SOFT : épicé ≤ tolérance → bonus, > pénalité
   *  - SOFT : équipement requis dispo → bonus
   *  - SOFT : budget par pers OK → bonus
   *  - SOFT : authenticity recipe (boost universel)
   */
  eat.prefs.scoreRecipe = function (recipe) {
    const p = readPrefs();
    let score = 50; // base

    // ── HARD blockers ────────────────────────────────
    const al = eat.prefs.matchesAllergens(recipe);
    if (al.status === 'block') return 0;
    if (!eat.prefs.matchesDiet(recipe)) return 0;
    if (eat.prefs.containsDislike(recipe)) return 0;

    // soft warning sur allergène : -10
    if (al.status === 'warn') score -= 10;

    // ── Cuisines aimées ──────────────────────────────
    const cuisinesSet = new Set(p.cuisines || []);
    if (cuisinesSet.has(recipe.origin.country)) score += 20;
    const w = (p.cuisineWeights || {})[recipe.origin.country] || 0;
    score += w * 6; // chaque "j'aime" sur swipe = +6

    // ── Moods aimés (healthy / gourmand / comfort / etc.) ──
    const userMoods = new Set(p.moods || []);
    if (userMoods.size > 0) {
      const recipeMoods = new Set(recipe.moods || []);
      let moodHits = 0;
      userMoods.forEach(m => { if (recipeMoods.has(m)) moodHits++; });
      score += moodHits * 8;  // chaque mood matché = +8
    }

    // ── Difficulté vs niveau cuisinier ───────────────
    const lvlGap = recipe.difficulty - (p.cookingLevel || 2);
    if (lvlGap <= 0) score += 6;       // recette accessible
    else if (lvlGap === 1) score -= 4; // un cran au-dessus
    else score -= 12;                   // 2 crans au-dessus

    // ── Durée vs temps dispo (en semaine) ────────────
    if (recipe.duration <= (p.weeknightMinutes || 30)) score += 8;
    else if (recipe.duration <= 60) score -= 0;
    else if (recipe.duration <= 120) score -= 5;
    else score -= 12;

    // ── Tolérance épicé ──────────────────────────────
    const isSpicy = (recipe.moods || []).includes('spicy');
    if (isSpicy) {
      const tol = p.spiceTolerance || 2;
      if (tol <= 1) score -= 15;
      else if (tol === 2) score -= 4;
      else if (tol >= 4) score += 8;
    } else if ((p.spiceTolerance || 2) >= 4) {
      score -= 2; // léger malus pour l'amateur de feu sur une recette douce
    }

    // ── Budget : ration ration estimée ──────────────
    const mealCost = recipe.budget.perPerson * recipe.servings;
    const weeklyBudget = p.weeklyBudget || 100;
    if (mealCost > weeklyBudget * 0.6) score -= 10; // plus de 60% du budget hebdo
    else if (mealCost < weeklyBudget * 0.15) score += 4;

    // ── Authenticity (qualité globale) ───────────────
    score += (recipe.auth - 80) * 0.3;

    // Clamp
    return Math.max(0, Math.min(100, Math.round(score)));
  };

  /**
   * Filtre une liste de recettes selon les prefs.
   * opts = { applyHard: bool, applySoft: bool, sortByScore: bool }
   *   applyHard : exclut les recettes bloquées (default: true)
   *   sortByScore : tri décroissant (default: false)
   */
  eat.prefs.filterRecipes = function (recipes, opts) {
    opts = opts || {};
    const applyHard = opts.applyHard !== false;
    const sort = !!opts.sortByScore;

    let out = recipes.slice();
    if (applyHard) {
      out = out.filter(r => eat.prefs.scoreRecipe(r) > 0);
    }
    if (sort) {
      out = out
        .map(r => ({ r, s: eat.prefs.scoreRecipe(r) }))
        .sort((a, b) => b.s - a.s)
        .map(x => x.r);
    }
    return out;
  };

  /** True si l'utilisateur a au moins une préférence active (non vide). */
  eat.prefs.hasActivePrefs = function () {
    const p = readPrefs();
    return (p.diets && p.diets.length) ||
           (p.allergens && Object.keys(p.allergens).length) ||
           (p.dislikes && p.dislikes.length) ||
           (p.cuisines && p.cuisines.length);
  };

  /** Compte de filtres actifs (pour affichage indicateur). */
  eat.prefs.activeFilterCount = function () {
    const p = readPrefs();
    return (p.diets || []).length
         + Object.keys(p.allergens || {}).length
         + (p.dislikes || []).length
         + (p.cuisines || []).length;
  };

})(window.eat);
