/* eatrail · v1 — bootstrap + delegation
 * Branche le router, rend la vue active, attache les events.
 */

(function () {
  'use strict';

  const eat = window.eat;
  const root = document.getElementById('app-root');

  // État éphémère côté client (ne survit pas au reload, sauf saved/pantry persistés).
  eat.state = {
    servings: {} // recipeId → custom servings
  };

  // ── Render principal ─────────────────────────────────────
  function render() {
    const route = eat.parseRoute();
    eat.updateNav(route);
    let html = '';
    try {
      switch (route.name) {
        case 'home':     html = eat.viewHome(); break;
        case 'recipes':  html = eat.viewRecipes(route.query); break;
        case 'recipe':   html = eat.viewRecipe(route.params[0]); break;
        case 'trail':    html = eat.viewTrail(route.params[0]); break;
        case 'shops':    html = eat.viewShops(route.query); break;
        case 'shop':     html = eat.viewShop(route.params[0]); break;
        case 'pantry':   html = eat.viewPantry(); break;
        case 'saved':    html = eat.viewSaved(); break;
        case 'cart':     html = eat.viewCart(); break;
        case 'calendar': html = eat.viewCalendar(route.query); break;
        case 'flavorDna': html = eat.viewFlavorDna(); break;
        case 'login':    html = eat.viewLogin(route.query); break;
        case 'signup':   html = eat.viewSignup(route.query); break;
        case 'forgot':   html = eat.viewForgot(route.query); break;
        case 'reset':    html = eat.viewReset(route.query); break;
        case 'account':     html = eat.viewAccount(); break;
        case 'settings':    html = eat.viewAccountSettings(); break;
        case 'security':    html = eat.viewAccountSecurity(); break;
        case 'preferences': html = eat.viewAccountPreferences(); break;
        case 'onboarding':  html = eat.viewOnboarding(route.params[0]); break;
        default:            html = eat.viewNotFound('Route inconnue');
      }
    } catch (err) {
      console.error('Render error:', err);
      html = eat.viewNotFound('Erreur de rendu');
    }
    root.innerHTML = html;
    updateCartBadge();
    updateNavAuthState();
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  /** Adapte la nav selon l'état de connexion (avatar vs lien Connexion). */
  function updateNavAuthState() {
    const u = eat.user();
    const slotDesktop = document.getElementById('nav-auth-slot');
    const slotMobile = document.getElementById('nav-auth-slot-mobile');
    if (slotDesktop) {
      slotDesktop.innerHTML = u
        ? `<a href="#/account" class="app-nav-avatar" data-route="account" aria-label="Mon compte">${u.avatar}</a>`
        : `<a href="#/login" class="app-nav-pill" data-route="account" style="width:auto;height:auto;padding:8px 16px;font-size:13px;font-weight:600;border-radius:999px;">Se connecter</a>`;
    }
    if (slotMobile) {
      slotMobile.innerHTML = u
        ? `<a href="#/account" class="app-nav-avatar" data-route="account" aria-label="Mon compte">${u.avatar}</a>`
        : `<a href="#/login" class="app-nav-icon" data-route="account" aria-label="Se connecter">👤</a>`;
    }
    const route = eat.parseRoute();
    eat.updateNav(route);
  }
  eat.updateNavAuthState = updateNavAuthState;

  /** Met à jour les badges "panier" (desktop + mobile) dans la nav. */
  function updateCartBadge() {
    const n = eat.cartCount();
    ['cart-badge', 'cart-badge-mobile'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.textContent = n > 99 ? '99+' : (n || '');
      el.style.display = n > 0 ? '' : 'none';
    });
  }
  eat.updateCartBadge = updateCartBadge;

  // ── Délégation d'événements globale ──────────────────────
  // Tous les events sont attachés UNE FOIS à document → survivent aux re-renders.

  // Recherche live (catalogue)
  document.addEventListener('input', (e) => {
    if (e.target && e.target.id === 'filter-q') {
      const route = eat.parseRoute();
      const q = { ...route.query, q: e.target.value };
      // remplace l'URL sans recharger via location.replace pour éviter l'historique
      const newHash = eat.routeUrl('recipes', [], q);
      if (location.hash !== newHash) {
        history.replaceState(null, '', newHash);
        render();
        // refocus + curseur en fin
        const fresh = document.getElementById('filter-q');
        if (fresh) {
          fresh.focus();
          const v = fresh.value;
          fresh.value = '';
          fresh.value = v;
        }
      }
    }
    if (e.target && e.target.id === 'shop-filter-q') {
      const route = eat.parseRoute();
      const q = { ...route.query, q: e.target.value };
      const newHash = eat.routeUrl('shops', [], q);
      if (location.hash !== newHash) {
        history.replaceState(null, '', newHash);
        render();
        const fresh = document.getElementById('shop-filter-q');
        if (fresh) { fresh.focus(); const v = fresh.value; fresh.value = ''; fresh.value = v; }
      }
    }
  });

  // Sélecteur pays
  document.addEventListener('change', (e) => {
    if (e.target && e.target.id === 'filter-country') {
      const route = eat.parseRoute();
      const q = { ...route.query, country: e.target.value };
      location.hash = eat.routeUrl('recipes', [], q);
    }

    // Pantry photo scan via Claude Vision (server-side ANTHROPIC_API_KEY)
    if (e.target && e.target.id === 'pantry-scan-input') {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      eat.scanPantryPhoto(file).then(() => render());
    }

    // Cart product scan: photo → Claude Vision → tick matching cart items
    if (e.target && e.target.id === 'cart-scan-input') {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      eat.scanCartProduct(file).then(() => render());
    }

    // Geo radius slider — debounce update
    if (e.target && e.target.id === 'geo-radius') {
      const v = parseFloat(e.target.value).toFixed(1);
      const label = document.getElementById('geo-radius-label');
      if (label) label.textContent = v + ' mi';
      clearTimeout(window._geoRadiusTimer);
      window._geoRadiusTimer = setTimeout(() => {
        const route = eat.parseRoute();
        const q = { ...route.query, radius: v };
        location.hash = eat.routeUrl('shops', [], q);
      }, 350);
    }
  });

  // ─── MEAL CALENDAR event handlers ────────────────────────
  document.addEventListener('click', async (e) => {
    // [+] Add meal in a slot → open picker modal
    const addBtn = e.target.closest && e.target.closest('[data-add-meal]');
    if (addBtn) {
      const date = addBtn.getAttribute('data-date');
      const slot = addBtn.getAttribute('data-slot');
      eat._mealPickerCtx = { date, slot };
      eat.openMealPicker(date, slot);
      return;
    }

    // Pick a recipe in modal → schedule + close
    const pickBtn = e.target.closest && e.target.closest('[data-pick-meal]');
    if (pickBtn) {
      const recipeId = pickBtn.getAttribute('data-recipe-id');
      const date = pickBtn.getAttribute('data-date');
      const slot = pickBtn.getAttribute('data-slot');
      const recipe = eat.recipeById(recipeId);
      const servings = recipe?.servings || 2;
      pickBtn.disabled = true;
      pickBtn.style.opacity = '0.6';
      try {
        await eat.mealPlan.add({ recipeId, date, slot, servings });
        document.getElementById('cal-modal-zone').innerHTML = '';
        eat._mealPickerCtx = null;
        if (eat.parseRoute().name === 'calendar') render();
      } catch (err) {
        alert('Erreur : ' + err.message);
        pickBtn.disabled = false;
        pickBtn.style.opacity = '1';
      }
      return;
    }

    // Close meal picker (× or backdrop)
    if (e.target && (e.target.id === 'meal-picker-close' || e.target.id === 'meal-picker-backdrop')) {
      const zone = document.getElementById('cal-modal-zone');
      if (zone) zone.innerHTML = '';
      eat._mealPickerCtx = null;
      return;
    }

    // Mark meal cooked
    const cookedBtn = e.target.closest && e.target.closest('[data-mark-cooked]');
    if (cookedBtn) {
      const id = cookedBtn.getAttribute('data-mark-cooked');
      await eat.mealPlan.update(id, { status: 'COOKED' });
      render();
      return;
    }

    // Remove meal
    const removeBtn = e.target.closest && e.target.closest('[data-remove-meal]');
    if (removeBtn) {
      const id = removeBtn.getAttribute('data-remove-meal');
      if (!confirm('Retirer ce repas du planning ?')) return;
      await eat.mealPlan.remove(id);
      render();
      return;
    }

    // Schedule from recipe page → opens picker for "today / dîner" by default
    const schedBtn = e.target.closest && e.target.closest('[data-schedule-meal]');
    if (schedBtn) {
      const recipeId = schedBtn.getAttribute('data-schedule-meal');
      // Open a small "quick schedule" inline UI: ask for date + slot
      const today = eat.mealPlan.todayISO();
      const dateStr = prompt('À quelle date ? (YYYY-MM-DD)', today);
      if (!dateStr) return;
      const slot = (prompt('Quel créneau ? BREAKFAST / LUNCH / DINNER / SNACK', 'DINNER') || 'DINNER').toUpperCase();
      if (!eat.mealPlan.SLOTS.includes(slot)) { alert('Créneau invalide'); return; }
      const recipe = eat.recipeById(recipeId);
      try {
        await eat.mealPlan.add({ recipeId, date: dateStr, slot, servings: recipe?.servings || 2 });
        const ok = confirm('✓ Programmé pour ' + eat.mealPlan.fmtDayLabel(dateStr) + ' (' + eat.mealPlan.SLOT_LABELS[slot] + ').\n\nVoir le planning ?');
        if (ok) location.hash = eat.routeUrl('calendar');
      } catch (err) {
        alert('Erreur : ' + err.message);
      }
      return;
    }

    // Shopping list of the week → push aggregate to cart
    if (e.target && e.target.id === 'cal-shopping-list') {
      const ctx = eat._calendarContext;
      if (!ctx) return;
      e.target.disabled = true;
      e.target.textContent = '⏳ Agrégation…';
      try {
        const list = await eat.mealPlan.shoppingList(ctx.weekStart, ctx.weekEnd);
        if (!list.items || list.items.length === 0) {
          alert('Aucun ingrédient à agréger (planning vide).');
        } else {
          // Add each unique ingredient to cart
          let added = 0;
          for (const item of list.items) {
            try {
              if (eat.api && eat.api.isOnline && eat.api.currentUser) {
                await eat.api.cart.add({ ingredientName: item.name, qty: item.qty, unit: item.unit });
              } else {
                eat.cartAdd && eat.cartAdd({ name: item.name, qty: item.qty, unit: item.unit });
              }
              added++;
            } catch {}
          }
          alert('✓ ' + added + ' ingrédients agrégés vers ton panier (' + list.items.filter(i => i.isRare).length + ' rares).');
          eat.updateCartBadge && eat.updateCartBadge();
        }
      } catch (err) {
        alert('Erreur : ' + err.message);
      }
      e.target.disabled = false;
      e.target.textContent = '📋 Liste de courses de la semaine';
      return;
    }

    // Clear all meals in current week
    if (e.target && e.target.id === 'cal-clear-week') {
      const ctx = eat._calendarContext;
      if (!ctx) return;
      if (!confirm('Vider tous les repas de cette semaine ?')) return;
      const plans = await eat.mealPlan.list(ctx.weekStart, ctx.weekEnd);
      for (const p of plans) await eat.mealPlan.remove(p.id);
      render();
      return;
    }

    // AI: fill the week with 7 dinners chosen by Claude
    if (e.target && e.target.id === 'cal-ai-fill') {
      const btn = e.target;
      const weekStart = btn.getAttribute('data-week-start');
      if (!weekStart) return;

      // Must be logged in (uses user prefs + persists meals)
      if (!eat.api || !eat.api.isOnline || !eat.api.currentUser) {
        alert('Connecte-toi pour utiliser la suggestion IA.');
        return;
      }

      // Detect existing PLANNED dinners in the week → ask before replacing
      let replaceExisting = false;
      try {
        const existing = await eat.api.mealPlan.list(weekStart, addDaysISO(weekStart, 6), 'PLANNED');
        const existingDinners = (existing.items || []).filter(p => p.slot === 'DINNER');
        if (existingDinners.length > 0) {
          if (!confirm(`Tu as déjà ${existingDinners.length} dîner${existingDinners.length > 1 ? 's' : ''} planifié${existingDinners.length > 1 ? 's' : ''} cette semaine. Les remplacer par les suggestions IA ?`)) {
            return;
          }
          replaceExisting = true;
        } else {
          if (!confirm('Générer 7 dîners IA pour la semaine, basés sur tes préférences ?')) return;
        }
      } catch {
        if (!confirm('Générer 7 dîners IA pour la semaine, basés sur tes préférences ?')) return;
      }

      btn.disabled = true;
      btn.textContent = '✨ Claude réfléchit (10-30s)…';
      try {
        const r = await eat.api.mealPlan.generate(weekStart, 2, replaceExisting);
        btn.textContent = `✓ ${r.created} dîners ajoutés`;
        setTimeout(() => render(), 700);
      } catch (err) {
        const msg =
          err.code === 'ai_not_configured' ? 'IA non configurée côté serveur.' :
          err.code === 'not_enough_candidates' ? 'Pas assez de recettes correspondent à tes préférences. Élargis tes cuisines / réduis les contraintes.' :
          err.code === 'ai_failed' ? 'Claude a échoué — réessaie dans 1 min.' :
          err.message || 'Erreur inconnue';
        alert('Erreur : ' + msg);
        btn.disabled = false;
        btn.textContent = '✨ Remplis ma semaine';
      }
      return;
    }
  });

  // YYYY-MM-DD + N days → YYYY-MM-DD (UTC math, no timezone surprises)
  function addDaysISO(iso, n) {
    const d = new Date(iso + 'T00:00:00Z');
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }

  // Meal picker live search
  document.addEventListener('input', (e) => {
    if (e.target && e.target.id === 'meal-picker-search') {
      eat.searchMealPicker(e.target.value);
    }
  });

  // ─── NUTRITION on-demand load ──────────────────────────────
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest && e.target.closest('[data-load-nutrition]');
    if (!btn) return;
    const recipeId = btn.getAttribute('data-load-nutrition');
    const widget = document.querySelector(`[data-nutrition-recipe="${recipeId}"]`);
    if (!widget) return;
    btn.disabled = true;
    btn.textContent = '⏳ Calcul USDA…';
    try {
      const { nutrition } = await eat.api.nutrition.recipe(recipeId);
      const ps = nutrition.perServing;
      if (ps.calories == null) {
        widget.innerHTML = `<div style="font-size:12px;color:var(--muted);background:var(--cream-deep);padding:12px;border-radius:10px;">⚠ Données nutritionnelles non disponibles (USDA non configuré ou ingrédients non reconnus).</div>`;
      } else {
        widget.innerHTML = `
          <div style="background:var(--white);border:1px solid var(--line);border-radius:14px;padding:14px;">
            <div style="font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--muted);margin-bottom:10px;">📊 Par portion (estimation USDA)</div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
              <div style="text-align:center;background:var(--cream-deep);padding:10px 6px;border-radius:8px;">
                <div style="font-family:var(--font-display);font-weight:700;font-size:18px;color:var(--ink);">${Math.round(ps.calories)}</div>
                <div style="font-size:10px;color:var(--muted);">kcal</div>
              </div>
              <div style="text-align:center;background:var(--cream-deep);padding:10px 6px;border-radius:8px;">
                <div style="font-family:var(--font-display);font-weight:700;font-size:18px;color:var(--ink);">${ps.protein != null ? ps.protein.toFixed(0) : '—'}g</div>
                <div style="font-size:10px;color:var(--muted);">protéines</div>
              </div>
              <div style="text-align:center;background:var(--cream-deep);padding:10px 6px;border-radius:8px;">
                <div style="font-family:var(--font-display);font-weight:700;font-size:18px;color:var(--ink);">${ps.carbs != null ? ps.carbs.toFixed(0) : '—'}g</div>
                <div style="font-size:10px;color:var(--muted);">glucides</div>
              </div>
              <div style="text-align:center;background:var(--cream-deep);padding:10px 6px;border-radius:8px;">
                <div style="font-family:var(--font-display);font-weight:700;font-size:18px;color:var(--ink);">${ps.fat != null ? ps.fat.toFixed(0) : '—'}g</div>
                <div style="font-size:10px;color:var(--muted);">lipides</div>
              </div>
              <div style="text-align:center;background:var(--cream-deep);padding:10px 6px;border-radius:8px;">
                <div style="font-family:var(--font-display);font-weight:700;font-size:18px;color:var(--ink);">${ps.fiber != null ? ps.fiber.toFixed(0) : '—'}g</div>
                <div style="font-size:10px;color:var(--muted);">fibres</div>
              </div>
              <div style="text-align:center;background:var(--cream-deep);padding:10px 6px;border-radius:8px;">
                <div style="font-family:var(--font-display);font-weight:700;font-size:18px;color:var(--ink);">${ps.sodium != null ? Math.round(ps.sodium) : '—'}mg</div>
                <div style="font-size:10px;color:var(--muted);">sodium</div>
              </div>
            </div>
            <div style="font-size:10px;color:var(--muted);margin-top:8px;">Source : USDA FoodData Central · estimation</div>
          </div>
        `;
      }
    } catch (err) {
      widget.innerHTML = `<div style="font-size:12px;color:var(--accent);">Erreur : ${esc(err.message)}</div>`;
    }
  });

  // ─── FLAVOR DNA share/download ─────────────────────────────
  document.addEventListener('click', async (e) => {
    if (e.target && e.target.id === 'dna-share') {
      const url = window.location.origin + '/#/flavor-dna';
      if (navigator.share) {
        try {
          await navigator.share({ title: 'Mon Flavor DNA · eatrail', text: 'Voici mon profil culinaire sur eatrail.', url });
        } catch {}
      } else {
        try {
          await navigator.clipboard.writeText(url);
          alert('Lien copié dans le presse-papier !');
        } catch {
          alert('Lien : ' + url);
        }
      }
    }
    if (e.target && e.target.id === 'dna-download') {
      // Native screenshot via html2canvas would be ideal, but to stay dependency-free we just guide:
      alert('Astuce : capture d\'écran de la carte (touche Windows + Shift + S, ou bouton volume + power sur mobile) — le design est conçu pour être partagé tel quel.');
    }
  });

  // ─── DRAG-DROP CALENDAR (HTML5 native) ─────────────────────
  let dragState = null;

  document.addEventListener('dragstart', (e) => {
    const meal = e.target.closest && e.target.closest('.cal-meal[data-meal-id]');
    if (!meal) return;
    dragState = { id: meal.getAttribute('data-meal-id'), el: meal };
    meal.classList.add('is-dragging');
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', dragState.id);
    }
  });

  document.addEventListener('dragend', (e) => {
    if (dragState?.el) dragState.el.classList.remove('is-dragging');
    document.querySelectorAll('.cal-slot.is-drop-target').forEach(s => s.classList.remove('is-drop-target'));
    dragState = null;
  });

  document.addEventListener('dragover', (e) => {
    const slot = e.target.closest && e.target.closest('.cal-slot[data-date][data-slot]');
    if (!slot || !dragState) return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    slot.classList.add('is-drop-target');
  });

  document.addEventListener('dragleave', (e) => {
    const slot = e.target.closest && e.target.closest('.cal-slot[data-date][data-slot]');
    if (!slot) return;
    // Only remove if we actually left the element (not entered a child)
    if (!slot.contains(e.relatedTarget)) {
      slot.classList.remove('is-drop-target');
    }
  });

  document.addEventListener('drop', async (e) => {
    const slot = e.target.closest && e.target.closest('.cal-slot[data-date][data-slot]');
    if (!slot || !dragState) return;
    e.preventDefault();
    slot.classList.remove('is-drop-target');
    const newDate = slot.getAttribute('data-date');
    const newSlot = slot.getAttribute('data-slot');
    const id = dragState.id;
    if (!id) return;
    try {
      await eat.mealPlan.update(id, { date: newDate, slot: newSlot });
      render();
    } catch (err) {
      console.warn('drag drop failed:', err);
      alert('Déplacement impossible : ' + err.message);
    }
  });

  // Geo bar buttons (delegated click)
  document.addEventListener('click', async (e) => {
    if (e.target && e.target.id === 'geo-enable') {
      e.target.disabled = true;
      e.target.textContent = '🔍 Recherche…';
      try {
        await eat.geo.getPosition({ highAccuracy: false });
        render();
      } catch (err) {
        e.target.disabled = false;
        e.target.textContent = '📍 Activer ma position';
        const code = err.message;
        const msg = code === 'permission_denied' ? 'Permission refusée. Tu peux utiliser "NYC par défaut" à la place.'
          : code === 'position_unavailable' ? 'Position GPS indisponible. Réessaie ou utilise "NYC par défaut".'
          : code === 'timeout' ? 'GPS lent à répondre. Réessaie ou utilise "NYC par défaut".'
          : 'Erreur géoloc : ' + code;
        alert(msg);
      }
    }
    if (e.target && e.target.id === 'geo-default') {
      eat.geo.useDefault();
      render();
    }
    if (e.target && e.target.id === 'geo-refresh') {
      e.target.disabled = true;
      e.target.textContent = '🔍…';
      try { await eat.geo.getPosition({ highAccuracy: false }); }
      catch { eat.geo.useDefault(); }
      render();
    }
    if (e.target && e.target.id === 'geo-clear') {
      eat.geo.clear();
      render();
    }
  });

  // Servings +/-
  document.addEventListener('click', (e) => {
    const sBtn = e.target.closest && e.target.closest('[data-servings-delta]');
    if (sBtn) {
      const route = eat.parseRoute();
      if (route.name !== 'recipe') return;
      const slug = route.params[0];
      const r = eat.recipeById(slug);
      if (!r) return;
      const delta = parseInt(sBtn.getAttribute('data-servings-delta'), 10);
      const cur = eat.state.servings[slug] || r.servings;
      const next = Math.max(1, Math.min(20, cur + delta));
      eat.state.servings[slug] = next;
      render();
      return;
    }

    const saveBtn = e.target.closest && e.target.closest('[data-toggle-save]');
    if (saveBtn) {
      const id = saveBtn.getAttribute('data-toggle-save');
      const added = eat.toggleSave(id);
      saveBtn.textContent = added ? '★ Sauvegardé' : '☆ Sauvegarder';
      return;
    }

    if (e.target && e.target.id === 'export-trail') {
      const route = eat.parseRoute();
      if (route.name !== 'trail') return;
      const r = eat.recipeById(route.params[0]);
      if (!r) return;
      const trail = eat.buildTrail(r);
      const lines = [];
      lines.push('Trail eatrail · ' + r.title + ' (' + r.servings + ' pers.)');
      lines.push('');
      trail.stops.forEach((stop, i) => {
        lines.push((i + 1) + '. ' + stop.shop.name + ' · ' + stop.shop.neighborhood + ' · ' + stop.shop.distMi + ' mi');
        stop.items.forEach(ing => {
          lines.push('   • ' + ing.name + ' — ' + ing.qty + ' ' + ing.unit + (ing.rare ? ' [rare]' : ''));
        });
        lines.push('');
      });
      lines.push('Total : ' + trail.totalShops + ' arrêts · ' + trail.totalMi + ' mi · ~$' + trail.totalCost);
      const text = lines.join('\n');
      navigator.clipboard.writeText(text).then(
        () => { e.target.textContent = '✓ Copié dans le presse-papier'; },
        () => { e.target.textContent = '⚠ Copie impossible'; }
      );
      return;
    }

    const dirShop = e.target.closest && e.target.closest('[data-open-directions-shop]');
    if (dirShop) {
      const id = dirShop.getAttribute('data-open-directions-shop');
      const shop = eat.shopById(id);
      if (!shop || !shop.coords) {
        dirShop.textContent = '⚠ Position du magasin indisponible';
        return;
      }
      eat.geo.openDirections([shop]);
      return;
    }

    const dirTrail = e.target.closest && e.target.closest('[data-open-directions-trail]');
    if (dirTrail) {
      const recipeId = dirTrail.getAttribute('data-open-directions-trail');
      const r = eat.recipeById(recipeId);
      if (!r) return;
      const trail = eat.buildTrail(r);
      const stopsWithCoords = trail.stops.map(st => st.shop).filter(s => s && s.coords);
      if (stopsWithCoords.length === 0) {
        dirTrail.textContent = '⚠ Aucune position de magasin';
        return;
      }
      eat.geo.openDirections(stopsWithCoords);
      return;
    }

    const remove = e.target.closest && e.target.closest('[data-pantry-remove]');
    if (remove) {
      eat.pantryRemove(remove.getAttribute('data-pantry-remove'));
      render();
      return;
    }

    if (e.target && e.target.id === 'pantry-clear') {
      try { localStorage.removeItem('eatrail.v1.pantry'); } catch {}
      render();
      return;
    }

    // ── v1.1 — Add to cart depuis fiche recette ────────────
    const addCartBtn = e.target.closest && e.target.closest('[data-add-cart]');
    if (addCartBtn) {
      const r = eat.recipeById(addCartBtn.getAttribute('data-add-cart'));
      if (!r) return;
      const servings = eat.state.servings[r.id] || r.servings;
      const added = eat.cartAddRecipe(r, servings);
      addCartBtn.textContent = added > 0
        ? `✓ ${added} item${added > 1 ? 's' : ''} ajouté${added > 1 ? 's' : ''} au panier`
        : '✓ Déjà au panier';
      updateCartBadge();
      setTimeout(() => { addCartBtn.textContent = '🛒 Ajouter au panier'; }, 2000);
      return;
    }

    // ── v1.1 — Cart toggle item ─────────────────────────────
    const tog = e.target.closest && e.target.closest('[data-cart-toggle]');
    if (tog) {
      eat.cartToggle(tog.getAttribute('data-cart-toggle'));
      render();
      return;
    }

    // ── v1.1 — Cart remove item ─────────────────────────────
    const rmCart = e.target.closest && e.target.closest('[data-cart-remove]');
    if (rmCart) {
      eat.cartRemove(rmCart.getAttribute('data-cart-remove'));
      render();
      return;
    }

    if (e.target && e.target.id === 'cart-clear-all') {
      if (confirm('Vider tout le panier ?')) { eat.cartClear(); render(); }
      return;
    }
    if (e.target && e.target.id === 'cart-clear-checked') {
      eat.cartClearChecked();
      render();
      return;
    }

    if (e.target && e.target.id === 'cart-export') {
      const stops = eat.cartByShop();
      const lines = ['Liste de courses · eatrail', ''];
      stops.forEach((stop, i) => {
        lines.push((i + 1) + '. ' + stop.shop.name + ' · ' + stop.shop.neighborhood);
        stop.items.forEach(item => {
          const status = item.checked ? '[x]' : '[ ]';
          lines.push('   ' + status + ' ' + item.name + ' — ' + item.qty + ' ' + item.unit + (item.rare ? ' (rare)' : ''));
        });
        lines.push('');
      });
      const text = lines.join('\n');
      navigator.clipboard.writeText(text).then(
        () => { e.target.textContent = '✓ Copié'; setTimeout(() => { e.target.textContent = '📋 Exporter'; }, 1800); },
        () => { e.target.textContent = '⚠ Erreur'; }
      );
      return;
    }

    // (cart-scan-input is handled by the change-event listener below — not click)

    // ── v1.1 — Étoiles d'avis (input) ───────────────────────
    const star = e.target.closest && e.target.closest('[data-star]');
    if (star) {
      const wrap = document.getElementById('review-stars');
      if (!wrap) return;
      const val = parseInt(star.getAttribute('data-star'), 10);
      wrap.dataset.value = String(val);
      wrap.querySelectorAll('button').forEach(b => {
        const n = parseInt(b.getAttribute('data-star'), 10);
        b.classList.toggle('is-on', n <= val);
      });
      return;
    }

    // ── v1.1 — Delete review ────────────────────────────────
    const delRev = e.target.closest && e.target.closest('[data-delete-review]');
    if (delRev) {
      if (confirm('Supprimer ton avis ?')) {
        eat.deleteReview(delRev.getAttribute('data-delete-review'));
        render();
      }
      return;
    }

    // ── v1.1 — Avatar picker (signup, settings) ────────────
    const avBtn = e.target.closest && e.target.closest('[data-avatar]');
    if (avBtn) {
      const av = avBtn.getAttribute('data-avatar');
      // ne toucher que le picker du même conteneur (évite cross-talk)
      const picker = avBtn.closest('.avatar-picker');
      if (picker) {
        picker.querySelectorAll('.avatar-pick').forEach(b => b.classList.toggle('is-active', b === avBtn));
      }
      // Met à jour les inputs cachés / displays adjacents (id varient selon vue)
      ['avatar-display', 'settings-avatar-display'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = av;
      });
      ['profile-avatar-input', 'signup-avatar', 'settings-avatar-input'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = av;
      });
      return;
    }

    // ── v1.2 — Toggle visibilité mot de passe ──────────────
    const pwdToggle = e.target.closest && e.target.closest('[data-pwd-toggle]');
    if (pwdToggle) {
      const targetId = pwdToggle.getAttribute('data-pwd-toggle');
      const input = document.getElementById(targetId);
      if (input) {
        const isPwd = input.type === 'password';
        input.type = isPwd ? 'text' : 'password';
        pwdToggle.textContent = isPwd ? '🙈' : '👁';
      }
      return;
    }

    // ── v1.2 — Logout depuis le dashboard ─────────────────
    if (e.target && e.target.id === 'acc-logout') {
      if (confirm('Se déconnecter ?')) {
        eat.auth.logout();
        location.hash = eat.routeUrl('home');
      }
      return;
    }

    // ── v1.2 — Toggle delete account form ─────────────────
    if (e.target && e.target.id === 'acc-delete-toggle') {
      const f = document.getElementById('delete-form');
      if (f) { f.hidden = false; e.target.style.display = 'none'; }
      return;
    }
    if (e.target && e.target.id === 'acc-delete-cancel') {
      const f = document.getElementById('delete-form');
      const t = document.getElementById('acc-delete-toggle');
      if (f) f.hidden = true;
      if (t) t.style.display = '';
      return;
    }

    // ─────────────────────────────────────────────────────
    // v1.3 — ONBOARDING handlers
    // ─────────────────────────────────────────────────────

    // Stop propagation depuis les sub-buttons sévérité (évite de re-toggler la card parente)
    if (e.target && e.target.closest && e.target.closest('[data-stop]')) {
      // Mais on laisse passer si c'est précisément un bouton de sévérité
      const sev = e.target.closest('[data-onb-allergen-sev], [data-prefs-allergen-sev]');
      if (!sev) return;
    }

    // Skip onboarding (lien Passer ou Plus tard)
    const skip = e.target.closest && e.target.closest('[data-onb-skip]');
    if (skip) {
      e.preventDefault();
      eat.prefs.completeOnboarding(true);
      location.hash = eat.routeUrl('home');
      return;
    }

    // Toggle régime (onboarding ou prefs)
    const dietBtn = e.target.closest && e.target.closest('[data-onb-diet], [data-prefs-diet]');
    if (dietBtn) {
      const id = dietBtn.getAttribute('data-onb-diet') || dietBtn.getAttribute('data-prefs-diet');
      const p = eat.prefs.get();
      const set = new Set(p.diets);
      if (set.has(id)) set.delete(id); else set.add(id);
      eat.prefs.patch({ diets: [...set] });
      dietBtn.classList.toggle('is-selected');
      return;
    }

    // Toggle allergène (clic sur la carte → ajout en strict par défaut)
    const allBtn = e.target.closest && e.target.closest('[data-onb-allergen], [data-prefs-allergen]');
    if (allBtn && !e.target.closest('[data-onb-allergen-sev], [data-prefs-allergen-sev]')) {
      const id = allBtn.getAttribute('data-onb-allergen') || allBtn.getAttribute('data-prefs-allergen');
      const p = eat.prefs.get();
      const al = Object.assign({}, p.allergens);
      if (al[id]) delete al[id];
      else al[id] = 'strict';
      eat.prefs.patch({ allergens: al });
      // Re-render seulement les cartes allergènes
      render();
      return;
    }

    // Sévérité allergène (léger / strict)
    const sev = e.target.closest && e.target.closest('[data-onb-allergen-sev], [data-prefs-allergen-sev]');
    if (sev) {
      e.stopPropagation();
      const raw = sev.getAttribute('data-onb-allergen-sev') || sev.getAttribute('data-prefs-allergen-sev');
      const [id, level] = raw.split('|');
      const p = eat.prefs.get();
      const al = Object.assign({}, p.allergens);
      al[id] = level;
      eat.prefs.patch({ allergens: al });
      render();
      return;
    }

    // Toggle cuisine
    const cuisBtn = e.target.closest && e.target.closest('[data-onb-cuisine], [data-prefs-cuisine]');
    if (cuisBtn) {
      const id = cuisBtn.getAttribute('data-onb-cuisine') || cuisBtn.getAttribute('data-prefs-cuisine');
      const p = eat.prefs.get();
      const set = new Set(p.cuisines);
      if (set.has(id)) set.delete(id); else set.add(id);
      eat.prefs.patch({ cuisines: [...set] });
      cuisBtn.classList.toggle('is-selected');
      return;
    }

    // Plate swipe : 1er clic = like (+1), 2e clic = dislike (-1), 3e = neutre
    const plateBtn = e.target.closest && e.target.closest('[data-onb-plate]');
    if (plateBtn) {
      const [_id, country] = plateBtn.getAttribute('data-onb-plate').split('|');
      const p = eat.prefs.get();
      const w = Object.assign({}, p.cuisineWeights || {});
      const cur = w[country] || 0;
      let next;
      if (cur === 0) next = 1;
      else if (cur > 0) next = -1;
      else next = 0;
      w[country] = next;
      eat.prefs.patch({ cuisineWeights: w });
      plateBtn.classList.remove('is-liked', 'is-disliked');
      const tog = plateBtn.querySelector('.plate-card-toggle');
      if (next > 0) { plateBtn.classList.add('is-liked'); if (tog) tog.textContent = '♥'; }
      else if (next < 0) { plateBtn.classList.add('is-disliked'); if (tog) tog.textContent = '×'; }
      else if (tog) tog.textContent = '?';
      return;
    }

    // Toggle équipement
    const eqBtn = e.target.closest && e.target.closest('[data-onb-equipment], [data-prefs-equipment]');
    if (eqBtn) {
      const id = eqBtn.getAttribute('data-onb-equipment') || eqBtn.getAttribute('data-prefs-equipment');
      const p = eat.prefs.get();
      const set = new Set(p.equipment);
      if (set.has(id)) set.delete(id); else set.add(id);
      eat.prefs.patch({ equipment: [...set] });
      eqBtn.classList.toggle('is-selected');
      return;
    }

    // Mood (healthy / gourmand / comfort / etc.) — multi-select toggle
    const moodBtn = e.target.closest && e.target.closest('[data-onb-mood], [data-prefs-mood]');
    if (moodBtn) {
      const id = moodBtn.getAttribute('data-onb-mood') || moodBtn.getAttribute('data-prefs-mood');
      const p = eat.prefs.get();
      const set = new Set(p.moods || []);
      if (set.has(id)) set.delete(id); else set.add(id);
      eat.prefs.patch({ moods: [...set] });
      moodBtn.classList.toggle('is-selected');
      return;
    }

    // Niveau cuisinier
    const lvlBtn = e.target.closest && e.target.closest('[data-onb-level], [data-prefs-level]');
    if (lvlBtn) {
      const lvl = parseInt(lvlBtn.getAttribute('data-onb-level') || lvlBtn.getAttribute('data-prefs-level'), 10);
      eat.prefs.patch({ cookingLevel: lvl });
      // Met à jour l'état visuel des cards du même groupe
      const grid = lvlBtn.closest('.level-grid');
      if (grid) grid.querySelectorAll('.level-card').forEach(c => c.classList.toggle('is-selected', c === lvlBtn));
      return;
    }

    // Stepper foyer (onboarding ou prefs)
    const stepBtn = e.target.closest && e.target.closest('[data-onb-household], [data-prefs-household]');
    if (stepBtn) {
      const raw = stepBtn.getAttribute('data-onb-household') || stepBtn.getAttribute('data-prefs-household');
      const [field, deltaStr] = raw.split('|');
      const delta = parseInt(deltaStr, 10);
      const p = eat.prefs.get();
      const h = Object.assign({ adults: 2, kids: 0 }, p.household || {});
      h[field] = Math.max(field === 'adults' ? 1 : 0, Math.min(20, (h[field] || 0) + delta));
      eat.prefs.patch({ household: h });
      const valEl = document.getElementById('onb-' + field) || document.getElementById('prefs-' + field);
      if (valEl) valEl.textContent = h[field];
      return;
    }

    // Remove dislike
    const rmDislike = e.target.closest && e.target.closest('[data-prefs-dislike-remove]');
    if (rmDislike) {
      const item = rmDislike.getAttribute('data-prefs-dislike-remove');
      const p = eat.prefs.get();
      eat.prefs.patch({ dislikes: (p.dislikes || []).filter(x => x !== item) });
      render();
      return;
    }

    // Onboarding finish
    if (e.target && e.target.id === 'onb-finish') {
      eat.prefs.completeOnboarding(false);
      location.hash = eat.routeUrl('home');
      return;
    }
  });

  // ── v1.2 — Live password strength meter ─────────────────
  // ── v1.3 — Sliders (épicé / budget / temps) ────────────
  document.addEventListener('input', (e) => {
    if (e.target && (e.target.id === 'signup-password' || e.target.id === 'pwd-new' || e.target.id === 'reset-password')) {
      updatePwdStrength(e.target.value);
    }

    // Slider épicé (onboarding ou prefs)
    if (e.target && (e.target.id === 'onb-spice' || e.target.id === 'prefs-spice')) {
      const v = parseInt(e.target.value, 10);
      e.target.style.setProperty('--pct', (v / 5) * 100 + '%');
      eat.prefs.patch({ spiceTolerance: v });
      // Met à jour le label du titre de section
      const titleSpan = e.target.closest('.onb-section, .prefs-section').querySelector('.onb-section-title strong, .prefs-section-title span');
      if (titleSpan) titleSpan.textContent = eat.prefs.SPICE_LABELS[v];
      return;
    }
    // Slider budget
    if (e.target && (e.target.id === 'onb-budget' || e.target.id === 'prefs-budget')) {
      const v = parseInt(e.target.value, 10);
      e.target.style.setProperty('--pct', ((v - 30) / 270) * 100 + '%');
      eat.prefs.patch({ weeklyBudget: v });
      const valEl = document.getElementById('onb-budget-val') || document.getElementById('prefs-budget-val');
      if (valEl) valEl.textContent = v;
      return;
    }
    // Slider temps
    if (e.target && (e.target.id === 'onb-time' || e.target.id === 'prefs-time')) {
      const v = parseInt(e.target.value, 10);
      e.target.style.setProperty('--pct', ((v - 15) / 105) * 100 + '%');
      eat.prefs.patch({ weeknightMinutes: v });
      const valEl = document.getElementById('onb-time-val') || document.getElementById('prefs-time-val');
      if (valEl) valEl.textContent = v;
      return;
    }
    // Code postal
    if (e.target && (e.target.id === 'onb-zip' || e.target.id === 'prefs-zip')) {
      eat.prefs.patch({ zip: e.target.value.trim().slice(0, 10) });
      return;
    }
  });
  function updatePwdStrength(value) {
    const wrap = document.getElementById('pwd-strength');
    if (!wrap) return;
    if (!value) {
      wrap.hidden = true;
      return;
    }
    wrap.hidden = false;
    const s = eat.auth.passwordStrength(value);
    wrap.dataset.score = String(s.score);
    const lbl = document.getElementById('pwd-strength-label');
    if (lbl) lbl.textContent = s.label;
    const hints = document.getElementById('pwd-strength-hints');
    if (hints) {
      hints.innerHTML = s.hints.length
        ? s.hints.slice(0, 3).map(h => `<li>${eat.esc(h)}</li>`).join('')
        : '<li style="color:var(--primary);">tu as tout bon ✓</li>';
    }
  }

  // Pantry add form
  document.addEventListener('submit', (e) => {
    if (e.target && e.target.id === 'pantry-add-form') {
      e.preventDefault();
      const input = document.getElementById('pantry-add-input');
      if (!input) return;
      const val = input.value.trim();
      if (!val) return;
      // permet d'ajouter plusieurs items séparés par virgule
      val.split(',').map(s => s.trim()).filter(Boolean).forEach(item => eat.pantryAdd(item));
      input.value = '';
      render();
      const fresh = document.getElementById('pantry-add-input');
      if (fresh) fresh.focus();
      return;
    }

    // ── v1.1 — Submit review ────────────────────────────────
    if (e.target && e.target.id === 'review-form') {
      e.preventDefault();
      const recipeId = e.target.getAttribute('data-recipe');
      const wrap = document.getElementById('review-stars');
      const rating = wrap ? parseInt(wrap.dataset.value || '0', 10) : 0;
      const comment = (document.getElementById('review-comment') || {}).value || '';
      if (!rating) {
        alert('Choisis une note avant de publier.');
        return;
      }
      const res = eat.addReview(recipeId, rating, comment);
      if (!res.ok && res.error === 'no-user') {
        alert('Crée ton profil avant de poster un avis.');
        location.hash = eat.routeUrl('profile');
        return;
      }
      render();
      return;
    }

    // ── v1.2 — Submit signup ───────────────────────────────
    if (e.target && e.target.id === 'signup-form') {
      e.preventDefault();
      handleSignup(e.target);
      return;
    }

    // ── v1.2 — Submit login ────────────────────────────────
    if (e.target && e.target.id === 'login-form') {
      e.preventDefault();
      handleLogin(e.target);
      return;
    }

    // ── v1.2 — Submit forgot ───────────────────────────────
    if (e.target && e.target.id === 'forgot-form') {
      e.preventDefault();
      handleForgot(e.target);
      return;
    }

    // ── v1.2 — Submit reset ────────────────────────────────
    if (e.target && e.target.id === 'reset-form') {
      e.preventDefault();
      handleReset(e.target);
      return;
    }

    // ── v1.2 — Submit settings (profil) ────────────────────
    if (e.target && e.target.id === 'settings-form') {
      e.preventDefault();
      handleSettings(e.target);
      return;
    }

    // ── v1.2 — Submit change password ──────────────────────
    if (e.target && e.target.id === 'password-form') {
      e.preventDefault();
      handlePasswordChange(e.target);
      return;
    }

    // ── v1.2 — Submit delete account ───────────────────────
    if (e.target && e.target.id === 'delete-form') {
      e.preventDefault();
      handleDeleteAccount(e.target);
      return;
    }

    // ── v1.3 — Add dislike ─────────────────────────────────
    if (e.target && e.target.id === 'prefs-dislike-form') {
      e.preventDefault();
      const inp = document.getElementById('prefs-dislike-input');
      if (!inp) return;
      const val = inp.value.trim().toLowerCase();
      if (!val) return;
      val.split(',').map(s => s.trim()).filter(Boolean).forEach(item => {
        const p = eat.prefs.get();
        if (!p.dislikes.includes(item)) {
          eat.prefs.patch({ dislikes: [...p.dislikes, item] });
        }
      });
      inp.value = '';
      render();
      return;
    }
  });

  // ─────────────────────────────────────────────────────────
  // v1.2 — Auth form handlers (async)
  // ─────────────────────────────────────────────────────────

  function showError(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    if (msg) { el.textContent = msg; el.hidden = false; }
    else { el.hidden = true; el.textContent = ''; }
  }
  function showFormBanner(id, msg, kind) {
    const el = document.getElementById(id);
    if (!el) return;
    if (!msg) { el.hidden = true; return; }
    el.hidden = false;
    el.className = 'auth-banner auth-banner-' + (kind || 'error');
    el.innerHTML = `<span class="auth-banner-icon">${kind === 'success' ? '✓' : '⚠'}</span><div>${eat.esc(msg)}</div>`;
  }
  function clearAllErrors(form) {
    form.querySelectorAll('.field-error').forEach(el => { el.hidden = true; el.textContent = ''; });
    form.querySelectorAll('.field-input').forEach(el => el.classList.remove('is-error'));
    const banner = form.querySelector('.auth-banner-error');
    if (banner) banner.hidden = true;
  }
  function setBusy(button, busy, busyLabel) {
    if (!button) return;
    if (busy) {
      button.dataset.label = button.textContent;
      button.disabled = true;
      button.innerHTML = `<span class="btn-spinner"></span> ${eat.esc(busyLabel || 'Patiente…')}`;
    } else {
      button.disabled = false;
      if (button.dataset.label) button.textContent = button.dataset.label;
    }
  }

  async function handleSignup(form) {
    clearAllErrors(form);
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const avatar = document.getElementById('signup-avatar').value;
    const terms = document.getElementById('signup-terms').checked;
    const next = form.getAttribute('data-next') || '';

    if (!terms) {
      showFormBanner('signup-form-error', 'Accepte les conditions pour continuer.', 'error');
      return;
    }

    const submit = document.getElementById('signup-submit');
    setBusy(submit, true, 'Création…');
    const res = await eat.auth.signup({ name, email, password, avatar });
    setBusy(submit, false);

    if (!res.ok) {
      const serverMsg = res.message
        ? `Erreur serveur — ${res.message}`
        : 'Le serveur ne répond pas correctement. Réessaie dans un instant.';
      const map = {
        'name':           ['signup-name-error', 'Nom requis (2 caractères minimum).'],
        'email-format':   ['signup-email-error', 'Format e-mail invalide.'],
        'email-taken':    ['signup-email-error', 'Un compte existe déjà avec cet e-mail.'],
        'password-weak':  ['signup-password-error', 'Mot de passe trop faible (8 caractères minimum).'],
        'rate-limit':     ['signup-form-error', 'Trop de tentatives. Réessaie dans 15 minutes.'],
        'network':        ['signup-form-error', 'Pas de connexion au serveur. Vérifie ton réseau.'],
        'server':         ['signup-form-error', serverMsg],
      };
      const [errId, msg] = map[res.error] || ['signup-form-error', 'Création impossible.'];
      const inputId = errId.replace('-error', '');
      const inp = document.getElementById(inputId);
      if (inp) inp.classList.add('is-error');
      showError(errId, msg);
      if (errId === 'signup-form-error') showFormBanner('signup-form-error', msg, 'error');
      return;
    }

    // Connecté → on lance l'onboarding direct (sauf si une destination next est demandée explicitement)
    location.hash = next || eat.routeUrl('onboarding', ['1']);
  }

  async function handleLogin(form) {
    clearAllErrors(form);
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const remember = document.getElementById('login-remember').checked;
    const next = form.getAttribute('data-next') || '';

    const submit = document.getElementById('login-submit');
    setBusy(submit, true, 'Connexion…');
    const res = await eat.auth.login(email, password, remember);
    setBusy(submit, false);

    if (!res.ok) {
      const map = {
        'email-format':   'Format e-mail invalide.',
        'no-account':     'Aucun compte avec cet e-mail.',
        'wrong-password': 'Mot de passe incorrect.',
        'rate-limit':     'Trop de tentatives. Réessaie dans 15 minutes.',
        'invalid-input':  'Données invalides (email ou mot de passe).',
        'network':        'Pas de connexion au serveur. Vérifie ton réseau.',
        'server':         res.message
                            ? `Erreur serveur — ${res.message}`
                            : 'Le serveur ne répond pas correctement. Réessaie dans un instant.',
      };
      showFormBanner('login-form-error', map[res.error] || 'Connexion impossible.', 'error');
      return;
    }

    location.hash = next || eat.routeUrl('account');
  }

  function handleForgot(form) {
    clearAllErrors(form);
    const email = document.getElementById('forgot-email').value;
    const submit = document.getElementById('forgot-submit');
    setBusy(submit, true, 'Envoi…');
    const res = eat.auth.requestReset(email);
    setBusy(submit, false);
    if (!res.ok) {
      const inp = document.getElementById('forgot-email');
      if (inp) inp.classList.add('is-error');
      showError('forgot-email-error', 'Format e-mail invalide.');
      return;
    }
    // Pour le prototype : on passe le token en query pour afficher le lien
    location.hash = eat.routeUrl('forgot', [], { sent: '1', token: res.token || '', exists: res.exists ? '1' : '0' });
  }

  async function handleReset(form) {
    clearAllErrors(form);
    const password = document.getElementById('reset-password').value;
    const password2 = document.getElementById('reset-password-confirm').value;
    const token = form.getAttribute('data-token');

    if (password !== password2) {
      const inp = document.getElementById('reset-password-confirm');
      if (inp) inp.classList.add('is-error');
      showError('reset-password-confirm-error', 'Les mots de passe ne correspondent pas.');
      return;
    }

    const submit = document.getElementById('reset-submit');
    setBusy(submit, true, 'Mise à jour…');
    const res = await eat.auth.applyReset(token, password);
    setBusy(submit, false);

    if (!res.ok) {
      if (res.error === 'password-weak') {
        showError('reset-password-error', 'Mot de passe trop faible (8 caractères minimum).');
      } else {
        showFormBanner('reset-form-error', 'Lien invalide ou expiré. Demande un nouveau lien.', 'error');
      }
      return;
    }

    location.hash = eat.routeUrl('login', [], { banner: 'reset-success' });
  }

  async function handleSettings(form) {
    clearAllErrors(form);
    const name = document.getElementById('settings-name').value;
    const email = document.getElementById('settings-email').value;
    const avatar = document.getElementById('settings-avatar-input').value;

    const submit = document.getElementById('settings-submit');
    setBusy(submit, true, 'Enregistrement…');
    const res = await eat.auth.updateProfile({ name, email, avatar });
    setBusy(submit, false);

    if (!res.ok) {
      const map = {
        'name':                ['settings-name-error', 'Nom requis (2 caractères minimum).'],
        'email-format':        ['settings-email-error', 'Format e-mail invalide.'],
        'email-taken':         ['settings-email-error', 'Cet e-mail est déjà utilisé par un autre compte.'],
        'not-yet-implemented': ['settings-form-error', 'Édition du profil bientôt disponible.'],
      };
      const [errId, msg] = map[res.error] || ['settings-form-error', 'Mise à jour impossible.'];
      const inputId = errId.replace('-error', '');
      const inp = document.getElementById(inputId);
      if (inp) inp.classList.add('is-error');
      showError(errId, msg);
      if (errId === 'settings-form-error') showFormBanner('settings-form-error', msg, 'error');
      return;
    }
    showFormBanner('settings-success', '', 'success');
    document.getElementById('settings-success').hidden = false;
    updateNavAuthState();
    setTimeout(() => render(), 1500);
  }

  async function handlePasswordChange(form) {
    clearAllErrors(form);
    const current = document.getElementById('pwd-current').value;
    const next = document.getElementById('pwd-new').value;

    const submit = document.getElementById('pwd-submit');
    setBusy(submit, true, 'Mise à jour…');
    const res = await eat.auth.changePassword(current, next);
    setBusy(submit, false);

    if (!res.ok) {
      if (res.error === 'wrong-current') {
        document.getElementById('pwd-current').classList.add('is-error');
        showError('pwd-current-error', 'Mot de passe actuel incorrect.');
      } else if (res.error === 'password-weak') {
        document.getElementById('pwd-new').classList.add('is-error');
        showError('pwd-new-error', 'Nouveau mot de passe trop faible (8 caractères minimum).');
      } else if (res.error === 'not-yet-implemented') {
        showFormBanner('pwd-form-error', 'Changement de mot de passe bientôt disponible.', 'error');
      } else {
        showFormBanner('pwd-form-error', 'Changement impossible.', 'error');
      }
      return;
    }
    document.getElementById('pwd-current').value = '';
    document.getElementById('pwd-new').value = '';
    document.getElementById('pwd-success').hidden = false;
    setTimeout(() => { document.getElementById('pwd-success').hidden = true; }, 3500);
  }

  async function handleDeleteAccount(form) {
    clearAllErrors(form);
    if (!confirm('Es-tu absolument sûr ? Cette action est irréversible.')) return;
    const password = document.getElementById('del-pwd').value;
    const submit = document.getElementById('del-submit');
    setBusy(submit, true, 'Suppression…');
    const res = await eat.auth.deleteAccount(password);
    setBusy(submit, false);
    if (!res.ok) {
      if (res.error === 'wrong-password') {
        document.getElementById('del-pwd').classList.add('is-error');
        showError('del-pwd-error', 'Mot de passe incorrect.');
      } else if (res.error === 'not-yet-implemented') {
        showFormBanner('del-form-error', 'Suppression de compte bientôt disponible. Contacte le support si urgent.', 'error');
      } else {
        showFormBanner('del-form-error', 'Suppression impossible.', 'error');
      }
      return;
    }
    location.hash = eat.routeUrl('home');
  }

  // ── Boot ─────────────────────────────────────────────────
  window.addEventListener('hashchange', render);
  window.addEventListener('DOMContentLoaded', render);
  if (document.readyState !== 'loading') render();

})();
