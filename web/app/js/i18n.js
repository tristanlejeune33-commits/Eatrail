/* eatrail · i18n module
 * Lightweight translation system. Strings registered as keys in JSON dicts below.
 *
 * Usage in views:
 *   eat.t('home.greeting', { name: 'Léa' })   → "Bonsoir Léa." or "Good evening Léa."
 *
 * Locale stored in localStorage.eatrail.v1.locale (defaults to navigator.language).
 * Toggle via eat.i18n.setLocale('en' | 'fr').
 */
(function () {
  const eat = (window.eat = window.eat || {});
  const STORAGE_KEY = 'eatrail.v1.locale';
  const SUPPORTED = ['fr', 'en'];

  const DICTS = {
    fr: {
      'nav.discover': 'Découvrir',
      'nav.recipes': 'Recettes',
      'nav.shops': 'Magasins',
      'nav.calendar': 'Planning',
      'nav.pantry': 'Provisions',
      'nav.saved': 'Favoris',
      'nav.cart': 'Panier',
      'nav.account': 'Compte',
      'nav.login': 'Se connecter',

      'home.greeting.morning': 'Bonjour',
      'home.greeting.afternoon': 'Bel après-midi',
      'home.greeting.evening': 'Bonsoir',
      'home.cuisine': 'Que cuisinons',
      'home.cta_recipes': 'Parcourir les recettes',
      'home.cta_shops': 'Voir les magasins',

      'recipe.servings': 'pers.',
      'recipe.minutes': 'min',
      'recipe.find_nearby': '📍 Trouver près de moi',
      'recipe.schedule': '📅 Programmer ce repas',
      'recipe.compute_nutrition': '📊 Calculer les valeurs nutritionnelles',
      'recipe.ingredients': 'Ingrédients',
      'recipe.steps': 'Étapes',
      'recipe.reviews': 'Avis',

      'cart.empty.title': 'Ton panier est vide',
      'cart.empty.lead': 'Ouvre une recette et clique sur 🛒 « Ajouter au panier »',
      'cart.browse': 'Parcourir les recettes',

      'pantry.title': 'Tes provisions.',
      'pantry.lead': 'Ajoute ce que tu as déjà à la maison.',
      'pantry.add_placeholder': 'Ex : tomate, riz, ail…',
      'pantry.add_btn': 'Ajouter',
      'pantry.scan': '📸 Scanner mes provisions',
      'pantry.empty': 'Aucune provision. Ajoute les ingrédients que tu as à la maison.',

      'calendar.title': 'Calendrier de repas',
      'calendar.lead': 'Programme tes recettes pour la semaine.',
      'calendar.shopping_list': '📋 Liste de courses de la semaine',
      'calendar.clear_week': '🗑 Vider la semaine',
      'calendar.today': 'Aujourd\'hui',
      'calendar.tomorrow': 'Demain',
      'calendar.slot.breakfast': 'Petit-déj',
      'calendar.slot.lunch': 'Déjeuner',
      'calendar.slot.dinner': 'Dîner',
      'calendar.slot.snack': 'Snack',

      'shops.title': 'Magasins',
      'shops.geo_enable': '📍 Activer ma position',
      'shops.geo_default': 'NYC par défaut',
      'shops.geo_refresh': '🔄 Actualiser',

      'auth.login': 'Se connecter',
      'auth.signup': 'Créer un compte',
      'auth.logout': 'Se déconnecter',
      'auth.email': 'Email',
      'auth.password': 'Mot de passe',
      'auth.name': 'Prénom',

      'common.loading': 'Chargement…',
      'common.error': 'Erreur',
      'common.cancel': 'Annuler',
      'common.confirm': 'Confirmer',
      'common.save': 'Enregistrer',
      'common.delete': 'Supprimer',
      'common.back': '← Retour',
    },

    en: {
      'nav.discover': 'Discover',
      'nav.recipes': 'Recipes',
      'nav.shops': 'Shops',
      'nav.calendar': 'Planner',
      'nav.pantry': 'Pantry',
      'nav.saved': 'Favorites',
      'nav.cart': 'Cart',
      'nav.account': 'Account',
      'nav.login': 'Sign in',

      'home.greeting.morning': 'Good morning',
      'home.greeting.afternoon': 'Good afternoon',
      'home.greeting.evening': 'Good evening',
      'home.cuisine': 'What are we cooking',
      'home.cta_recipes': 'Browse recipes',
      'home.cta_shops': 'See shops',

      'recipe.servings': 'pers.',
      'recipe.minutes': 'min',
      'recipe.find_nearby': '📍 Find nearby',
      'recipe.schedule': '📅 Schedule this meal',
      'recipe.compute_nutrition': '📊 Compute nutrition info',
      'recipe.ingredients': 'Ingredients',
      'recipe.steps': 'Steps',
      'recipe.reviews': 'Reviews',

      'cart.empty.title': 'Your cart is empty',
      'cart.empty.lead': 'Open a recipe and click 🛒 « Add to cart »',
      'cart.browse': 'Browse recipes',

      'pantry.title': 'Your pantry.',
      'pantry.lead': 'Add what you already have at home.',
      'pantry.add_placeholder': 'E.g. tomato, rice, garlic…',
      'pantry.add_btn': 'Add',
      'pantry.scan': '📸 Scan my pantry',
      'pantry.empty': 'Empty. Add ingredients you have at home.',

      'calendar.title': 'Meal planner',
      'calendar.lead': 'Schedule your recipes for the week.',
      'calendar.shopping_list': '📋 Weekly shopping list',
      'calendar.clear_week': '🗑 Clear week',
      'calendar.today': 'Today',
      'calendar.tomorrow': 'Tomorrow',
      'calendar.slot.breakfast': 'Breakfast',
      'calendar.slot.lunch': 'Lunch',
      'calendar.slot.dinner': 'Dinner',
      'calendar.slot.snack': 'Snack',

      'shops.title': 'Shops',
      'shops.geo_enable': '📍 Enable my location',
      'shops.geo_default': 'Default to NYC',
      'shops.geo_refresh': '🔄 Refresh',

      'auth.login': 'Sign in',
      'auth.signup': 'Sign up',
      'auth.logout': 'Sign out',
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.name': 'First name',

      'common.loading': 'Loading…',
      'common.error': 'Error',
      'common.cancel': 'Cancel',
      'common.confirm': 'Confirm',
      'common.save': 'Save',
      'common.delete': 'Delete',
      'common.back': '← Back',
    },
  };

  function detect() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.includes(saved)) return saved;
    } catch {}
    const nav = (navigator.language || navigator.userLanguage || 'fr').slice(0, 2).toLowerCase();
    return SUPPORTED.includes(nav) ? nav : 'fr';
  }

  let currentLocale = detect();

  eat.i18n = {
    SUPPORTED,
    locale: () => currentLocale,
    setLocale(loc) {
      if (!SUPPORTED.includes(loc)) return false;
      currentLocale = loc;
      try { localStorage.setItem(STORAGE_KEY, loc); } catch {}
      document.documentElement.lang = loc;
      return true;
    },
  };

  eat.t = function (key, vars) {
    const dict = DICTS[currentLocale] || DICTS.fr;
    let str = dict[key] || DICTS.fr[key] || key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(new RegExp('\\{' + k + '\\}', 'g'), String(v));
      }
    }
    return str;
  };

  document.documentElement.lang = currentLocale;
})();
