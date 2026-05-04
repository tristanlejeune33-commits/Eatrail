/* eatrail · v1 — utils
 * Helpers transverses : escape HTML, formatage, recherche, trail optimizer.
 * Pas de framework, namespace global window.eat.
 */

window.eat = window.eat || {};

(function (eat) {
  'use strict';

  /** Échappe pour insertion safe dans innerHTML. */
  eat.esc = function (str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };

  /** Formate une durée en minutes vers "1 h 25" / "45 min" / "12 h". */
  eat.fmtDuration = function (mins) {
    if (mins < 60) return mins + ' min';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m === 0 ? h + ' h' : h + ' h ' + (m < 10 ? '0' + m : m);
  };

  /** Niveau de difficulté en label. */
  eat.fmtDifficulty = function (lvl) {
    return ({ 1: 'Facile', 2: 'Moyen', 3: 'Technique' })[lvl] || '—';
  };

  /** Somme des minutes des steps (pour vérification ou affichage). */
  eat.sumStepTime = function (steps) {
    return (steps || []).reduce((s, st) => s + (st.time || 0), 0);
  };

  /** Nombre d'ingrédients rares dans une recette. */
  eat.countRare = function (recipe) {
    return (recipe.ingredients || []).filter(i => i.rare).length;
  };

  /** Toutes les recettes (raccourci). */
  eat.allRecipes = () => window.EATRAIL_RECIPES || [];
  eat.allShops = () => window.EATRAIL_SHOPS || [];

  /** Lookup par id. */
  eat.recipeById = (id) => eat.allRecipes().find(r => r.id === id);
  eat.shopById = (id) => eat.allShops().find(s => s.id === id);

  /** Recettes uniques par origine (pour landing). */
  eat.uniqueOrigins = function () {
    const seen = new Set();
    const out = [];
    for (const r of eat.allRecipes()) {
      if (!seen.has(r.origin.country)) {
        seen.add(r.origin.country);
        out.push(r.origin);
      }
    }
    return out;
  };

  /**
   * Recherche / filtre recettes.
   * filters = { q?, country?, mood?, diet?, maxDuration?, maxBudget? }
   */
  eat.searchRecipes = function (filters) {
    filters = filters || {};
    const q = (filters.q || '').toLowerCase().trim();
    return eat.allRecipes().filter(r => {
      if (q) {
        const hay = (r.title + ' ' + r.origin.country + ' ' + r.origin.region + ' ' + r.summary).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filters.country && r.origin.country !== filters.country) return false;
      if (filters.mood && !(r.moods || []).includes(filters.mood)) return false;
      if (filters.diet && !(r.diets || []).includes(filters.diet)) return false;
      if (filters.maxDuration && r.duration > filters.maxDuration) return false;
      if (filters.maxBudget && r.budget.perPerson > filters.maxBudget) return false;
      return true;
    });
  };

  /**
   * Pour un ingrédient donné, retourne les magasins candidats classés par pertinence.
   * Pertinence = match de tags + bonus si rareCarried + score d'authenticité - distance.
   */
  eat.shopsForIngredient = function (ingredient) {
    const ingTags = new Set(ingredient.tags || []);
    const candidates = [];
    for (const shop of eat.allShops()) {
      const shopTags = new Set(shop.tags || []);
      let tagOverlap = 0;
      for (const t of ingTags) if (shopTags.has(t)) tagOverlap++;
      if (tagOverlap === 0) continue;
      const carriesRare = (shop.rareCarried || []).includes(ingredient.name);
      const isRareIng = !!ingredient.rare;
      // si ingrédient rare ET magasin ne le porte pas explicitement, pénaliser
      if (isRareIng && !carriesRare && shop.type === 'supermarket') continue;
      const score =
        tagOverlap * 12 +
        (carriesRare ? 30 : 0) +
        shop.auth * 0.4 -
        shop.distMi * 6;
      candidates.push({ shop, score, carriesRare, tagOverlap });
    }
    return candidates.sort((a, b) => b.score - a.score);
  };

  /**
   * Trail optimizer — pour une recette, regroupe les ingrédients en stops.
   *
   * Algorithme greedy en 3 passes :
   *  1) Pour chaque ingrédient rare → meilleur magasin (priorité auth).
   *  2) Pour chaque ingrédient restant → tente de le caser dans un magasin déjà choisi
   *     (qui a les bons tags), sinon nouveau stop.
   *  3) Tri final des stops par distance croissante.
   *
   * Retourne : { stops: [{shop, items: [...ing]}], totalShops, totalMi, totalWalkMin, totalCost }
   */
  eat.buildTrail = function (recipe) {
    const stopsByShop = new Map();
    const ensureStop = (shop) => {
      if (!stopsByShop.has(shop.id)) stopsByShop.set(shop.id, { shop, items: [] });
      return stopsByShop.get(shop.id);
    };

    const remaining = [...recipe.ingredients];

    // pass 1 : ingrédients rares
    const rare = remaining.filter(i => i.rare);
    for (const ing of rare) {
      const cands = eat.shopsForIngredient(ing);
      if (cands.length) ensureStop(cands[0].shop).items.push(ing);
    }

    // pass 2 : ingrédients communs
    const common = remaining.filter(i => !i.rare);
    for (const ing of common) {
      // tenter d'utiliser un stop existant qui couvre cet ingrédient
      let placed = false;
      for (const stop of stopsByShop.values()) {
        const shopTags = new Set(stop.shop.tags || []);
        const ok = (ing.tags || []).some(t => shopTags.has(t));
        if (ok) {
          stop.items.push(ing);
          placed = true;
          break;
        }
      }
      if (!placed) {
        const cands = eat.shopsForIngredient(ing);
        if (cands.length) ensureStop(cands[0].shop).items.push(ing);
      }
    }

    // tri par distance, calcul totaux
    const stops = [...stopsByShop.values()]
      .filter(s => s.items.length > 0)
      .sort((a, b) => a.shop.distMi - b.shop.distMi);

    const totalMi = stops.reduce((s, st) => s + st.shop.distMi, 0);
    const totalWalkMin = stops.reduce((s, st) => s + (st.shop.walkMin || 0), 0);
    const totalCost = recipe.budget.perPerson * recipe.servings;

    return {
      stops,
      totalShops: stops.length,
      totalMi: Math.round(totalMi * 10) / 10,
      totalWalkMin,
      totalCost: Math.round(totalCost * 100) / 100
    };
  };

  /**
   * Ajuste les quantités d'une recette à un nouveau nombre de servings.
   * Retourne une copie de la liste d'ingrédients avec quantités scalées.
   */
  eat.scaleIngredients = function (recipe, newServings) {
    const ratio = newServings / recipe.servings;
    return recipe.ingredients.map(ing => ({
      ...ing,
      qty: typeof ing.qty === 'number'
        ? Math.round(ing.qty * ratio * 100) / 100
        : ing.qty
    }));
  };

  // ── Persistance locale (saved + pantry) ────────────────
  // v1.2 : si un compte est connecté, on suffixe la clé avec son id pour
  // isolation. Sinon, on garde les clés "anonymes" (mode visiteur).
  const LS_SAVED = 'eatrail.v1.saved';
  const LS_PANTRY = 'eatrail.v1.pantry';

  /** Suffixe la clé par account.id si connecté, sinon clé brute. */
  function scopedKey(base) {
    const u = (eat.auth && eat.auth.current && eat.auth.current()) || null;
    return u ? base + '.' + u.id : base;
  }

  function safeRead(key) {
    try { return JSON.parse(localStorage.getItem(scopedKey(key)) || '[]'); }
    catch { return []; }
  }
  function safeWrite(key, val) {
    try { localStorage.setItem(scopedKey(key), JSON.stringify(val)); } catch {}
  }

  eat.savedIds = () => safeRead(LS_SAVED);
  eat.isSaved = (id) => eat.savedIds().includes(id);
  eat.toggleSave = function (id) {
    const list = eat.savedIds();
    const idx = list.indexOf(id);
    if (idx >= 0) list.splice(idx, 1); else list.push(id);
    safeWrite(LS_SAVED, list);
    // v1.8 — fire-and-forget API sync if logged in
    if (eat.api && eat.api.currentUser) {
      eat.api.favorites.toggle(id).catch(e => console.warn('[sync] favorites toggle:', e.message));
    }
    return idx < 0; // true si ajouté
  };

  eat.pantry = () => safeRead(LS_PANTRY);
  eat.pantryAdd = function (item) {
    const norm = String(item).trim().toLowerCase();
    if (!norm) return;
    const list = eat.pantry();
    if (!list.includes(norm)) list.push(norm);
    safeWrite(LS_PANTRY, list);
    // v1.8 — fire-and-forget API sync
    if (eat.api && eat.api.currentUser) {
      eat.api.pantry.add(norm).catch(e => console.warn('[sync] pantry add:', e.message));
    }
  };
  eat.pantryRemove = function (item) {
    const list = eat.pantry().filter(x => x !== item);
    safeWrite(LS_PANTRY, list);
    // v1.8 — fire-and-forget API sync
    if (eat.api && eat.api.currentUser) {
      eat.api.pantry.removeByName(String(item).toLowerCase()).catch(e => console.warn('[sync] pantry remove:', e.message));
    }
  };

  // ── v1.7 — Meal planner (localStorage fallback + API sync) ──
  const LS_MEAL_PLAN = 'eatrail.v1.meal_plan';
  const SLOTS = ['BREAKFAST','LUNCH','DINNER','SNACK'];

  // Local meal plan helpers (work offline / when not logged in)
  function readPlans() {
    try { return JSON.parse(localStorage.getItem(LS_MEAL_PLAN) || '[]'); }
    catch { return []; }
  }
  function writePlans(plans) {
    try { localStorage.setItem(LS_MEAL_PLAN, JSON.stringify(plans)); }
    catch {}
  }
  function uid() { return 'local-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8); }

  eat.mealPlan = {
    SLOTS,
    SLOT_LABELS: { BREAKFAST: 'Petit-déj', LUNCH: 'Déjeuner', DINNER: 'Dîner', SNACK: 'Snack' },
    SLOT_EMOJI:  { BREAKFAST: '🍳',          LUNCH: '🥗',       DINNER: '🍽',     SNACK: '🍪' },

    // List local plans in date range (inclusive). Dates are ISO YYYY-MM-DD strings.
    listLocal(from, to) {
      const plans = readPlans();
      return plans
        .filter(p => p.date >= from && p.date <= to)
        .sort((a, b) => a.date.localeCompare(b.date) || SLOTS.indexOf(a.slot) - SLOTS.indexOf(b.slot) || (a.position || 0) - (b.position || 0));
    },

    addLocal({ recipeId, date, slot, servings = 2, notes = null }) {
      const plans = readPlans();
      const sameSlot = plans.filter(p => p.date === date && p.slot === slot);
      const position = sameSlot.length;
      const plan = {
        id: uid(), recipeId, date, slot, servings, notes,
        position, status: 'PLANNED',
        createdAt: new Date().toISOString(),
      };
      plans.push(plan);
      writePlans(plans);
      return plan;
    },

    updateLocal(id, patch) {
      const plans = readPlans();
      const idx = plans.findIndex(p => p.id === id);
      if (idx === -1) return null;
      plans[idx] = { ...plans[idx], ...patch, updatedAt: new Date().toISOString() };
      writePlans(plans);
      return plans[idx];
    },

    removeLocal(id) {
      const plans = readPlans().filter(p => p.id !== id);
      writePlans(plans);
    },

    clearLocal() {
      try { localStorage.removeItem(LS_MEAL_PLAN); } catch {}
    },

    // Aggregate ingredients across local plans in range
    shoppingListLocal(from, to) {
      const plans = eat.mealPlan.listLocal(from, to).filter(p => p.status === 'PLANNED');
      const agg = new Map();
      for (const p of plans) {
        const recipe = eat.recipeById(p.recipeId);
        if (!recipe) continue;
        const scale = (p.servings || recipe.servings) / Math.max(1, recipe.servings);
        for (const ing of recipe.ingredients || []) {
          const key = (ing.name || '').toLowerCase() + '|' + (ing.unit || '');
          if (!agg.has(key)) {
            agg.set(key, { name: ing.name, unit: ing.unit, qty: 0, tags: ing.tags || [], isRare: !!ing.rare, sources: [] });
          }
          const e = agg.get(key);
          if (typeof ing.qty === 'number') e.qty += ing.qty * scale;
          e.sources.push({ recipeId: recipe.id, title: recipe.title, plannedDate: p.date, slot: p.slot });
        }
      }
      return [...agg.values()].map(e => ({ ...e, qty: e.qty ? Number(e.qty.toFixed(2)) : null }))
        .sort((a, b) => a.isRare !== b.isRare ? (a.isRare ? -1 : 1) : a.name.localeCompare(b.name));
    },

    // ─── Hybrid API + local methods ───────────────────────
    // Prefer API when logged in, fallback to localStorage otherwise.

    async list(from, to) {
      if (eat.api && eat.api.isOnline && eat.api.currentUser) {
        try { return (await eat.api.mealPlan.list(from, to)).items; }
        catch (e) { console.warn('[mealPlan] API list failed, fallback local:', e.message); }
      }
      return eat.mealPlan.listLocal(from, to);
    },

    async add(payload) {
      if (eat.api && eat.api.isOnline && eat.api.currentUser) {
        try { return (await eat.api.mealPlan.create(payload.recipeId, payload.date, payload.slot, payload.servings, payload.notes)).plan; }
        catch (e) { console.warn('[mealPlan] API add failed, fallback local:', e.message); }
      }
      return eat.mealPlan.addLocal(payload);
    },

    async update(id, patch) {
      if (eat.api && eat.api.isOnline && eat.api.currentUser && !id.startsWith('local-')) {
        try { return (await eat.api.mealPlan.update(id, patch)).plan; }
        catch (e) { console.warn('[mealPlan] API update failed, fallback local:', e.message); }
      }
      return eat.mealPlan.updateLocal(id, patch);
    },

    async remove(id) {
      if (eat.api && eat.api.isOnline && eat.api.currentUser && !id.startsWith('local-')) {
        try { await eat.api.mealPlan.remove(id); return; }
        catch (e) { console.warn('[mealPlan] API remove failed, fallback local:', e.message); }
      }
      eat.mealPlan.removeLocal(id);
    },

    async shoppingList(from, to) {
      if (eat.api && eat.api.isOnline && eat.api.currentUser) {
        try { return await eat.api.mealPlan.shoppingList(from, to); }
        catch (e) { console.warn('[mealPlan] API shopping list failed, fallback local:', e.message); }
      }
      return { items: eat.mealPlan.shoppingListLocal(from, to), range: { from, to } };
    },

    // ─── Date helpers (week navigation) ───────────────────
    todayISO() {
      const d = new Date();
      return d.toISOString().slice(0, 10);
    },

    // Returns Monday of the week containing `dateISO`
    weekStart(dateISO) {
      const d = new Date(dateISO + 'T00:00:00');
      const day = d.getDay();             // 0 = Sun
      const diff = (day === 0 ? -6 : 1 - day);
      d.setDate(d.getDate() + diff);
      return d.toISOString().slice(0, 10);
    },

    weekEnd(dateISO) {
      const d = new Date(eat.mealPlan.weekStart(dateISO) + 'T00:00:00');
      d.setDate(d.getDate() + 6);
      return d.toISOString().slice(0, 10);
    },

    addDaysISO(dateISO, days) {
      const d = new Date(dateISO + 'T00:00:00');
      d.setDate(d.getDate() + days);
      return d.toISOString().slice(0, 10);
    },

    // Format date as "Lun 3 mai" / "Aujourd'hui" / "Demain"
    fmtDayLabel(dateISO) {
      const today = eat.mealPlan.todayISO();
      const tomorrow = eat.mealPlan.addDaysISO(today, 1);
      if (dateISO === today) return 'Aujourd\'hui';
      if (dateISO === tomorrow) return 'Demain';
      const days = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
      const months = ['jan','fév','mar','avr','mai','juin','juil','août','sep','oct','nov','déc'];
      const d = new Date(dateISO + 'T00:00:00');
      return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
    },

    fmtWeekRange(weekStartISO) {
      const start = new Date(weekStartISO + 'T00:00:00');
      const end = new Date(eat.mealPlan.weekEnd(weekStartISO) + 'T00:00:00');
      const months = ['jan','fév','mars','avril','mai','juin','juil','août','sep','oct','nov','déc'];
      if (start.getMonth() === end.getMonth()) {
        return `${start.getDate()}-${end.getDate()} ${months[start.getMonth()]} ${start.getFullYear()}`;
      }
      return `${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]} ${start.getFullYear()}`;
    },
  };

  // ── Pantry photo scan ─────────────────────────────────────
  // Server-side Anthropic Claude Vision via POST /api/pantry/scan.
  // The ANTHROPIC_API_KEY lives ONLY on the server — clients never see it.
  function setScanStatus(msg, isError) {
    const el = document.getElementById('pantry-scan-status');
    if (!el) return;
    el.textContent = msg;
    el.style.color = isError ? '#A33B3B' : 'var(--muted)';
  }

  // One-shot cleanup of the legacy OpenAI key cached in old browsers.
  try { localStorage.removeItem('eatrail.openai_key'); } catch {}

  /**
   * Re-encode an image File → JPEG Blob via <canvas>.
   * Reasons:
   *   - iPhone defaults to HEIC, which Claude Vision DOES NOT support.
   *     If Safari can decode the HEIC into an <img>, the canvas pipeline
   *     re-emits it as JPEG. (Safari iOS 15+ decodes HEIC natively;
   *     Chrome desktop cannot, but desktop users don't shoot HEIC.)
   *   - Big phone photos (5–12 MB) get downscaled to maxDim=1600px which
   *     is plenty for Claude vision (capped at 2576px long-edge anyway)
   *     and keeps the upload fast.
   *
   * Returns a File with .name preserved + .type=image/jpeg.
   * On failure, returns the original `file` unchanged (server will reject if needed).
   */
  async function reencodeImageToJpeg(file, maxDim = 1600, quality = 0.9) {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        try {
          const w = img.naturalWidth, h = img.naturalHeight;
          if (!w || !h) { URL.revokeObjectURL(url); resolve(file); return; }
          const scale = Math.min(1, maxDim / Math.max(w, h));
          const cw = Math.round(w * scale), ch = Math.round(h * scale);
          const canvas = document.createElement('canvas');
          canvas.width = cw; canvas.height = ch;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, cw, ch);
          canvas.toBlob((blob) => {
            URL.revokeObjectURL(url);
            if (!blob) { resolve(file); return; }
            const newName = (file.name || 'photo').replace(/\.[^.]+$/, '') + '.jpg';
            resolve(new File([blob], newName, { type: 'image/jpeg' }));
          }, 'image/jpeg', quality);
        } catch {
          URL.revokeObjectURL(url);
          resolve(file);
        }
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
      img.src = url;
    });
  }
  eat.reencodeImageToJpeg = reencodeImageToJpeg;

  eat.scanPantryPhoto = async function (file) {
    if (!file) { setScanStatus('Aucun fichier fourni.', true); return; }
    if (!eat.api) {
      setScanStatus('API non chargée — recharge la page.', true);
      return;
    }
    if (!eat.api.currentUser) {
      setScanStatus('Connecte-toi pour scanner ton garde-manger.', true);
      return;
    }

    setScanStatus('Préparation de l\'image…');
    const upload = await reencodeImageToJpeg(file);
    setScanStatus('Analyse Claude Vision (≈10s)…');

    let json;
    try {
      json = await eat.api.pantry.scan(upload);
    } catch (e) {
      const code = e && e.code;
      const msg =
        code === 'no_photo' ? 'Aucune image envoyée.' :
        code === 'unsupported_image_type' ? 'Format d\'image non supporté (JPEG/PNG/WEBP/GIF uniquement).' :
        code === 'scan_unavailable' ? 'Scan IA non configuré côté serveur.' :
        code === 'anthropic_error' ? 'Claude a rencontré une erreur — réessaie.' :
        code === 'unauthorized' ? 'Connecte-toi pour scanner.' :
        code === 'too_many_requests' ? 'Trop de scans récents — réessaie dans une minute.' :
        (e && e.message) || 'Erreur inconnue';
      setScanStatus('Erreur : ' + msg, true);
      return;
    }

    const items = Array.isArray(json.detected) ? json.detected : [];
    if (items.length === 0) {
      setScanStatus('Aucun aliment détecté sur la photo. Réessaie avec plus de lumière.', true);
      return;
    }

    // The server already inserted them into PantryItem rows. Mirror into
    // localStorage cache so the synchronous views (`eat.pantry()`) see them
    // immediately, without waiting for a background pull.
    const cur = eat.pantry();
    const set = new Set(cur);
    let added = 0;
    for (const it of items) {
      const norm = String(it).trim().toLowerCase();
      if (norm && !set.has(norm)) { set.add(norm); added++; }
    }
    safeWrite(LS_PANTRY, [...set]);

    const detectedCount = items.length;
    setScanStatus(`✓ ${added} aliment${added > 1 ? 's' : ''} ajouté${added > 1 ? 's' : ''} (${detectedCount} détecté${detectedCount > 1 ? 's' : ''}).`);
  };

  /**
   * Pantry AI mock : pour chaque recette, calcule un % de couverture
   * en comparant les noms d'ingrédients (substring match) avec le pantry.
   */
  eat.pantryMatches = function () {
    const items = eat.pantry();
    if (!items.length) return [];
    return eat.allRecipes()
      .map(r => {
        let matched = 0;
        for (const ing of r.ingredients) {
          const n = ing.name.toLowerCase();
          if (items.some(p => n.includes(p) || p.includes(n.split(' ')[0]))) matched++;
        }
        const pct = Math.round((matched / r.ingredients.length) * 100);
        return { recipe: r, pct, matched, total: r.ingredients.length };
      })
      .filter(m => m.pct > 0)
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 8);
  };

  /** Émoji-thumbnail à partir du flag de l'origine, fallback "🍽". */
  eat.recipeEmoji = (r) => (r.origin && r.origin.flag) || '🍽';

  /** Class CSS pour un score d'authenticité de magasin. */
  eat.authClass = function (score) {
    if (score >= 90) return '';
    if (score >= 75) return 'is-mid';
    return 'is-low';
  };

  // ─────────────────────────────────────────────────────────
  // v1.1 — Catégories
  // ─────────────────────────────────────────────────────────

  /** Métadonnées d'affichage pour les catégories de plats. */
  eat.CATEGORIES = [
    { id: 'soupe',    label: 'Soupes',     emoji: '🍲' },
    { id: 'ragoût',   label: 'Ragoûts',    emoji: '🥘' },
    { id: 'curry',    label: 'Currys',     emoji: '🍛' },
    { id: 'nouilles', label: 'Nouilles',   emoji: '🍜' },
    { id: 'raviolis', label: 'Raviolis',   emoji: '🥟' },
    { id: 'bol',      label: 'Bols',       emoji: '🥗' },
    { id: 'sandwich', label: 'Sandwichs',  emoji: '🥖' },
    { id: 'pain',     label: 'Pains',      emoji: '🫓' },
    { id: 'mezze',    label: 'Mezze',      emoji: '🫛' },
    { id: 'brunch',   label: 'Brunch',     emoji: '🍳' },
    { id: 'cru',      label: 'Cru',        emoji: '🐟' }
  ];

  eat.categoryMeta = (id) => eat.CATEGORIES.find(c => c.id === id) || { id, label: id, emoji: '🍽' };

  /** Compte de recettes par catégorie. */
  eat.categoryCounts = function () {
    const counts = {};
    for (const r of eat.allRecipes()) {
      counts[r.category] = (counts[r.category] || 0) + 1;
    }
    return counts;
  };

  // ─────────────────────────────────────────────────────────
  // v1.1 — Allergènes
  // ─────────────────────────────────────────────────────────

  eat.ALLERGENS = [
    'gluten', 'lait', 'œufs', 'soja', 'sésame',
    'arachides', 'fruits à coque', 'poisson', 'crustacés', 'mollusques'
  ];

  /**
   * Filtre les recettes en excluant celles contenant les allergènes interdits.
   * exclude = array de strings (sous-ensemble de eat.ALLERGENS).
   */
  eat.filterByAllergens = function (recipes, exclude) {
    if (!exclude || !exclude.length) return recipes;
    const ex = new Set(exclude);
    return recipes.filter(r => !(r.allergens || []).some(a => ex.has(a)));
  };

  // ─────────────────────────────────────────────────────────
  // v1.1 — Recherche enrichie (catégorie + allergènes)
  // ─────────────────────────────────────────────────────────

  // surcharge searchRecipes pour gérer category + excludeAllergens
  const _searchOriginal = eat.searchRecipes;
  eat.searchRecipes = function (filters) {
    filters = filters || {};
    let results = _searchOriginal(filters);
    if (filters.category) results = results.filter(r => r.category === filters.category);
    if (filters.excludeAllergens && filters.excludeAllergens.length) {
      results = eat.filterByAllergens(results, filters.excludeAllergens);
    }
    return results;
  };

  // ─────────────────────────────────────────────────────────
  // v1.2 — Profil utilisateur : délègue à eat.auth (compte)
  // ─────────────────────────────────────────────────────────

  const AVATARS = ['🧑‍🍳', '👩‍🍳', '🧑', '👩', '🧔', '👨', '🧕', '👩‍🦱', '🦊', '🐻', '🐼', '🦉'];

  function readObj(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || 'null') || fallback; }
    catch { return fallback; }
  }
  function writeObj(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }

  /** Profil utilisateur courant (account si connecté, sinon null). */
  eat.user = () => (eat.auth && eat.auth.current && eat.auth.current()) || null;
  eat.hasUser = () => !!eat.user();
  eat.AVATARS = AVATARS;

  // ─────────────────────────────────────────────────────────
  // v1.1 — Avis & commentaires
  // ─────────────────────────────────────────────────────────

  const LS_REVIEWS = 'eatrail.v1.reviews';

  function readReviews() { return readObj(LS_REVIEWS, {}); }
  function writeReviews(obj) { writeObj(LS_REVIEWS, obj); }

  eat.recipeReviews = (recipeId) => readReviews()[recipeId] || [];

  /** Match d'ownership : prioritairement par userId (v1.2), fallback nom (v1.1). */
  function isOwnReview(rv, u) {
    if (!u) return false;
    if (rv.userId && rv.userId === u.id) return true;
    return !rv.userId && rv.user === u.name;
  }
  eat.isOwnReview = isOwnReview;

  eat.addReview = function (recipeId, rating, comment) {
    const u = eat.user();
    if (!u) return { ok: false, error: 'no-user' };
    const r = Math.max(1, Math.min(5, parseInt(rating, 10) || 0));
    if (!r) return { ok: false, error: 'no-rating' };
    const all = readReviews();
    if (!all[recipeId]) all[recipeId] = [];
    // un seul avis par user par recette (mode édition)
    const existing = all[recipeId].findIndex(x => isOwnReview(x, u));
    const entry = {
      userId: u.id,
      user: u.name,
      avatar: u.avatar,
      rating: r,
      comment: String(comment || '').trim().slice(0, 800),
      date: new Date().toISOString()
    };
    if (existing >= 0) all[recipeId][existing] = entry;
    else all[recipeId].push(entry);
    writeReviews(all);
    return { ok: true };
  };

  eat.deleteReview = function (recipeId) {
    const u = eat.user();
    if (!u) return;
    const all = readReviews();
    if (!all[recipeId]) return;
    all[recipeId] = all[recipeId].filter(x => !isOwnReview(x, u));
    if (all[recipeId].length === 0) delete all[recipeId];
    writeReviews(all);
  };

  /** Note moyenne + nombre d'avis pour une recette. */
  eat.recipeRating = function (recipeId) {
    const list = eat.recipeReviews(recipeId);
    if (!list.length) return { avg: null, count: 0 };
    const sum = list.reduce((s, x) => s + x.rating, 0);
    return { avg: Math.round((sum / list.length) * 10) / 10, count: list.length };
  };

  /** Avis posté par l'utilisateur courant pour cette recette (ou null). */
  eat.userReview = function (recipeId) {
    const u = eat.user();
    if (!u) return null;
    return eat.recipeReviews(recipeId).find(rv => isOwnReview(rv, u)) || null;
  };

  /** Nombre total d'avis postés par l'utilisateur (pour son dashboard). */
  eat.myReviewCount = function () {
    const u = eat.user();
    if (!u) return 0;
    const all = readReviews();
    let n = 0;
    for (const list of Object.values(all)) for (const rv of list) if (isOwnReview(rv, u)) n++;
    return n;
  };

  // ─────────────────────────────────────────────────────────
  // v1.1 — Panier de courses
  // ─────────────────────────────────────────────────────────

  const LS_CART = 'eatrail.v1.cart';

  // Cart est scopé par compte si connecté, anonyme sinon (via scopedKey).
  function readCart() {
    try { return JSON.parse(localStorage.getItem(scopedKey(LS_CART)) || '[]'); }
    catch { return []; }
  }
  function writeCart(arr) {
    try { localStorage.setItem(scopedKey(LS_CART), JSON.stringify(arr)); } catch {}
    // v1.8 — debounced full snapshot sync to API
    scheduleCartSync();
  }

  // Debounced full cart sync (1 push per 600ms after last mutation).
  // Exposed via eat.flushCartSync() so callers (auth logout) can force the
  // pending push to land BEFORE the session cookie is cleared — otherwise the
  // sync fires anonymous, hits 401, gets swallowed, and the DB stays stale.
  let _cartSyncTimer = null;
  async function pushCartSnapshot() {
    if (!eat.api || !eat.api.currentUser) return;
    try {
      const local = readCart();
      await eat.api.cart.clear();
      if (local.length > 0) {
        const items = local.map(c => ({
          ingredientName: c.name,
          qty: typeof c.qty === 'number' ? c.qty : null,
          unit: c.unit,
          recipeId: c.recipeId,
          shopId: c.shopId,
          checked: !!c.checked,
        }));
        await eat.api.cart.import(items);
      }
    } catch (e) { console.warn('[sync] cart snapshot:', e.message); }
  }
  function scheduleCartSync() {
    if (!eat.api || !eat.api.currentUser) return;
    clearTimeout(_cartSyncTimer);
    _cartSyncTimer = setTimeout(() => { _cartSyncTimer = null; pushCartSnapshot(); }, 600);
  }
  /** Force any debounced cart sync to run NOW. Returns when the push is done. */
  eat.flushCartSync = async function () {
    if (_cartSyncTimer) {
      clearTimeout(_cartSyncTimer);
      _cartSyncTimer = null;
      await pushCartSnapshot();
    }
  };

  eat.cart = () => readCart();
  eat.cartCount = () => readCart().filter(i => !i.checked).length;

  /** Ajoute tous les ingrédients d'une recette au panier. */
  eat.cartAddRecipe = function (recipe, servings) {
    const cart = readCart();
    const s = servings || recipe.servings;
    const ings = eat.scaleIngredients(recipe, s);
    let added = 0;
    for (const ing of ings) {
      // dédup : même ingrédient, même recette → on incrémente la qty si numérique
      const existing = cart.find(c => c.recipeId === recipe.id && c.name === ing.name);
      if (existing) {
        if (typeof existing.qty === 'number' && typeof ing.qty === 'number') {
          existing.qty = Math.round((existing.qty + ing.qty) * 100) / 100;
        }
      } else {
        cart.push({
          id: recipe.id + '::' + ing.name + '::' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
          name: ing.name,
          qty: ing.qty,
          unit: ing.unit,
          rare: !!ing.rare,
          tags: ing.tags || [],
          substitutes: ing.substitutes || null,
          recipeId: recipe.id,
          recipeTitle: recipe.title,
          checked: false,
          addedAt: Date.now()
        });
        added++;
      }
    }
    writeCart(cart);
    return added;
  };

  eat.cartToggle = function (itemId) {
    const cart = readCart();
    const item = cart.find(c => c.id === itemId);
    if (!item) return;
    item.checked = !item.checked;
    writeCart(cart);
    return item.checked;
  };

  eat.cartRemove = function (itemId) {
    writeCart(readCart().filter(c => c.id !== itemId));
  };

  eat.cartClear = function () {
    writeCart([]);
  };

  eat.cartClearChecked = function () {
    writeCart(readCart().filter(c => !c.checked));
  };

  /**
   * Regroupe les items du panier par magasin (via la même logique que le trail).
   * Retourne : [{ shop, items: [...cartItem] }]
   */
  eat.cartByShop = function () {
    const cart = readCart();
    if (!cart.length) return [];
    const stopsByShop = new Map();
    const ensureStop = (shop) => {
      if (!stopsByShop.has(shop.id)) stopsByShop.set(shop.id, { shop, items: [] });
      return stopsByShop.get(shop.id);
    };

    // pass 1 : items rares
    const rare = cart.filter(c => c.rare);
    for (const item of rare) {
      const cands = eat.shopsForIngredient(item);
      if (cands.length) ensureStop(cands[0].shop).items.push(item);
    }
    // pass 2 : items communs
    const common = cart.filter(c => !c.rare);
    for (const item of common) {
      let placed = false;
      for (const stop of stopsByShop.values()) {
        const shopTags = new Set(stop.shop.tags || []);
        if ((item.tags || []).some(t => shopTags.has(t))) {
          stop.items.push(item);
          placed = true;
          break;
        }
      }
      if (!placed) {
        const cands = eat.shopsForIngredient(item);
        if (cands.length) ensureStop(cands[0].shop).items.push(item);
      }
    }
    return [...stopsByShop.values()]
      .filter(s => s.items.length > 0)
      .sort((a, b) => a.shop.distMi - b.shop.distMi);
  };

  /**
   * "Lecture à puce" — simulateur de scan code-barres.
   * Pioche pseudo-aléatoirement un item non-coché du panier.
   * En vrai prod : caméra + librairie de décodage barcode (ex. ZXing).
   */
  eat.cartFakeScan = function () {
    const cart = readCart();
    const remaining = cart.filter(c => !c.checked);
    if (!remaining.length) return null;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    eat.cartToggle(pick.id);
    return pick;
  };

  // ─────────────────────────────────────────────────────────
  // v1.1 — Recommandations
  // ─────────────────────────────────────────────────────────

  /**
   * Pour une recette donnée, trouve les recettes les plus proches.
   * Score = bonus pays + bonus catégorie + overlap moods + overlap diets.
   */
  eat.similarRecipes = function (recipe, limit) {
    limit = limit || 4;
    const moods = new Set(recipe.moods || []);
    const diets = new Set(recipe.diets || []);
    const allergens = new Set(recipe.allergens || []);

    return eat.allRecipes()
      .filter(r => r.id !== recipe.id)
      .map(r => {
        let score = 0;
        if (r.origin.country === recipe.origin.country) score += 8;
        if (r.category === recipe.category) score += 6;
        for (const m of (r.moods || [])) if (moods.has(m)) score += 2;
        for (const d of (r.diets || [])) if (diets.has(d)) score += 2;
        // proximité difficulté
        score += 2 - Math.abs(r.difficulty - recipe.difficulty);
        // proximité durée (bonus si même ordre de grandeur)
        if (Math.abs(r.duration - recipe.duration) < 30) score += 1;
        // pénalise allergènes opposés (variété)
        for (const a of (r.allergens || [])) if (!allergens.has(a)) score -= 0.3;
        return { r, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(x => x.r);
  };

  /**
   * Recommandations personnalisées (page d'accueil).
   * v1.3 : utilise eat.prefs.scoreRecipe quand des préférences sont actives.
   * Sinon fallback sur similarité aux favoris (v1.1).
   */
  eat.personalRecs = function (limit) {
    limit = limit || 4;
    const saved = eat.savedIds().map(eat.recipeById).filter(Boolean);
    const hasPrefs = eat.prefs && eat.prefs.hasActivePrefs && eat.prefs.hasActivePrefs();

    // Cas 1 : préférences actives → tri par score préférences
    if (hasPrefs) {
      const ranked = eat.prefs.filterRecipes(eat.allRecipes(), { sortByScore: true });
      const seen = new Set(saved.map(r => r.id));
      // priorité aux non-favoris pour la découverte
      const fresh = ranked.filter(r => !seen.has(r.id));
      return fresh.slice(0, limit);
    }

    // Cas 2 : pas de prefs mais des favoris → similarité
    if (saved.length) {
      const seen = new Set(saved.map(r => r.id));
      const out = [];
      for (const fav of saved) {
        for (const sim of eat.similarRecipes(fav, 6)) {
          if (!seen.has(sim.id)) {
            out.push(sim);
            seen.add(sim.id);
            if (out.length >= limit) return out;
          }
        }
      }
      return out;
    }

    // Cas 3 : aucune info → top par authenticité
    return [...eat.allRecipes()].sort((a, b) => b.auth - a.auth).slice(0, limit);
  };

  // ─────────────────────────────────────────────────────────
  // v1.1 — Helpers UI
  // ─────────────────────────────────────────────────────────

  /** Rendu HTML d'une note 0..5 en étoiles (★ pleines + ☆ vides). */
  eat.starsHtml = function (rating, max) {
    max = max || 5;
    const r = Math.round(rating || 0);
    let out = '';
    for (let i = 1; i <= max; i++) {
      out += i <= r ? '<span class="star is-on">★</span>' : '<span class="star">☆</span>';
    }
    return out;
  };

  /** Format date courte FR. */
  eat.fmtDate = function (iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch { return ''; }
  };

  // ─────────────────────────────────────────────────────────
  // v1.2 — Migration anonyme → compte au login/signup
  // ─────────────────────────────────────────────────────────

  /**
   * À l'instant t où on se connecte, on a éventuellement des données dans les
   * clés "anonymes" (sans suffixe). On les fusionne dans la clé scopée du
   * nouveau compte si celle-ci est vide. Sinon on les laisse tranquilles
   * (l'utilisateur garde son historique de visiteur séparément, on ne l'écrase pas).
   */
  function migrateAnonToAccount(account) {
    if (!account || !account.id) return;
    const KEYS = ['eatrail.v1.saved', 'eatrail.v1.pantry', 'eatrail.v1.cart'];
    for (const base of KEYS) {
      const anon = localStorage.getItem(base);
      if (!anon) continue;
      const scoped = base + '.' + account.id;
      const existing = localStorage.getItem(scoped);
      if (!existing || existing === '[]') {
        // copie l'anonyme dans le scope du compte
        localStorage.setItem(scoped, anon);
      }
      // on supprime l'anonyme dans tous les cas pour éviter les doublons visibles à la déconnexion
      localStorage.removeItem(base);
    }
  }

  // Branche-toi sur les events auth pour migrer / re-render.
  document.addEventListener('eat:auth:change', function (e) {
    const t = e.detail && e.detail.type;
    if (t === 'signup' || t === 'login') {
      migrateAnonToAccount(e.detail.account);
    }
  });

})(window.eat);
