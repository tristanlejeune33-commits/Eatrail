/* eatrail · v1 — views
 * Chaque view exporte un renderer qui retourne un string HTML.
 * Les delegations d'événements sont attachées dans app.js après render.
 */

window.eat = window.eat || {};

(function (eat) {
  'use strict';

  const esc = eat.esc;

  // ─────────────────────────────────────────────────────────
  // Composants partagés
  // ─────────────────────────────────────────────────────────

  function recipeCard(r) {
    const tags = [];
    const cat = eat.categoryMeta(r.category);
    if (cat) tags.push(`<span class="tag">${cat.emoji} ${esc(cat.label.replace(/s$/, ''))}</span>`);
    if ((r.moods || []).includes('quick')) tags.push('<span class="tag tag-mood">⚡ Express</span>');
    if ((r.moods || []).includes('spicy')) tags.push('<span class="tag tag-mood">🌶 Épicé</span>');
    if ((r.diets || []).includes('vegan')) tags.push('<span class="tag tag-diet">Vegan</span>');
    else if ((r.diets || []).includes('vegetarian')) tags.push('<span class="tag tag-diet">Végé</span>');
    if ((r.diets || []).includes('gluten-free')) tags.push('<span class="tag tag-diet">Sans gluten</span>');
    const rareCount = eat.countRare(r);
    if (rareCount > 0) tags.push('<span class="tag tag-rare">' + rareCount + ' rare' + (rareCount > 1 ? 's' : '') + '</span>');

    const rating = eat.recipeRating(r.id);
    const ratingHtml = rating.count > 0
      ? `<div class="rating-summary" style="margin-bottom:10px;font-size:13px;">
           <span class="stars stars-sm">${eat.starsHtml(rating.avg)}</span>
           <span>${rating.avg} · ${rating.count} avis</span>
         </div>`
      : '';

    const isSaved = eat.isSaved(r.id);

    const imgUrl = (window.EATRAIL_IMAGES || {})[r.id];
    const imgHtml = imgUrl
      ? `<img class="recipe-card-img" src="${esc(imgUrl)}" alt="" loading="lazy" onerror="this.remove();" />`
      : '';

    // Validator avatar = first letter of first + last name
    const v = r.validator || {};
    const initials = (v.name || '?').split(/\s+/).filter(Boolean).map(s => s[0]).join('').slice(0, 2).toUpperCase();
    const ingCount = Array.isArray(r.ingredients) ? r.ingredients.length : 0;

    return `
      <a class="recipe-card" href="${eat.routeUrl('recipe', [r.id])}">
        <div class="recipe-card-hero" style="background:${esc(r.gradient)}">
          ${imgHtml}
          <div class="recipe-card-flag">${esc(r.origin.flag)}</div>
          <div class="recipe-card-auth">AUTH ${r.auth}</div>
          ${isSaved ? '<div class="recipe-card-auth" style="top:56px;background:var(--accent);">★ Favori</div>' : ''}
          <div class="recipe-card-meta-floating">
            <span>${eat.fmtDuration(r.duration)}</span>
            <span>${esc(r.budget.level)} · ${ingCount} ing</span>
            <span>${esc(r.origin.region || r.origin.country)}</span>
          </div>
        </div>
        <div class="recipe-card-body">
          <h3 class="recipe-card-title">${esc(r.title)}</h3>
          <p class="recipe-card-desc">${esc(r.summary)}</p>
          ${ratingHtml}
          ${tags.length > 0 ? `<div class="recipe-card-tags">${tags.join('')}</div>` : ''}
          ${v.name ? `<div class="recipe-card-validator">
            <span class="rcv-avatar">${esc(initials)}</span>
            <span><b>${esc(v.name)}</b>${v.city ? ' · ' + esc(v.city) : ''}</span>
          </div>` : ''}
        </div>
      </a>
    `;
  }

  // Adaptive shop card — works with both legacy static shops and API-returned shops.
  // Static shops have: distMi, auth, story, rareCarried, priceLevel, type
  // API shops have: distMiles, walkMin, authScore, coverageScore, ingredientScores, covering, source
  function shopCard(s) {
    const dist = s.distMiles != null ? s.distMiles.toFixed(1) : (s.distMi != null ? s.distMi : '?');
    const auth = s.authScore != null ? s.authScore : s.auth;
    const story = s.story || s.description || '';
    const rare = (s.rareCarried || []).length;
    const tagsRaw = Array.isArray(s.tags) ? s.tags.map(t => typeof t === 'string' ? t : t.tag).filter(Boolean) : [];
    const tagPills = tagsRaw
      .filter(t => !['supermarket', 'pantry', 'produce', 'butcher', 'fish', 'specialty', 'spice'].includes(t))
      .slice(0, 4)
      .map(t => `<span class="tag">${esc(t)}</span>`)
      .join('');

    // Match coverage badge (when scored against a recipe)
    const cov = s.coverageScore != null ? Math.round(s.coverageScore * 100) : null;
    const covBadge = cov != null ? `
      <div class="shop-cov-pill" style="background:${cov >= 70 ? 'var(--tint-primary)' : cov >= 45 ? 'var(--tint-gold)' : 'var(--tint-accent)'};color:${cov >= 70 ? 'var(--primary-dark)' : cov >= 45 ? '#8E6815' : 'var(--accent)'};font-size:11px;font-weight:700;padding:4px 10px;border-radius:999px;display:inline-block;margin-left:8px;">${cov}% match</div>
    ` : '';

    const covering = s.covering && s.covering.length > 0
      ? `<div class="shop-covering" style="font-size:12px;color:var(--primary);margin-top:6px;font-weight:600;">✓ Couvre : ${s.covering.slice(0, 4).map(esc).join(', ')}${s.covering.length > 4 ? '…' : ''}</div>`
      : '';

    const sourceBadge = s.source === 'GOOGLE'
      ? `<span style="font-size:10px;color:var(--muted);background:var(--cream-deep);padding:2px 7px;border-radius:999px;margin-left:6px;">Google</span>` : '';

    return `
      <a class="shop-card" href="${eat.routeUrl('shop', [s.id])}">
        <div class="shop-card-head">
          <div>
            <div class="shop-card-name">${esc(s.name)}${sourceBadge}</div>
            <div class="shop-card-neighborhood">${esc(s.neighborhood || s.address || '')}</div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
            <div class="shop-auth-pill ${eat.authClass(auth || 70)}">Auth ${auth || '?'}</div>
            ${covBadge}
          </div>
        </div>
        <div class="shop-card-distance">📍 ${dist} mi${s.walkMin ? ' · ' + s.walkMin + ' min à pied' : ''} · ${s.priceLevel || '$$'}${s.type ? ' · ' + esc(s.type) : ''}</div>
        ${tagPills ? `<div class="shop-card-tags">${tagPills}</div>` : ''}
        ${covering}
        ${rare > 0 ? `<div class="shop-rare-list">${rare} ingrédient${rare > 1 ? 's' : ''} rare${rare > 1 ? 's' : ''} en stock</div>` : ''}
        ${story ? `<div class="shop-card-story">${esc(story.slice(0, 200))}</div>` : ''}
      </a>
    `;
  }

  // ─────────────────────────────────────────────────────────
  // HOME
  // ─────────────────────────────────────────────────────────

  eat.viewHome = function () {
    const recipes = eat.allRecipes();
    const featured = recipes.slice(0, 3);
    const quick = recipes.filter(r => (r.moods || []).includes('quick')).slice(0, 4);
    const wow = recipes.filter(r => (r.moods || []).includes('wow')).slice(0, 4);

    const moodTiles = [
      { id: 'comfort', label: 'Réconfort', emoji: '🍲' },
      { id: 'quick', label: 'Express', emoji: '⚡' },
      { id: 'wow', label: 'Effet wow', emoji: '✨' },
      { id: 'spicy', label: 'Épicé', emoji: '🌶' },
      { id: 'street', label: 'Street food', emoji: '🥡' },
      { id: 'festive', label: 'Festif', emoji: '🎉' },
      { id: 'healthy', label: 'Healthy', emoji: '🥗' }
    ].map(m => {
      const count = recipes.filter(r => (r.moods || []).includes(m.id)).length;
      return `
        <a class="tile-mood" href="${eat.routeUrl('recipes', [], { mood: m.id })}">
          <span class="tile-mood-emoji">${m.emoji}</span>
          <span class="tile-mood-label">${m.label}</span>
          <span class="tile-mood-count">${count} recette${count > 1 ? 's' : ''}</span>
        </a>`;
    }).join('');

    // catégories tiles
    const catCounts = eat.categoryCounts();
    const catTiles = eat.CATEGORIES
      .filter(c => catCounts[c.id])
      .map(c => `
        <a class="tile-cat" href="${eat.routeUrl('recipes', [], { category: c.id })}">
          <span class="tile-cat-emoji">${c.emoji}</span>
          <span class="tile-cat-label">${c.label}</span>
          <span class="tile-cat-count">${catCounts[c.id]} recette${catCounts[c.id] > 1 ? 's' : ''}</span>
        </a>`).join('');

    // recommandations personnalisées
    const recos = eat.personalRecs(4);
    const u = eat.user();
    const recosTitle = eat.savedIds().length > 0
      ? (u ? `Pour toi, ${esc(u.name)}` : 'Pour toi')
      : 'Suggestions du moment';
    const useMatch = eat.prefs && eat.prefs.hasActivePrefs && eat.prefs.hasActivePrefs();
    const recosSubtitle = useMatch
      ? 'basé sur tes préférences'
      : (eat.savedIds().length > 0 ? 'basé sur tes favoris' : '');
    const recosHtml = recos.length > 0 ? `
      <section class="home-section">
        <div class="home-section-head">
          <h2>${recosTitle}</h2>
          ${recosSubtitle ? `<span style="font-size:13px;color:var(--muted);">${recosSubtitle}</span>` : ''}
        </div>
        <div class="recipe-grid">${recos.map(useMatch ? recipeCardWithMatch : recipeCard).join('')}</div>
      </section>` : '';

    // v1.3 — bannière reprise onboarding si compte actif et onboarding pas fini
    const onbBanner = (eat.prefs && eat.prefs.isOnboardingNeeded && eat.prefs.isOnboardingNeeded()) ? `
      <div class="onb-banner">
        <div class="onb-banner-icon">✨</div>
        <div class="onb-banner-body">
          <div class="onb-banner-title">Termine ta découverte</div>
          <div class="onb-banner-text">${5 - ((eat.prefs.get().onboardingStep || 1) - 1)} questions pour activer les recommandations sur-mesure.</div>
        </div>
        <a class="btn btn-sm" href="${eat.routeUrl('onboarding', [String(eat.prefs.onboardingResumeStep())])}">Reprendre →</a>
      </div>` : '';

    // Greeting (uses real user name if logged in)
    const userName = (u && u.name) ? u.name.split(' ')[0] : null;
    const hour = new Date().getHours();
    const salut = hour < 12 ? 'Bonjour' : (hour < 18 ? 'Bel après-midi' : 'Bonsoir');
    const greetingText = userName ? `${salut} ${esc(userName)}.` : `${salut}.`;
    const dayLabels = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
    const today = dayLabels[new Date().getDay()];

    // Quick suggested trail (uses 3 first shops)
    const trailShops = (eat.shops || []).slice(0, 4).map(s => s.name).join(' · ');

    return `
      <div class="container page fade-in">

        ${onbBanner}

        <h1 class="greeting">${greetingText}<br/><em>Que cuisinons</em>-nous ?</h1>
        <p class="greeting-sub">${today} · 30 magasins ouverts à NYC · ${recipes.length} recettes prêtes</p>

        <div class="trail-banner">
          <div class="eyebrow">Ton trail · Ce soir</div>
          <h3>4 magasins. <em>1.2 mi.</em><br/>32 minutes à pied.</h3>
          <div class="trail-meta">${esc(trailShops)}</div>
          <a class="trail-cta" href="${eat.routeUrl('shops')}">Lancer le trail →</a>
        </div>

        <section class="home-hero">
          <div class="home-hero-inner">
            <span class="home-hero-eyebrow">NYC · v1.6 · ${recipes.length} recettes</span>
            <h1>Cuisine le monde.<br/><em>Achète à côté.</em></h1>
            <p>Choisis un plat. eatrail te dit quoi acheter — et où le trouver vraiment, autour de toi.</p>
            <div class="home-hero-cta">
              <a class="btn btn-ink" href="${eat.routeUrl('recipes')}">Parcourir les recettes</a>
              <a class="btn btn-ghost" href="${eat.routeUrl('shops')}">Voir les magasins</a>
            </div>
          </div>
        </section>

        <section class="home-section">
          <div class="home-section-head">
            <h2>Choisis ton humeur</h2>
          </div>
          <div class="tile-row">${moodTiles}</div>
        </section>

        <section class="home-section">
          <div class="home-section-head">
            <h2>Par catégorie</h2>
          </div>
          <div class="category-row">${catTiles}</div>
        </section>

        ${recosHtml}

        <section class="home-section">
          <div class="home-section-head">
            <h2>À l'honneur</h2>
            <a href="${eat.routeUrl('recipes')}">Tout voir →</a>
          </div>
          <div class="recipe-grid">${featured.map(recipeCard).join('')}</div>
        </section>

        <section class="home-section">
          <div class="home-section-head">
            <h2>Rapides — moins de 45 min</h2>
            <a href="${eat.routeUrl('recipes', [], { mood: 'quick' })}">Tout voir →</a>
          </div>
          <div class="recipe-grid">${quick.map(recipeCard).join('')}</div>
        </section>

        <section class="home-section">
          <div class="home-section-head">
            <h2>Effet wow garanti</h2>
            <a href="${eat.routeUrl('recipes', [], { mood: 'wow' })}">Tout voir →</a>
          </div>
          <div class="recipe-grid">${wow.map(recipeCard).join('')}</div>
        </section>

      </div>
    `;
  };

  // ─────────────────────────────────────────────────────────
  // RECIPES (catalog)
  // ─────────────────────────────────────────────────────────

  eat.viewRecipes = function (query) {
    const excludeAllergens = (query.noallergens || '').split(',').filter(Boolean);
    const ignorePrefs = query.nofilter === '1';
    // v1.4 — pagination : page courante, 30 cards par page
    const PAGE_SIZE = 30;
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const filters = {
      q: query.q || '',
      country: query.country || '',
      mood: query.mood || '',
      diet: query.diet || '',
      category: query.category || '',
      excludeAllergens
    };
    let results = eat.searchRecipes(filters);
    const totalBeforePrefs = results.length;

    // v1.3 : applique les préférences du compte par défaut (sauf opt-out)
    const hasPrefs = eat.prefs.hasActivePrefs();
    if (hasPrefs && !ignorePrefs) {
      results = eat.prefs.filterRecipes(results, { sortByScore: true });
    }
    const filteredOut = totalBeforePrefs - results.length;

    // pagination : on calcule la slice à afficher
    const totalResults = results.length;
    const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const visible = results.slice(0, safePage * PAGE_SIZE);
    const hasMore = visible.length < totalResults;
    const countries = [...new Set(eat.allRecipes().map(r => r.origin.country))].sort();

    const moodOptions = ['comfort', 'quick', 'wow', 'spicy', 'street', 'festive', 'healthy'];
    const dietOptions = ['vegetarian', 'vegan', 'dairy-free', 'gluten-free', 'pescatarian', 'halal-friendly'];

    // helper pour rebuild query string sans les filtres internes
    const queryFor = (extra) => {
      const q = { q: filters.q, country: filters.country, mood: filters.mood, diet: filters.diet, category: filters.category, noallergens: excludeAllergens.join(',') };
      Object.assign(q, extra);
      return q;
    };

    const catChips = eat.CATEGORIES.map(c => {
      const active = filters.category === c.id;
      const next = active ? '' : c.id;
      return `<a class="filter-chip ${active ? 'is-active' : ''}" href="${eat.routeUrl('recipes', [], queryFor({ category: next }))}">${c.emoji} ${esc(c.label)}</a>`;
    }).join('');

    const moodChips = moodOptions.map(m => {
      const active = filters.mood === m;
      const next = active ? '' : m;
      return `<a class="filter-chip ${active ? 'is-active' : ''}" href="${eat.routeUrl('recipes', [], queryFor({ mood: next }))}">${m}</a>`;
    }).join('');

    const dietChips = dietOptions.map(d => {
      const active = filters.diet === d;
      const next = active ? '' : d;
      return `<a class="filter-chip ${active ? 'is-active' : ''}" href="${eat.routeUrl('recipes', [], queryFor({ diet: next }))}">${d}</a>`;
    }).join('');

    const allergenChips = eat.ALLERGENS.map(a => {
      const active = excludeAllergens.includes(a);
      const nextList = active ? excludeAllergens.filter(x => x !== a) : [...excludeAllergens, a];
      return `<a class="filter-chip ${active ? 'is-active' : ''}" href="${eat.routeUrl('recipes', [], queryFor({ noallergens: nextList.join(',') }))}">${active ? '✓ sans' : 'sans'} ${esc(a)}</a>`;
    }).join('');

    const countryOptions = countries.map(c =>
      `<option value="${esc(c)}" ${filters.country === c ? 'selected' : ''}>${esc(c)}</option>`
    ).join('');

    const hasFilters = filters.q || filters.country || filters.mood || filters.diet || filters.category || excludeAllergens.length;

    // v1.3 : barre indiquant que les préférences sont appliquées
    const prefsBar = (hasPrefs && !ignorePrefs) ? `
      <div class="prefs-active-bar">
        <div>
          🎯 <strong>${eat.prefs.activeFilterCount()} préférence${eat.prefs.activeFilterCount() > 1 ? 's' : ''}</strong> appliquée${eat.prefs.activeFilterCount() > 1 ? 's' : ''}.
          ${filteredOut > 0 ? `${filteredOut} recette${filteredOut > 1 ? 's' : ''} masquée${filteredOut > 1 ? 's' : ''}.` : 'Tri par pertinence.'}
        </div>
        <div style="display:flex;gap:8px;">
          <a class="btn btn-ghost btn-sm" href="${eat.routeUrl('preferences')}">Modifier</a>
          <a class="btn btn-ghost btn-sm" href="${eat.routeUrl('recipes', [], { ...query, nofilter: '1' })}">Ignorer mes prefs</a>
        </div>
      </div>` : (ignorePrefs && hasPrefs) ? `
      <div class="prefs-active-bar" style="background:rgba(217,164,65,.1);border-color:rgba(217,164,65,.3);">
        <div>⚠ Préférences <strong>ignorées</strong>. Tu vois tout le catalogue.</div>
        <a class="btn btn-ghost btn-sm" href="${eat.routeUrl('recipes', [], { ...query, nofilter: '' })}">Ré-appliquer</a>
      </div>` : '';

    return `
      <div class="container page fade-in">
        <span class="page-eyebrow">Catalogue · ${results.length} / ${eat.allRecipes().length}</span>
        <h1 class="page-title">Toutes les recettes</h1>
        <p class="page-lead">${eat.allRecipes().length} plats du monde, validés par des cuisiniers natifs. Filtre par catégorie, régime, allergène ou pays.</p>

        ${prefsBar}

        <div class="filter-bar">
          <div class="filter-search">
            <input id="filter-q" type="search" placeholder="Chercher un plat, un pays…" value="${esc(filters.q)}" />
          </div>
          <select id="filter-country" class="filter-chip">
            <option value="">Tous les pays</option>
            ${countryOptions}
          </select>
          ${hasFilters ? `<a class="btn btn-ghost btn-sm" href="${eat.routeUrl('recipes')}">↺ Réinitialiser</a>` : ''}
        </div>

        <details class="filter-bar" style="display:block;padding:0;background:transparent;border:none;margin-bottom:14px;">
          <summary style="cursor:pointer;font-size:13px;font-weight:600;color:var(--primary);padding:6px 0;">Catégories ${filters.category ? `(${eat.categoryMeta(filters.category).label})` : ''}</summary>
          <div class="filter-group" style="margin-top:10px;">${catChips}</div>
        </details>

        <details class="filter-bar" style="display:block;padding:0;background:transparent;border:none;margin-bottom:14px;">
          <summary style="cursor:pointer;font-size:13px;font-weight:600;color:var(--primary);padding:6px 0;">Humeur ${filters.mood ? `(${filters.mood})` : ''}</summary>
          <div class="filter-group" style="margin-top:10px;">${moodChips}</div>
        </details>

        <details class="filter-bar" style="display:block;padding:0;background:transparent;border:none;margin-bottom:14px;">
          <summary style="cursor:pointer;font-size:13px;font-weight:600;color:var(--primary);padding:6px 0;">Régime ${filters.diet ? `(${filters.diet})` : ''}</summary>
          <div class="filter-group" style="margin-top:10px;">${dietChips}</div>
        </details>

        <details class="filter-bar" style="display:block;padding:0;background:transparent;border:none;margin-bottom:32px;" ${excludeAllergens.length ? 'open' : ''}>
          <summary style="cursor:pointer;font-size:13px;font-weight:600;color:var(--accent);padding:6px 0;">⚠ Allergènes à exclure ${excludeAllergens.length ? `(${excludeAllergens.length})` : ''}</summary>
          <div class="filter-group" style="margin-top:10px;">${allergenChips}</div>
        </details>

        ${totalResults === 0
          ? `<div class="empty"><h3>Aucun plat ne matche</h3><p>Essaie d'enlever un filtre, ou cherche un autre pays.</p></div>`
          : `
            <div class="recipe-grid">${visible.map(hasPrefs && !ignorePrefs ? recipeCardWithMatch : recipeCard).join('')}</div>
            ${hasMore ? `
              <div style="display:flex;justify-content:center;align-items:center;gap:14px;margin:32px 0 8px;flex-direction:column;">
                <div style="font-size:13px;color:var(--muted);">Affichage ${visible.length} / ${totalResults} recette${totalResults > 1 ? 's' : ''}</div>
                <a class="btn btn-primary" href="${eat.routeUrl('recipes', [], { ...query, page: String(safePage + 1) })}">Charger ${Math.min(PAGE_SIZE, totalResults - visible.length)} de plus →</a>
              </div>
            ` : (totalResults > PAGE_SIZE ? `
              <div style="text-align:center;margin:32px 0 8px;font-size:13px;color:var(--muted);">
                ${totalResults} recettes affichées · <a href="${eat.routeUrl('recipes', [], { ...query, page: '1' })}" style="color:var(--primary);">retour en haut</a>
              </div>
            ` : '')}
          `
        }
      </div>
    `;
  };

  // ─────────────────────────────────────────────────────────
  // RECIPE DETAIL
  // ─────────────────────────────────────────────────────────

  eat.viewRecipe = function (slug) {
    const r = eat.recipeById(slug);
    if (!r) return notFoundView('Recette introuvable');

    const servingsState = eat.state.servings[slug] || r.servings;
    const ings = eat.scaleIngredients(r, servingsState);
    const cat = eat.categoryMeta(r.category);

    const ingHtml = ings.map(ing => `
      <div class="ing-item ${ing.rare ? 'is-rare' : ''}">
        <div class="ing-name">
          ${esc(ing.name)}
          ${ing.substitutes ? `<div class="ing-substitute">Sub : ${esc(ing.substitutes.join(', '))}</div>` : ''}
        </div>
        <div class="ing-qty">${esc(ing.qty)} ${esc(ing.unit)}</div>
        ${ing.rare ? '<div class="ing-rare-tag">Rare</div>' : ''}
      </div>
    `).join('');

    const stepsHtml = r.steps.map((s, i) => `
      <div class="step-item">
        <div class="step-num-circle">${i + 1}</div>
        <div class="step-body">
          <div class="step-title">
            <span>${esc(s.title)}</span>
            ${s.time ? `<span class="step-time">${eat.fmtDuration(s.time)}</span>` : ''}
          </div>
          <div class="step-instruction">${esc(s.instruction)}</div>
        </div>
      </div>
    `).join('');

    const isSaved = eat.isSaved(r.id);
    const rating = eat.recipeRating(r.id);
    const myReview = eat.userReview(r.id);
    const allReviews = eat.recipeReviews(r.id);
    const reviewsList = allReviews
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(rv => {
        const mine = eat.user() && rv.user === eat.user().name;
        return `
        <div class="review-card ${mine ? 'review-mine' : ''}">
          <div class="review-head">
            <div class="review-author">
              <div class="review-avatar">${esc(rv.avatar || '🧑')}</div>
              <div>
                <div class="review-name">${esc(rv.user)}${mine ? '<span class="review-mine-flag">moi</span>' : ''}</div>
                <div class="review-date">${eat.fmtDate(rv.date)}</div>
              </div>
            </div>
            <div class="stars stars-sm">${eat.starsHtml(rv.rating)}</div>
          </div>
          ${rv.comment ? `<div class="review-comment">${esc(rv.comment)}</div>` : ''}
          ${mine ? `<div style="margin-top:10px;text-align:right;"><button class="btn btn-ghost btn-sm" data-delete-review="${esc(r.id)}">Supprimer mon avis</button></div>` : ''}
        </div>`;
      }).join('');

    // formulaire d'avis
    const userExists = eat.hasUser();
    const currentRating = (myReview && myReview.rating) || 0;
    const currentComment = (myReview && myReview.comment) || '';
    const reviewForm = userExists ? `
      <form class="review-form" id="review-form" data-recipe="${esc(r.id)}">
        <label>Ta note</label>
        <div class="stars-input" id="review-stars" data-value="${currentRating}">
          ${[1, 2, 3, 4, 5].map(n => `<button type="button" data-star="${n}" class="${n <= currentRating ? 'is-on' : ''}" aria-label="${n} étoiles">★</button>`).join('')}
        </div>
        <label style="margin-top:14px;">Commentaire (optionnel)</label>
        <textarea id="review-comment" placeholder="Qu'est-ce que tu en as pensé ?" maxlength="800">${esc(currentComment)}</textarea>
        <div class="review-form-row">
          <span style="font-size:12px;color:var(--muted);">800 caractères max</span>
          <button class="btn btn-primary btn-sm" type="submit">${myReview ? 'Mettre à jour' : 'Publier mon avis'}</button>
        </div>
      </form>
    ` : `
      <div class="auth-gate">
        <div class="auth-gate-icon">✍</div>
        <h3>Donne ton avis</h3>
        <p>Connecte-toi ou crée un compte pour publier ta note et ton commentaire.</p>
        <div class="auth-gate-actions">
          <a class="btn btn-primary btn-sm" href="${eat.routeUrl('signup', [], { next: '#/recipe/' + r.id })}">Créer un compte</a>
          <a class="btn btn-ghost btn-sm" href="${eat.routeUrl('login', [], { next: '#/recipe/' + r.id })}">Se connecter</a>
        </div>
      </div>
    `;

    // recommandations similaires
    const similar = eat.similarRecipes(r, 4);
    const similarHtml = similar.map(s => `
      <a class="reco-card" href="${eat.routeUrl('recipe', [s.id])}">
        <div class="reco-card-hero" style="background:${esc(s.gradient)}">
          <span>${esc(s.title)}</span>
        </div>
        <div class="reco-card-body">
          <span>${esc(s.origin.flag)} ${esc(s.origin.country)}</span>
          <span>${eat.fmtDuration(s.duration)}</span>
        </div>
      </a>
    `).join('');

    // allergènes
    const allergensHtml = (r.allergens || []).length > 0
      ? `<div style="display:flex;flex-wrap:wrap;gap:6px;">
           ${r.allergens.map(a => `<span class="allergen-pill">${esc(a)}</span>`).join('')}
         </div>`
      : '<div style="font-size:13px;color:var(--muted);">Aucun allergène majeur déclaré.</div>';

    const v = r.validator || {};
    const initials = (v.name || '?').split(/\s+/).filter(Boolean).map(s => s[0]).join('').slice(0, 2).toUpperCase();

    return `
      <div class="container page fade-in">

        <div class="recipe-hero" style="background:${esc(r.gradient)}">
          ${(window.EATRAIL_IMAGES || {})[r.id] ? `<img class="recipe-hero-img" src="${esc(window.EATRAIL_IMAGES[r.id])}" alt="" onerror="this.remove();" />` : ''}
          <div class="recipe-hero-flag">${esc(r.origin.flag)}</div>
          <span class="recipe-hero-auth-pill">AUTH ${r.auth} · ${esc((r.origin.region || r.origin.country).toUpperCase())}</span>
          <div class="recipe-hero-inner">
            <div class="recipe-hero-origin">${esc(r.origin.country)} · ${esc(r.origin.region)}</div>
            <h1>${esc(r.title)}</h1>
            <div class="recipe-hero-meta">
              <div class="meta-pill"><strong>${eat.fmtDuration(r.duration)}</strong></div>
              <div class="meta-pill">${servingsState} pers.</div>
              <div class="meta-pill">${eat.fmtDifficulty(r.difficulty)}</div>
              <div class="meta-pill">${esc(r.budget.level)} · $${r.budget.perPerson}/pers</div>
              <a class="meta-pill" style="text-decoration:none;color:inherit;" href="${eat.routeUrl('recipes', [], { category: r.category })}">${cat.emoji} ${esc(cat.label)}</a>
              ${rating.count > 0 ? `<div class="meta-pill"><span class="stars stars-sm">${eat.starsHtml(rating.avg)}</span> <strong>${rating.avg}</strong> · ${rating.count}</div>` : ''}
            </div>
          </div>
        </div>

        <div class="recipe-stats">
          <div class="recipe-stat"><b>${r.duration}</b><span>minutes</span></div>
          <div class="recipe-stat"><b>${servingsState}</b><span>portions</span></div>
          <div class="recipe-stat"><b>${(r.ingredients || []).length}</b><span>ingrédients</span></div>
          <div class="recipe-stat"><b>${esc(r.budget.level)}</b><span>~$${(r.budget.perPerson * servingsState).toFixed(0)}</span></div>
        </div>

        <div class="validator-card">
          <span class="vc-avatar">${esc(initials)}</span>
          <div class="vc-info">
            <b>${esc(v.name || 'Chef validateur')} · Validateur</b>
            <span>${esc(v.role || '')}${v.city ? ' · ' + esc(v.city) : ''}</span>
          </div>
          <span class="vc-stars">★★★★★</span>
        </div>

        <div class="recipe-layout">
          <div>

            <div class="recipe-story">
              ${esc(r.story)}
              <span class="recipe-story-validator">— ${esc(r.validator.name)}, ${esc(r.validator.role)} · ${esc(r.validator.city)}</span>
            </div>

            ${(r.allergens || []).length > 0 ? `
              <div class="allergen-banner">
                <span style="font-size:18px;">⚠</span>
                <div>
                  <strong>Allergènes :</strong> ${r.allergens.map(a => esc(a)).join(' · ')}
                </div>
              </div>` : ''}

            <div class="recipe-section">
              <h2><span class="badge-section">1</span>Ingrédients (${servingsState} pers.)</h2>
              <div class="servings-control" style="max-width:240px; margin-bottom:18px;">
                <button class="servings-btn" data-servings-delta="-1" aria-label="moins">−</button>
                <span class="servings-value">${servingsState} personne${servingsState > 1 ? 's' : ''}</span>
                <button class="servings-btn" data-servings-delta="1" aria-label="plus">+</button>
              </div>
              <div class="ing-list">${ingHtml}</div>

              <div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap;">
                <a class="btn btn-primary" href="${eat.routeUrl('shops', [], { recipeId: r.id })}" style="display:inline-flex;align-items:center;gap:8px;">
                  📍 Trouver près de moi
                </a>
                <button class="btn btn-ghost" data-schedule-meal="${esc(r.id)}" style="display:inline-flex;align-items:center;gap:8px;">
                  📅 Programmer ce repas
                </button>
              </div>

              <div class="nutrition-widget" data-nutrition-recipe="${esc(r.id)}" style="margin-top:22px;">
                <button class="btn btn-ghost btn-sm" data-load-nutrition="${esc(r.id)}" style="font-size:12px;">📊 Calculer les valeurs nutritionnelles</button>
              </div>
            </div>

            <div class="recipe-section">
              <h2><span class="badge-section">2</span>Étapes</h2>
              <div class="steps-list">${stepsHtml}</div>
            </div>

            <div class="recipe-section">
              <h2><span class="badge-section">★</span>Avis (${rating.count})</h2>
              ${rating.count > 0 ? `
                <div class="rating-summary" style="margin-bottom:20px;">
                  <span class="rating-num">${rating.avg}</span>
                  <span class="stars stars-lg">${eat.starsHtml(rating.avg)}</span>
                  <span>${rating.count} avis</span>
                </div>
              ` : ''}
              ${reviewForm}
              <div class="reviews-list" style="margin-top:18px;">${reviewsList || "<div style=\"font-size:14px;color:var(--muted);\">Aucun avis pour l'instant. Sois le premier !</div>"}</div>
            </div>

            ${similar.length > 0 ? `
              <div class="recipe-section">
                <h2><span class="badge-section">↗</span>Si tu aimes ce plat</h2>
                <div class="reco-strip">${similarHtml}</div>
              </div>` : ''}

          </div>

          <aside class="recipe-side">
            <div class="side-card">
              <h3>📍 Suivre le trail</h3>
              <p style="font-size:14px;color:var(--muted);margin-bottom:16px;">
                Trouve les ${r.ingredients.length} ingrédients dans les magasins NYC les plus authentiques.
              </p>
              <a class="btn btn-primary btn-block side-cta" href="${eat.routeUrl('trail', [r.id])}">
                Voir où acheter →
              </a>
              <button class="btn btn-ink btn-block btn-sm side-cta" data-add-cart="${esc(r.id)}">
                🛒 Ajouter au panier
              </button>
              <button class="btn btn-ghost btn-block btn-sm save-btn-icon ${isSaved ? 'is-saved' : ''}" data-toggle-save="${esc(r.id)}">
                ${isSaved ? '★ Favori' : '☆ Ajouter aux favoris'}
              </button>
            </div>

            <div class="side-card">
              <h3>⚠ Allergènes</h3>
              ${allergensHtml}
            </div>

            <div class="side-card">
              <h3>🏷 Tags</h3>
              <div class="recipe-card-tags">
                ${(r.moods || []).map(m => `<span class="tag tag-mood">${esc(m)}</span>`).join('')}
                ${(r.diets || []).map(d => `<span class="tag tag-diet">${esc(d)}</span>`).join('')}
                ${eat.countRare(r) > 0 ? `<span class="tag tag-rare">${eat.countRare(r)} rare${eat.countRare(r) > 1 ? 's' : ''}</span>` : ''}
              </div>
            </div>
          </aside>
        </div>
      </div>
    `;
  };

  // ─────────────────────────────────────────────────────────
  // TRAIL
  // ─────────────────────────────────────────────────────────

  eat.viewTrail = function (slug) {
    const r = eat.recipeById(slug);
    if (!r) return notFoundView('Recette introuvable');
    const trail = eat.buildTrail(r);

    const stopsHtml = trail.stops.map((stop, idx) => {
      const itemsHtml = stop.items.map(ing => `
        <div class="trail-stop-item ${ing.rare ? 'is-rare' : ''}">
          <span class="ing-name">${ing.rare ? '★ ' : ''}${esc(ing.name)}</span>
          <span class="ing-qty">${esc(ing.qty)} ${esc(ing.unit)}</span>
        </div>
      `).join('');

      return `
        <div class="trail-stop">
          <div class="trail-stop-marker">
            <div class="trail-stop-marker-circle">${idx + 1}</div>
            <div class="trail-stop-marker-line"></div>
          </div>
          <div class="trail-stop-card">
            <div class="trail-stop-head">
              <div>
                <a class="trail-stop-name" href="${eat.routeUrl('shop', [stop.shop.id])}">${esc(stop.shop.name)}</a>
                <div class="shop-card-neighborhood">${esc(stop.shop.neighborhood)}</div>
              </div>
              <div class="shop-auth-pill ${eat.authClass(stop.shop.auth)}">Auth ${stop.shop.auth}</div>
            </div>
            <div class="trail-stop-meta">
              <span>📍 ${stop.shop.distMi} mi</span>
              <span>·</span>
              <span>${esc(stop.shop.priceLevel)}</span>
              <span>·</span>
              <span>${stop.items.length} produit${stop.items.length > 1 ? 's' : ''}</span>
            </div>
            <div class="trail-stop-items">${itemsHtml}</div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="container page fade-in">

        <a href="${eat.routeUrl('recipe', [r.id])}" style="font-size:14px;color:var(--muted);">← retour à ${esc(r.title)}</a>

        <div class="trail-summary" style="margin-top:18px;">
          <span class="page-eyebrow" style="color:var(--gold);">Trail Optimizer</span>
          <h1 style="font-family:'Fraunces',serif;font-weight:800;font-size:clamp(28px,4vw,42px);line-height:1.05;margin-bottom:10px;">
            ${esc(r.title)} en ${trail.totalShops} arrêt${trail.totalShops > 1 ? 's' : ''}
          </h1>
          <p style="opacity:.85;max-width:540px;">
            Itinéraire optimisé selon authenticité × distance. ${eat.countRare(r) > 0 ? 'Les ingrédients rares vont vers les épiceries spécialisées, le reste mutualisé.' : "Tous les ingrédients sont disponibles dans peu d'arrêts."}
          </p>
          <div class="trail-summary-stats">
            <div class="trail-stat"><strong>${trail.totalShops}</strong><span>arrêts</span></div>
            <div class="trail-stat"><strong>${trail.totalMi} mi</strong><span>distance totale</span></div>
            <div class="trail-stat"><strong>$${trail.totalCost}</strong><span>budget total est.</span></div>
            <div class="trail-stat"><strong>${r.servings}</strong><span>personnes</span></div>
          </div>
        </div>

        <div class="recipe-section">
          <h2 style="font-family:'Fraunces',serif;font-weight:700;font-size:24px;margin-bottom:18px;">Ton trail</h2>
          <div class="trail-stops">${stopsHtml}</div>
        </div>

        <div style="margin-top:32px;display:flex;gap:12px;flex-wrap:wrap;">
          <button class="btn btn-primary" id="export-trail">📋 Copier la liste de courses</button>
          ${trail.stops.some(st => st.shop && st.shop.coords && Number.isFinite(st.shop.coords.lat)) ? `
            <button class="btn btn-secondary" data-open-directions-trail="${esc(r.id)}">🗺️ Ouvrir l'itinéraire</button>
          ` : ''}
          <a class="btn btn-ghost" href="${eat.routeUrl('recipe', [r.id])}">← Revoir la recette</a>
        </div>
      </div>
    `;
  };

  // ─────────────────────────────────────────────────────────
  // SHOPS DIRECTORY
  // ─────────────────────────────────────────────────────────

  // ── Geo-bar component (current position + actions) ───────
  function geoBarHtml(pos, radius) {
    const radiusInt = Number(radius || 1.5).toFixed(1);
    const posLabel = pos
      ? (pos.source === 'browser' ? `📍 Position GPS (±${Math.round(pos.accuracy || 0)}m)`
        : pos.source === 'manual' ? `📍 ${esc(pos.label || 'Position manuelle')}`
        : `📍 ${esc(pos.label || 'NYC par défaut')}`)
      : null;

    return `
      <div class="geo-bar" style="background:var(--white);border:1px solid var(--line);border-radius:14px;padding:14px 16px;margin:14px 0 18px;display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;">
        <div style="display:flex;flex-direction:column;gap:4px;min-width:0;flex:1;">
          ${pos
            ? `<div style="font-size:14px;font-weight:600;color:var(--ink);">${posLabel}</div>
               <div style="font-size:12px;color:var(--muted);">Rayon : ${radiusInt} mi</div>`
            : `<div style="font-size:14px;color:var(--ink);font-weight:600;">📍 Active ta position</div>
               <div style="font-size:12px;color:var(--muted);">Pour voir les magasins autour de toi</div>`
          }
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${pos
            ? `<button class="btn btn-ghost btn-sm" id="geo-refresh">🔄 Actualiser</button>
               <button class="btn btn-ghost btn-sm" id="geo-clear">✕ Effacer</button>`
            : `<button class="btn btn-primary btn-sm" id="geo-enable">📍 Activer ma position</button>
               <button class="btn btn-ghost btn-sm" id="geo-default">NYC par défaut</button>`
          }
        </div>
        ${pos ? `
          <div style="display:flex;align-items:center;gap:8px;width:100%;margin-top:6px;">
            <label for="geo-radius" style="font-size:12px;color:var(--muted);">Rayon</label>
            <input type="range" id="geo-radius" min="0.3" max="5" step="0.1" value="${radiusInt}" style="flex:1;accent-color:var(--primary);" />
            <span id="geo-radius-label" style="font-size:12px;font-weight:600;color:var(--primary);min-width:50px;text-align:right;">${radiusInt} mi</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  eat.viewShops = function (query) {
    const recipeId = query.recipeId || null;
    const recipe = recipeId ? eat.recipeById(recipeId) : null;
    const radius = parseFloat(query.radius) || 1.5;
    const pos = eat.geo && eat.geo.getCached();
    const q = (query.q || '').toLowerCase();
    const typeFilter = query.type || '';

    // Stash for the async loader (used by event handlers + RAF callback)
    eat._shopsContext = { recipeId, recipe, radius, pos, q, typeFilter };

    // Schedule async load after this render
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => loadShopsAsync());
    } else {
      setTimeout(loadShopsAsync, 0);
    }

    const types = [
      { id: 'ethnic', label: 'Épicerie ethnique' },
      { id: 'specialty', label: 'Spécialiste' },
      { id: 'supermarket', label: 'Supermarché' },
      { id: 'market', label: 'Marché' }
    ];
    const typeChips = types.map(t => {
      const active = typeFilter === t.id;
      const next = active ? '' : t.id;
      return `<a class="filter-chip ${active ? 'is-active' : ''}" href="${eat.routeUrl('shops', [], { ...query, type: next })}">${esc(t.label)}</a>`;
    }).join('');

    return `
      <div class="container page fade-in">
        <span class="page-eyebrow">${pos ? 'Magasins autour de toi' : 'Annuaire NYC'}</span>
        <h1 class="page-title">${recipe ? `Magasins pour ${esc(recipe.title)}` : 'Magasins'}</h1>
        ${recipe
          ? `<p class="page-lead">Trouve les ${recipe.ingredients.length} ingrédients de cette recette dans le minimum de magasins. <a href="${eat.routeUrl('recipe', [recipe.id])}" style="color:var(--primary);">← retour à la recette</a></p>`
          : `<p class="page-lead">Active ta position pour voir les magasins les plus proches qui ont les ingrédients dont tu as besoin.</p>`
        }

        ${geoBarHtml(pos, radius)}

        <div class="filter-bar">
          <div class="filter-search">
            <input id="shop-filter-q" type="search" placeholder="Quartier, nom, spécialité…" value="${esc(query.q || '')}" />
          </div>
          <div class="filter-group">${typeChips}</div>
        </div>

        <div id="shops-trail-zone"></div>

        <div id="shops-map-zone" style="margin-bottom:18px;"></div>

        <div id="shops-list-zone">
          <div class="shop-loading" style="text-align:center;padding:40px;color:var(--muted);font-size:14px;">
            ${pos ? '🔍 Recherche des magasins…' : '👇 Active ta position pour voir les magasins'}
          </div>
        </div>
      </div>
    `;
  };

  // ── Async loader (called after render) ──────────────────
  async function loadShopsAsync() {
    const ctx = eat._shopsContext;
    if (!ctx) return;
    const listZone = document.getElementById('shops-list-zone');
    const trailZone = document.getElementById('shops-trail-zone');
    if (!listZone) return;

    let shops, trail = null, source = 'static';

    if (ctx.pos) {
      // Try API
      try {
        const params = { lat: ctx.pos.lat, lng: ctx.pos.lng, radius: ctx.radius };
        if (ctx.recipeId) params.recipeId = ctx.recipeId;
        const data = await eat.api.geo.shopsNearby(params);
        shops = data.shops || [];
        trail = data.trail || null;
        source = 'api';
      } catch (e) {
        console.warn('[shops] API failed, falling back to static:', e.message);
        shops = staticShopsFiltered(ctx);
        source = 'static-fallback';
      }
    } else {
      shops = staticShopsFiltered(ctx);
    }

    // Apply text + type filters
    if (ctx.q) shops = shops.filter(s => ((s.name || '') + ' ' + (s.neighborhood || s.address || '') + ' ' + (s.description || s.story || '')).toLowerCase().includes(ctx.q));
    if (ctx.typeFilter) shops = shops.filter(s => s.type === ctx.typeFilter);

    // Render trail summary if exists
    if (trail && trail.stops && trail.stops.length > 0) {
      trailZone.innerHTML = `
        <div class="trail-banner" style="margin-bottom:18px;">
          <div class="eyebrow">Trail optimisé</div>
          <h3>${trail.stops.length} magasin${trail.stops.length > 1 ? 's' : ''} pour ${trail.coveredCount}/${trail.totalCount} ingrédients.</h3>
          <div class="trail-meta">${trail.stops.map(s => esc(s.name)).join(' · ')}</div>
          ${trail.missing && trail.missing.length > 0
            ? `<div style="font-size:11px;color:var(--gold);margin-top:6px;">⚠ Manquant : ${trail.missing.slice(0, 5).map(esc).join(', ')}</div>`
            : ''}
        </div>
      `;
    } else {
      trailZone.innerHTML = '';
    }

    // Try to render map (lazy, only if mapbox is configured)
    if (eat.map && shops.length > 0) {
      const mapZone = document.getElementById('shops-map-zone');
      if (mapZone && (await eat.map.isAvailable())) {
        mapZone.innerHTML = `<div id="shops-map" style="height:280px;border-radius:14px;overflow:hidden;border:1px solid var(--line);"></div>`;
        try {
          const center = ctx.pos ? [ctx.pos.lng, ctx.pos.lat] : [-73.9874, 40.7479];
          await eat.map.init('shops-map', { center, zoom: 13 });
          eat.map.addShops(shops);
          if (trail && trail.stops && trail.stops.length >= 2) eat.map.drawTrail(trail.stops);
        } catch (mapErr) { console.warn('[map] init failed:', mapErr.message); }
      }
    }

    // Render shop list
    if (shops.length === 0) {
      listZone.innerHTML = `<div class="empty"><h3>Aucun magasin trouvé</h3><p>Élargis le rayon ou enlève un filtre.</p></div>`;
    } else {
      const sourceNote = source === 'api'
        ? `<div style="font-size:12px;color:var(--muted);margin-bottom:10px;">${shops.length} résultat${shops.length > 1 ? 's' : ''} dans ${ctx.radius} mi</div>`
        : source === 'static-fallback'
        ? `<div style="font-size:12px;color:var(--gold);margin-bottom:10px;">⚠ Mode hors-ligne — ${shops.length} magasin${shops.length > 1 ? 's' : ''} curés affichés</div>`
        : `<div style="font-size:12px;color:var(--muted);margin-bottom:10px;">${shops.length} magasin${shops.length > 1 ? 's' : ''} curés NYC</div>`;
      listZone.innerHTML = sourceNote + `<div class="shop-grid">${shops.map(shopCard).join('')}</div>`;
    }
  }
  eat.loadShopsAsync = loadShopsAsync;

  function staticShopsFiltered(ctx) {
    let shops = (eat.allShops ? eat.allShops() : []).slice();
    if (ctx.pos) {
      // Compute distance from current position for legacy shops
      shops = shops.map(s => {
        const c = s.coords || {};
        if (typeof c.lat === 'number' && typeof c.lng === 'number') {
          return { ...s, distMiles: eat.geo.distMiles(ctx.pos.lat, ctx.pos.lng, c.lat, c.lng) };
        }
        return s;
      }).filter(s => !s.distMiles || s.distMiles <= ctx.radius)
        .sort((a, b) => (a.distMiles || a.distMi || 99) - (b.distMiles || b.distMi || 99));
    } else {
      shops.sort((a, b) => (a.distMi || 99) - (b.distMi || 99));
    }
    return shops;
  }

  // ─────────────────────────────────────────────────────────
  // SHOP DETAIL
  // ─────────────────────────────────────────────────────────

  eat.viewShop = function (slug) {
    const s = eat.shopById(slug);
    if (!s) return notFoundView('Magasin introuvable');

    // recettes qui pourraient utiliser ce magasin
    const matches = eat.allRecipes().filter(r =>
      r.ingredients.some(ing => {
        const cands = eat.shopsForIngredient(ing);
        return cands.length && cands[0].shop.id === s.id;
      })
    ).slice(0, 6);

    const rareList = (s.rareCarried || []).map(name =>
      `<li style="margin-bottom:6px;">★ ${esc(name)}</li>`
    ).join('');

    return `
      <div class="container page fade-in">
        <a href="${eat.routeUrl('shops')}" style="font-size:14px;color:var(--muted);">← retour aux magasins</a>

        <div style="background:var(--white);border:1px solid var(--line);border-radius:var(--radius-lg);padding:32px clamp(24px,4vw,48px);margin:18px 0 32px;">
          <div style="display:flex;justify-content:space-between;gap:16px;align-items:start;flex-wrap:wrap;margin-bottom:18px;">
            <div>
              <span class="page-eyebrow">${esc(s.type)}</span>
              <h1 style="font-family:'Fraunces',serif;font-weight:800;font-size:clamp(28px,4vw,40px);line-height:1.05;margin-bottom:6px;">
                ${esc(s.name)}
              </h1>
              <div style="color:var(--muted);font-size:15px;">${esc(s.neighborhood)}</div>
            </div>
            <div class="shop-auth-pill ${eat.authClass(s.auth)}" style="font-size:13px;padding:6px 14px;">Auth ${s.auth}</div>
          </div>

          <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:20px;">
            <div class="meta-pill" style="background:var(--cream-deep);color:var(--ink);">📍 ${s.distMi} mi</div>
            <div class="meta-pill" style="background:var(--cream-deep);color:var(--ink);">${esc(s.priceLevel)}</div>
            <div class="meta-pill" style="background:var(--cream-deep);color:var(--ink);">⏰ ${esc(s.hours)}</div>
          </div>

          <p style="font-size:16px;color:var(--ink);margin-bottom:20px;">${esc(s.story)}</p>

          <div style="font-size:14px;color:var(--muted);margin-bottom:18px;">
            <strong>Adresse :</strong> ${esc(s.address)}
          </div>

          ${(s.coords && Number.isFinite(s.coords.lat)) ? `
            <div style="display:flex;gap:10px;flex-wrap:wrap;">
              <button class="btn btn-primary" data-open-directions-shop="${esc(s.id)}">📍 Y aller</button>
            </div>
          ` : ''}
        </div>

        <div class="recipe-layout">
          <div>
            <div class="recipe-section">
              <h2><span class="badge-section">★</span>Ingrédients rares en stock</h2>
              ${rareList ? `<ul style="list-style:none;padding:18px 24px;background:rgba(200,90,58,.06);border-radius:var(--radius-sm);font-size:14px;">${rareList}</ul>`
                : "<p style=\"color:var(--muted);font-size:14px;\">Pas d'ingrédient rare référencé. Bonne adresse pour les bases.</p>"}
            </div>

            ${matches.length > 0 ? `
            <div class="recipe-section">
              <h2><span class="badge-section">🍽</span>Recettes qui passent ici</h2>
              <div class="recipe-grid">${matches.map(recipeCard).join('')}</div>
            </div>` : ''}
          </div>

          <aside class="recipe-side">
            <div class="side-card">
              <h3>🏷 Spécialités</h3>
              <div class="recipe-card-tags">
                ${(s.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('')}
              </div>
            </div>
          </aside>
        </div>
      </div>
    `;
  };

  // ─────────────────────────────────────────────────────────
  // PANTRY AI (mock)
  // ─────────────────────────────────────────────────────────

  eat.viewPantry = function () {
    const pantry = eat.pantry();
    const matches = eat.pantryMatches();

    const chipsHtml = pantry.length === 0
      ? '<div style="color:var(--muted);font-size:14px;">Aucune provision. Ajoute les ingrédients que tu as à la maison.</div>'
      : pantry.map(item => `
          <span class="pantry-chip">
            ${esc(item)}
            <button data-pantry-remove="${esc(item)}" aria-label="retirer">×</button>
          </span>`).join('');

    const matchesHtml = matches.length === 0
      ? `<div class="empty"><h3>Ajoute quelques ingrédients</h3><p>On te suggère des recettes anti-gaspi à partir de ce que tu as déjà à la maison.</p></div>`
      : matches.map(m => `
          <a class="pantry-recipe" href="${eat.routeUrl('recipe', [m.recipe.id])}">
            <div class="pantry-recipe-thumb" style="background:${esc(m.recipe.gradient)};">${eat.recipeEmoji(m.recipe)}</div>
            <div class="pantry-recipe-body">
              <div class="pantry-recipe-title">${esc(m.recipe.title)}</div>
              <div class="pantry-recipe-match">${m.matched}/${m.total} ingrédients dans ton pantry · ${m.pct}% match</div>
              <div class="pantry-recipe-bar"><div class="pantry-recipe-bar-fill" style="width:${m.pct}%"></div></div>
            </div>
          </a>`).join('');

    return `
      <div class="container page fade-in">
        <span class="page-eyebrow">Mes provisions · IA</span>
        <h1 class="page-title">Tes provisions.</h1>
        <p class="page-lead">Ajoute ce que tu as déjà à la maison (frigo, placard, épices). eatrail te suggère les recettes que tu peux faire avec le moins de courses possibles.</p>

        <div class="pantry-grid">
          <div class="pantry-input">
            <h3 style="font-family:'Fraunces',serif;font-size:18px;margin-bottom:14px;">Mes ingrédients (${pantry.length})</h3>
            <form class="pantry-add" id="pantry-add-form">
              <input type="text" id="pantry-add-input" placeholder="Ex : tomate, riz, ail…" autocomplete="off" />
              <button type="submit" class="btn btn-primary btn-sm">Ajouter</button>
            </form>

            <div class="pantry-scan" style="margin:12px 0 18px;display:flex;flex-direction:column;gap:8px;">
              <label for="pantry-scan-input" class="btn btn-ghost btn-sm" style="cursor:pointer;text-align:center;">
                📸 Scanner mes provisions
              </label>
              <input type="file" id="pantry-scan-input" accept="image/*" capture="environment" style="display:none;" />
              <div id="pantry-scan-status" style="font-size:13px;color:var(--muted);min-height:18px;"></div>
            </div>

            <div class="pantry-list">${chipsHtml}</div>
            ${pantry.length > 0 ? `<button class="btn btn-ghost btn-sm" id="pantry-clear" style="margin-top:18px;">Vider le pantry</button>` : ''}
          </div>

          <div>
            <h3 style="font-family:'Fraunces',serif;font-size:18px;margin-bottom:14px;">Suggestions anti-gaspi</h3>
            <div class="pantry-suggestions">${matchesHtml}</div>
          </div>
        </div>
      </div>
    `;
  };

  // ─────────────────────────────────────────────────────────
  // FLAVOR DNA (carte d'identité culinaire shareable)
  // ─────────────────────────────────────────────────────────

  eat.viewFlavorDna = function () {
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => loadFlavorDnaAsync());
    } else {
      setTimeout(loadFlavorDnaAsync, 0);
    }

    return `
      <div class="container page fade-in">
        <span class="page-eyebrow">Carte d'identité</span>
        <h1 class="page-title">Ton <em>Flavor DNA</em></h1>
        <p class="page-lead">Ton profil culinaire, basé sur ce que tu cuisines, sauvegardes et notes.</p>

        <div id="flavor-dna-zone">
          <div class="empty" style="padding:60px 20px;text-align:center;">
            <div style="font-size:32px;margin-bottom:12px;">🧬</div>
            <p style="color:var(--muted);">Chargement de ton ADN culinaire…</p>
          </div>
        </div>
      </div>
    `;
  };

  async function loadFlavorDnaAsync() {
    const zone = document.getElementById('flavor-dna-zone');
    if (!zone) return;

    if (!eat.api?.currentUser) {
      zone.innerHTML = `
        <div class="empty" style="padding:60px 20px;text-align:center;">
          <h3>Connecte-toi pour voir ton Flavor DNA</h3>
          <p style="color:var(--muted);margin:14px 0 22px;">Cette carte est unique à ton compte.</p>
          <a class="btn btn-primary" href="${eat.routeUrl('login')}">Se connecter</a>
        </div>
      `;
      return;
    }

    try {
      const { dna } = await eat.api.flavorDna.me();
      zone.innerHTML = renderFlavorDnaCard(dna);
    } catch (e) {
      zone.innerHTML = `<div class="empty"><h3>Erreur</h3><p>${esc(e.message)}</p></div>`;
    }
  }

  function renderFlavorDnaCard(dna) {
    const u = dna.user || {};
    const a = dna.archetype || { emoji: '🌱', label: 'Le Débutant' };
    const memberSince = u.memberSince ? new Date(u.memberSince).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : '';
    const epicenter = dna.epicenter || 'à définir';
    const force = dna.force || 'à définir';

    return `
      <div class="dna-card" id="dna-card">
        <!-- Header passport-style -->
        <div class="dna-header">
          <div class="dna-stamp">${esc(a.emoji)}</div>
          <div class="dna-meta">
            <div class="dna-eyebrow">eatrail · Flavor DNA</div>
            <div class="dna-name">${esc(u.name || '')}</div>
            <div class="dna-archetype">${esc(a.label)}</div>
          </div>
        </div>

        <!-- 2 big highlights: Épicentre & Force -->
        <div class="dna-highlights">
          <div class="dna-highlight">
            <div class="dna-h-label">Épicentre</div>
            <div class="dna-h-value">${esc(epicenter)}</div>
          </div>
          <div class="dna-highlight">
            <div class="dna-h-label">Force</div>
            <div class="dna-h-value">${esc(force)}</div>
          </div>
        </div>

        <!-- Stats grid -->
        <div class="dna-stats">
          <div class="dna-stat"><b>${dna.stats.recipesUnlocked || 0}</b><span>recettes débloquées</span></div>
          <div class="dna-stat"><b>${dna.stats.mealsCooked || 0}</b><span>repas cuisinés</span></div>
          <div class="dna-stat"><b>${dna.stats.streak || 0}</b><span>jours d'affilée</span></div>
          <div class="dna-stat"><b>${dna.stats.avgCookTimeMin || '—'}</b><span>min/recette</span></div>
        </div>

        ${dna.topCuisines && dna.topCuisines.length > 0 ? `
          <div class="dna-section">
            <div class="dna-s-label">Tes 5 cuisines</div>
            <div class="dna-cuisines">
              ${dna.topCuisines.map((c, i) => `
                <div class="dna-cuisine">
                  <span class="dna-cuisine-rank">#${i + 1}</span>
                  <span class="dna-cuisine-name">${esc(c.country)}</span>
                  <span class="dna-cuisine-score">${c.score} pts</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${dna.rareTags && dna.rareTags.length > 0 ? `
          <div class="dna-section">
            <div class="dna-s-label">Ingrédients rares explorés</div>
            <div class="dna-tags">${dna.rareTags.map(t => `<span class="dna-tag">${esc(t)}</span>`).join('')}</div>
          </div>
        ` : ''}

        <!-- Footer with member since -->
        <div class="dna-footer">
          <div>Membre depuis <strong>${esc(memberSince)}</strong></div>
          <div>eatrail · NYC</div>
        </div>
      </div>

      <div style="display:flex;gap:10px;justify-content:center;margin-top:18px;flex-wrap:wrap;">
        <button class="btn btn-primary" id="dna-share">📤 Partager</button>
        <button class="btn btn-ghost" id="dna-download">💾 Télécharger l'image</button>
      </div>

      <p style="text-align:center;font-size:12px;color:var(--muted);margin-top:14px;">
        Ton Flavor DNA est mis à jour chaque mois — façon Spotify Wrapped.
      </p>
    `;
  }

  // ─────────────────────────────────────────────────────────
  // CALENDAR (meal planner)
  // ─────────────────────────────────────────────────────────

  eat.viewCalendar = function (query) {
    const today = eat.mealPlan.todayISO();
    const weekStart = query.week || eat.mealPlan.weekStart(today);
    const weekEnd = eat.mealPlan.weekEnd(weekStart);
    const prevWeek = eat.mealPlan.addDaysISO(weekStart, -7);
    const nextWeek = eat.mealPlan.addDaysISO(weekStart, 7);

    // Stash for async loader
    eat._calendarContext = { weekStart, weekEnd, query };

    // Schedule async load after render (fetches plans from API or local)
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => loadCalendarAsync());
    } else {
      setTimeout(loadCalendarAsync, 0);
    }

    // Build day skeletons (will be filled async)
    const dayCells = [];
    for (let i = 0; i < 7; i++) {
      const dateISO = eat.mealPlan.addDaysISO(weekStart, i);
      const isToday = dateISO === today;
      const isPast = dateISO < today;
      dayCells.push(`
        <div class="cal-day ${isToday ? 'is-today' : ''} ${isPast ? 'is-past' : ''}" data-date="${dateISO}">
          <div class="cal-day-head">
            <h3>${esc(eat.mealPlan.fmtDayLabel(dateISO))}</h3>
            ${isToday ? '<span class="cal-today-badge">Aujourd\'hui</span>' : ''}
          </div>
          <div class="cal-slots">
            ${eat.mealPlan.SLOTS.map(slot => `
              <div class="cal-slot" data-date="${dateISO}" data-slot="${slot}">
                <div class="cal-slot-label">
                  <span>${eat.mealPlan.SLOT_EMOJI[slot]} ${eat.mealPlan.SLOT_LABELS[slot]}</span>
                  <button class="cal-add-btn" data-add-meal data-date="${dateISO}" data-slot="${slot}" aria-label="Ajouter">+</button>
                </div>
                <div class="cal-slot-meals" data-slot-meals="${dateISO}|${slot}">
                  <!-- filled async -->
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `);
    }

    return `
      <div class="container page fade-in">
        <span class="page-eyebrow">Mon planning</span>
        <h1 class="page-title">Calendrier de repas</h1>
        <p class="page-lead">Programme tes recettes pour la semaine. eatrail agrège ta liste de courses automatiquement.</p>

        <div class="cal-toolbar">
          <div class="cal-week-nav">
            <a class="btn btn-ghost btn-sm" href="${eat.routeUrl('calendar', [], { week: prevWeek })}">←</a>
            <div class="cal-week-label">
              <strong id="cal-week-label">${esc(eat.mealPlan.fmtWeekRange(weekStart))}</strong>
              <a href="${eat.routeUrl('calendar')}" class="cal-today-link">Aujourd'hui</a>
            </div>
            <a class="btn btn-ghost btn-sm" href="${eat.routeUrl('calendar', [], { week: nextWeek })}">→</a>
          </div>
          <div id="cal-summary" style="font-size:13px;color:var(--muted);margin-top:8px;text-align:center;">
            Chargement…
          </div>
        </div>

        <div class="cal-actions" style="display:flex;gap:8px;margin:14px 0;flex-wrap:wrap;">
          <button class="btn btn-primary btn-sm" id="cal-shopping-list">📋 Liste de courses de la semaine</button>
          <button class="btn btn-secondary btn-sm" id="cal-ai-fill" data-week-start="${esc(weekStart)}">✨ Remplis ma semaine</button>
          <button class="btn btn-ghost btn-sm" id="cal-clear-week">🗑 Vider la semaine</button>
        </div>

        <div class="cal-week">
          ${dayCells.join('')}
        </div>

        <div id="cal-modal-zone"></div>
      </div>
    `;
  };

  async function loadCalendarAsync() {
    const ctx = eat._calendarContext;
    if (!ctx) return;
    const summary = document.getElementById('cal-summary');
    const plans = await eat.mealPlan.list(ctx.weekStart, ctx.weekEnd);

    // Group by date+slot
    const grouped = {};
    for (const p of plans) {
      const dateISO = (typeof p.date === 'string') ? p.date.slice(0, 10) : new Date(p.date).toISOString().slice(0, 10);
      const key = dateISO + '|' + p.slot;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(p);
    }

    // Render meal pills in each slot
    for (const [key, items] of Object.entries(grouped)) {
      const slot = document.querySelector(`[data-slot-meals="${key}"]`);
      if (!slot) continue;
      slot.innerHTML = items.map(p => {
        const recipe = p.recipe || eat.recipeById(p.recipeId);
        if (!recipe) return '';
        const title = recipe.title || 'Recette';
        const flag = recipe.flag || (recipe.origin && recipe.origin.flag) || '';
        const img = (recipe.imageUrl) || (window.EATRAIL_IMAGES || {})[p.recipeId] || '';
        const status = p.status || 'PLANNED';
        return `
          <div class="cal-meal ${status === 'COOKED' ? 'is-cooked' : ''} ${status === 'SKIPPED' ? 'is-skipped' : ''}"
               data-meal-id="${esc(p.id)}"
               draggable="true">
            <span class="cal-meal-grip" title="Glisser pour déplacer" aria-hidden="true">⋮⋮</span>
            <a class="cal-meal-recipe" href="${eat.routeUrl('recipe', [p.recipeId])}">
              ${img ? `<img class="cal-meal-thumb" src="${esc(img)}" alt="" onerror="this.remove();" />` : ''}
              <div class="cal-meal-body">
                <div class="cal-meal-title">${esc(flag)} ${esc(title)}</div>
                <div class="cal-meal-meta">${p.servings} pers.${status !== 'PLANNED' ? ' · ' + (status === 'COOKED' ? '✓ cuisiné' : '✗ sauté') : ''}</div>
              </div>
            </a>
            <div class="cal-meal-actions">
              ${status === 'PLANNED' ? `<button class="cal-meal-btn" data-mark-cooked="${esc(p.id)}" title="Marquer cuisiné">✓</button>` : ''}
              <button class="cal-meal-btn" data-remove-meal="${esc(p.id)}" title="Retirer">×</button>
            </div>
          </div>
        `;
      }).join('');
    }

    if (summary) {
      const total = plans.length;
      const cooked = plans.filter(p => p.status === 'COOKED').length;
      summary.textContent = total === 0
        ? 'Aucun repas programmé cette semaine.'
        : `${total} repas programmé${total > 1 ? 's' : ''}${cooked > 0 ? ` · ${cooked} cuisiné${cooked > 1 ? 's' : ''}` : ''}`;
    }
  }
  eat.loadCalendarAsync = loadCalendarAsync;

  // ─── Recipe picker modal (for adding a meal to a slot) ──
  eat.openMealPicker = function (date, slot) {
    const recipes = eat.allRecipes();
    const saved = eat.savedIds();
    const favorites = saved.map(id => eat.recipeById(id)).filter(Boolean);
    const featured = favorites.length > 0 ? favorites.slice(0, 8) : recipes.slice(0, 8);

    const slotLabel = `${eat.mealPlan.SLOT_EMOJI[slot]} ${eat.mealPlan.SLOT_LABELS[slot]} · ${esc(eat.mealPlan.fmtDayLabel(date))}`;
    const html = `
      <div class="modal-backdrop" id="meal-picker-backdrop">
        <div class="modal" id="meal-picker-modal">
          <div class="modal-head">
            <div>
              <div class="modal-eyebrow">Programmer un repas</div>
              <h2 class="modal-title">${slotLabel}</h2>
            </div>
            <button class="modal-close" id="meal-picker-close" aria-label="Fermer">×</button>
          </div>
          <div class="modal-body">
            <input type="search" id="meal-picker-search" class="modal-search" placeholder="Cherche une recette…" autocomplete="off" />
            <div class="modal-section-label">${favorites.length > 0 ? '★ Favoris' : 'Suggestions'}</div>
            <div id="meal-picker-results" class="meal-picker-grid">
              ${featured.map(r => mealPickerRow(r, date, slot)).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
    const zone = document.getElementById('cal-modal-zone');
    if (zone) zone.innerHTML = html;
    setTimeout(() => {
      const search = document.getElementById('meal-picker-search');
      if (search) search.focus();
    }, 30);
  };

  function mealPickerRow(r, date, slot) {
    const flag = r.origin?.flag || r.flag || '';
    const img = (window.EATRAIL_IMAGES || {})[r.id] || '';
    return `
      <button class="meal-picker-row" data-pick-meal data-recipe-id="${esc(r.id)}" data-date="${esc(date)}" data-slot="${esc(slot)}">
        ${img ? `<img class="meal-picker-thumb" src="${esc(img)}" alt="" onerror="this.style.background='var(--cream-deep)';this.removeAttribute('src');" />` : '<div class="meal-picker-thumb" style="background:var(--cream-deep);"></div>'}
        <div class="meal-picker-info">
          <div class="meal-picker-title">${esc(flag)} ${esc(r.title)}</div>
          <div class="meal-picker-meta">${eat.fmtDuration(r.duration)} · ${r.servings} pers. · ${esc(r.budget?.level || '$')}</div>
        </div>
      </button>
    `;
  }

  eat.searchMealPicker = function (q) {
    const norm = q.trim().toLowerCase();
    const results = norm
      ? eat.allRecipes().filter(r => r.title.toLowerCase().includes(norm) || (r.origin?.country || '').toLowerCase().includes(norm)).slice(0, 30)
      : eat.allRecipes().slice(0, 8);
    const ctx = eat._mealPickerCtx;
    if (!ctx) return;
    const list = document.getElementById('meal-picker-results');
    if (list) list.innerHTML = results.map(r => mealPickerRow(r, ctx.date, ctx.slot)).join('');
  };

  // ─────────────────────────────────────────────────────────
  // SAVED
  // ─────────────────────────────────────────────────────────

  eat.viewSaved = function () {
    const ids = eat.savedIds();
    const recipes = ids.map(id => eat.recipeById(id)).filter(Boolean);
    return `
      <div class="container page fade-in">
        <span class="page-eyebrow">Mes sauvegardes</span>
        <h1 class="page-title">Recettes sauvegardées</h1>
        <p class="page-lead">${recipes.length} recette${recipes.length > 1 ? 's' : ''} dans ta liste. Clique pour rouvrir, ou lance un trail pour aller faire les courses.</p>

        ${recipes.length === 0
          ? `<div class="empty"><h3>Rien sauvegardé</h3><p>Ouvre une recette et clique sur ☆ Sauvegarder pour la retrouver ici.</p></div>`
          : `<div class="recipe-grid">${recipes.map(recipeCard).join('')}</div>`
        }
      </div>
    `;
  };

  // ─────────────────────────────────────────────────────────
  // CART (panier de courses)
  // ─────────────────────────────────────────────────────────

  eat.viewCart = function () {
    const cart = eat.cart();
    const stops = eat.cartByShop();
    const remaining = cart.filter(c => !c.checked).length;
    const checked = cart.length - remaining;

    if (cart.length === 0) {
      return `
        <div class="container page fade-in">
          <span class="page-eyebrow">Panier de courses</span>
          <h1 class="page-title">Ton panier est vide</h1>
          <p class="page-lead">Ouvre une recette et clique sur 🛒 « Ajouter au panier » pour démarrer une liste de courses regroupée par magasin.</p>
          <a class="btn btn-primary" href="${eat.routeUrl('recipes')}">Parcourir les recettes</a>
        </div>
      `;
    }

    const stopsHtml = stops.map(stop => {
      const itemsHtml = stop.items.map(item => `
        <div class="cart-item ${item.checked ? 'is-checked' : ''}">
          <button class="cart-checkbox" data-cart-toggle="${esc(item.id)}" aria-label="cocher">✓</button>
          <div class="cart-item-body">
            <div class="cart-item-name">${item.rare ? '<span class="cart-item-rare">rare</span> ' : ''}${esc(item.name)}</div>
            <div class="cart-item-meta">depuis <a href="${eat.routeUrl('recipe', [item.recipeId])}">${esc(item.recipeTitle)}</a></div>
          </div>
          <div class="cart-item-qty">${esc(item.qty)} ${esc(item.unit)}</div>
          <button class="cart-item-remove" data-cart-remove="${esc(item.id)}" aria-label="retirer">×</button>
        </div>
      `).join('');

      return `
        <section class="cart-shop-section">
          <div class="cart-shop-head">
            <div class="cart-shop-name">
              <span class="trail-stop-marker-circle" style="width:28px;height:28px;font-size:13px;">📍</span>
              <a href="${eat.routeUrl('shop', [stop.shop.id])}" style="color:inherit;">${esc(stop.shop.name)}</a>
            </div>
            <div class="cart-shop-meta">${esc(stop.shop.neighborhood)} · ${stop.shop.distMi} mi · ${stop.items.length} item${stop.items.length > 1 ? 's' : ''}</div>
          </div>
          <div class="cart-items">${itemsHtml}</div>
        </section>
      `;
    }).join('');

    return `
      <div class="container page fade-in">
        <span class="page-eyebrow">Panier de courses</span>
        <h1 class="page-title">Ma liste de courses</h1>
        <p class="page-lead">${cart.length} item${cart.length > 1 ? 's' : ''} regroupé${cart.length > 1 ? 's' : ''} par magasin via le Trail Optimizer. Coche en faisant tes courses.</p>

        <div class="scan-panel">
          <div>
            <h3>📡 Scanner produit</h3>
            <p>Lecture à puce : pointe ton téléphone sur l'étiquette code-barres. eatrail détecte l'ingrédient et coche la ligne.</p>
            <button class="btn" id="scan-btn" style="background:var(--gold);color:var(--ink);">▶ Lancer un scan</button>
            <div class="scan-result" id="scan-result"></div>
          </div>
          <div class="scan-viewfinder">
            <span class="scan-icon">⊟</span>
          </div>
        </div>

        <div class="cart-toolbar">
          <div class="cart-toolbar-stats">
            <div><strong>${cart.length}</strong><span>au total</span></div>
            <div><strong>${remaining}</strong><span>à acheter</span></div>
            <div><strong>${checked}</strong><span>cochés</span></div>
            <div><strong>${stops.length}</strong><span>magasin${stops.length > 1 ? 's' : ''}</span></div>
          </div>
          <div class="cart-actions">
            ${checked > 0 ? '<button class="btn btn-ghost btn-sm" id="cart-clear-checked">Effacer cochés</button>' : ''}
            <button class="btn btn-ghost btn-sm" id="cart-clear-all">Vider</button>
            <button class="btn btn-primary btn-sm" id="cart-export">📋 Exporter</button>
          </div>
        </div>

        ${stopsHtml}
      </div>
    `;
  };

  // ─────────────────────────────────────────────────────────
  // v1.2 — AUTH : LOGIN
  // ─────────────────────────────────────────────────────────

  eat.viewLogin = function (query) {
    if (eat.auth.isAuthenticated()) {
      return redirectView(eat.routeUrl('account'));
    }
    const next = (query && query.next) ? query.next : '';
    const banner = (query && query.banner) ? query.banner : '';

    let bannerHtml = '';
    if (banner === 'signup-success') {
      bannerHtml = `<div class="auth-banner auth-banner-success"><span class="auth-banner-icon">✓</span><div>Bienvenue ! Ton compte est créé. Connecte-toi pour continuer.</div></div>`;
    } else if (banner === 'reset-success') {
      bannerHtml = `<div class="auth-banner auth-banner-success"><span class="auth-banner-icon">✓</span><div>Mot de passe modifié. Connecte-toi avec ton nouveau mot de passe.</div></div>`;
    } else if (banner === 'session-expired') {
      bannerHtml = `<div class="auth-banner auth-banner-info"><span class="auth-banner-icon">ⓘ</span><div>Ta session a expiré. Reconnecte-toi.</div></div>`;
    }

    return `
      <div class="auth-page fade-in">
        <div class="auth-card">
          <div class="auth-logo"><span class="app-logo-dot"></span>eatrail</div>
          <h1 class="auth-title">Bon retour</h1>
          <p class="auth-subtitle">Connecte-toi pour retrouver tes favoris, ton panier et tes avis.</p>

          ${bannerHtml}

          <form id="login-form" data-next="${esc(next)}" novalidate>
            <div class="field">
              <label class="field-label" for="login-email">E-mail</label>
              <input type="email" id="login-email" name="email" class="field-input" placeholder="ton@email.com" autocomplete="email" required autofocus />
              <div class="field-error" id="login-email-error" hidden></div>
            </div>

            <div class="field">
              <div class="field-label-row">
                <label class="field-label" for="login-password">Mot de passe</label>
                <a href="${eat.routeUrl('forgot')}">Oublié ?</a>
              </div>
              <div class="pwd-wrap">
                <input type="password" id="login-password" name="password" class="field-input" placeholder="••••••••" autocomplete="current-password" required />
                <button type="button" class="pwd-toggle" data-pwd-toggle="login-password" aria-label="Afficher / masquer">👁</button>
              </div>
              <div class="field-error" id="login-password-error" hidden></div>
            </div>

            <label class="field-check">
              <input type="checkbox" id="login-remember" checked />
              <span>Rester connecté sur cet appareil</span>
            </label>

            <button type="submit" class="btn btn-primary auth-submit" id="login-submit">Se connecter</button>

            <div class="auth-banner auth-banner-error" id="login-form-error" hidden></div>
          </form>

          <div class="auth-bottom-link">
            Nouveau sur eatrail ? <a href="${eat.routeUrl('signup')}${next ? '?next=' + encodeURIComponent(next) : ''}">Créer un compte</a>
          </div>
        </div>
      </div>
    `;
  };

  // ─────────────────────────────────────────────────────────
  // v1.2 — AUTH : SIGNUP
  // ─────────────────────────────────────────────────────────

  eat.viewSignup = function (query) {
    if (eat.auth.isAuthenticated()) {
      return redirectView(eat.routeUrl('account'));
    }
    const next = (query && query.next) ? query.next : '';
    const defaultAvatar = eat.AVATARS[0];
    const avatarPicker = eat.AVATARS.map(a =>
      `<button type="button" class="avatar-pick ${a === defaultAvatar ? 'is-active' : ''}" data-avatar="${esc(a)}">${esc(a)}</button>`
    ).join('');

    return `
      <div class="auth-page fade-in">
        <div class="auth-card">
          <div class="auth-logo"><span class="app-logo-dot"></span>eatrail</div>
          <h1 class="auth-title">Crée ton compte</h1>
          <p class="auth-subtitle">Rejoins eatrail pour sauvegarder tes recettes, suivre ton trail et noter tes plats préférés.</p>

          <form id="signup-form" data-next="${esc(next)}" novalidate>
            <input type="hidden" id="signup-avatar" value="${esc(defaultAvatar)}" />

            <div class="field">
              <label class="field-label" for="signup-name">Nom ou pseudo</label>
              <input type="text" id="signup-name" name="name" class="field-input" placeholder="Ex : Tristan" maxlength="32" autocomplete="name" required autofocus />
              <div class="field-error" id="signup-name-error" hidden></div>
            </div>

            <div class="field">
              <label class="field-label" for="signup-email">E-mail</label>
              <input type="email" id="signup-email" name="email" class="field-input" placeholder="ton@email.com" autocomplete="email" required />
              <div class="field-help">Sert à te reconnecter et à récupérer ton mot de passe.</div>
              <div class="field-error" id="signup-email-error" hidden></div>
            </div>

            <div class="field">
              <label class="field-label" for="signup-password">Mot de passe</label>
              <div class="pwd-wrap">
                <input type="password" id="signup-password" name="password" class="field-input" placeholder="Minimum 8 caractères" autocomplete="new-password" required />
                <button type="button" class="pwd-toggle" data-pwd-toggle="signup-password" aria-label="Afficher / masquer">👁</button>
              </div>
              <div class="pwd-strength" id="pwd-strength" data-score="0" hidden>
                <div class="pwd-strength-bar">
                  <span class="pwd-strength-segment"></span>
                  <span class="pwd-strength-segment"></span>
                  <span class="pwd-strength-segment"></span>
                  <span class="pwd-strength-segment"></span>
                </div>
                <div class="pwd-strength-label">Force : <strong id="pwd-strength-label">—</strong></div>
                <ul class="pwd-strength-hints" id="pwd-strength-hints"></ul>
              </div>
              <div class="field-error" id="signup-password-error" hidden></div>
            </div>

            <div class="field">
              <label class="field-label">Choisis ton avatar</label>
              <div class="avatar-picker avatar-picker-inline">${avatarPicker}</div>
            </div>

            <label class="field-check">
              <input type="checkbox" id="signup-terms" required />
              <span>J'accepte les <a href="#/" tabindex="-1">conditions d'utilisation</a> et la <a href="#/" tabindex="-1">politique de confidentialité</a>.</span>
            </label>

            <button type="submit" class="btn btn-primary auth-submit" id="signup-submit">Créer mon compte</button>

            <div class="auth-banner auth-banner-error" id="signup-form-error" hidden></div>
          </form>

          <div class="auth-bottom-link">
            Déjà un compte ? <a href="${eat.routeUrl('login')}${next ? '?next=' + encodeURIComponent(next) : ''}">Se connecter</a>
          </div>
        </div>
      </div>
    `;
  };

  // ─────────────────────────────────────────────────────────
  // v1.2 — AUTH : FORGOT PASSWORD
  // ─────────────────────────────────────────────────────────

  eat.viewForgot = function (query) {
    const sent = query && query.sent === '1';
    const token = query && query.token;
    const exists = query && query.exists !== '0';

    if (sent) {
      return `
        <div class="auth-page fade-in">
          <div class="auth-card">
            <div class="auth-logo"><span class="app-logo-dot"></span>eatrail</div>
            <div class="auth-banner auth-banner-success" style="margin-top:8px;">
              <span class="auth-banner-icon">✓</span>
              <div>Si un compte existe pour cette adresse, tu vas recevoir un lien de réinitialisation.</div>
            </div>
            ${exists && token ? `
              <div class="auth-banner auth-banner-info">
                <span class="auth-banner-icon">ⓘ</span>
                <div>
                  <strong>Mode prototype :</strong> aucun email n'est réellement envoyé.
                  Voici ton lien de réinitialisation à usage unique (valable 24h) :
                  <p style="margin-top:8px;"><a class="btn btn-primary btn-sm" href="${eat.routeUrl('reset', [], { token })}">Réinitialiser mon mot de passe</a></p>
                </div>
              </div>` : ''}
            <div class="auth-bottom-link">
              <a href="${eat.routeUrl('login')}">← Retour à la connexion</a>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="auth-page fade-in">
        <div class="auth-card">
          <div class="auth-logo"><span class="app-logo-dot"></span>eatrail</div>
          <h1 class="auth-title">Mot de passe oublié</h1>
          <p class="auth-subtitle">Indique l'e-mail du compte. On t'envoie un lien pour en créer un nouveau.</p>

          <form id="forgot-form" novalidate>
            <div class="field">
              <label class="field-label" for="forgot-email">E-mail</label>
              <input type="email" id="forgot-email" name="email" class="field-input" placeholder="ton@email.com" autocomplete="email" required autofocus />
              <div class="field-error" id="forgot-email-error" hidden></div>
            </div>
            <button type="submit" class="btn btn-primary auth-submit" id="forgot-submit">Envoyer le lien</button>
            <div class="auth-banner auth-banner-error" id="forgot-form-error" hidden></div>
          </form>

          <div class="auth-bottom-link">
            <a href="${eat.routeUrl('login')}">← Retour à la connexion</a>
          </div>
        </div>
      </div>
    `;
  };

  // ─────────────────────────────────────────────────────────
  // v1.2 — AUTH : RESET PASSWORD
  // ─────────────────────────────────────────────────────────

  eat.viewReset = function (query) {
    const token = query && query.token;
    if (!token) return redirectView(eat.routeUrl('forgot'));
    const email = eat.auth.checkResetToken(token);

    if (!email) {
      return `
        <div class="auth-page fade-in">
          <div class="auth-card">
            <div class="auth-logo"><span class="app-logo-dot"></span>eatrail</div>
            <div class="auth-banner auth-banner-error">
              <span class="auth-banner-icon">⚠</span>
              <div>Ce lien de réinitialisation est invalide ou expiré.</div>
            </div>
            <a class="btn btn-primary auth-submit" href="${eat.routeUrl('forgot')}">Demander un nouveau lien</a>
          </div>
        </div>
      `;
    }

    return `
      <div class="auth-page fade-in">
        <div class="auth-card">
          <div class="auth-logo"><span class="app-logo-dot"></span>eatrail</div>
          <h1 class="auth-title">Nouveau mot de passe</h1>
          <p class="auth-subtitle">Pour le compte <strong>${esc(email)}</strong>.</p>

          <form id="reset-form" data-token="${esc(token)}" novalidate>
            <div class="field">
              <label class="field-label" for="reset-password">Nouveau mot de passe</label>
              <div class="pwd-wrap">
                <input type="password" id="reset-password" name="password" class="field-input" placeholder="Minimum 8 caractères" autocomplete="new-password" required autofocus />
                <button type="button" class="pwd-toggle" data-pwd-toggle="reset-password" aria-label="Afficher / masquer">👁</button>
              </div>
              <div class="pwd-strength" id="pwd-strength" data-score="0" hidden>
                <div class="pwd-strength-bar">
                  <span class="pwd-strength-segment"></span>
                  <span class="pwd-strength-segment"></span>
                  <span class="pwd-strength-segment"></span>
                  <span class="pwd-strength-segment"></span>
                </div>
                <div class="pwd-strength-label">Force : <strong id="pwd-strength-label">—</strong></div>
                <ul class="pwd-strength-hints" id="pwd-strength-hints"></ul>
              </div>
              <div class="field-error" id="reset-password-error" hidden></div>
            </div>

            <div class="field">
              <label class="field-label" for="reset-password-confirm">Confirme</label>
              <input type="password" id="reset-password-confirm" name="password2" class="field-input" placeholder="Retape le mot de passe" autocomplete="new-password" required />
              <div class="field-error" id="reset-password-confirm-error" hidden></div>
            </div>

            <button type="submit" class="btn btn-primary auth-submit" id="reset-submit">Mettre à jour</button>
            <div class="auth-banner auth-banner-error" id="reset-form-error" hidden></div>
          </form>
        </div>
      </div>
    `;
  };

  // ─────────────────────────────────────────────────────────
  // v1.2 — ACCOUNT (dashboard / settings / security)
  // ─────────────────────────────────────────────────────────

  /** Layout commun avec sidebar (avatar + nav) + contenu. */
  function accountShell(activeTab, body) {
    const u = eat.user();
    if (!u) return redirectView(eat.routeUrl('login', [], { next: '#/account' }));

    const sinceTxt = u.createdAt ? ('Membre depuis ' + eat.fmtDate(new Date(u.createdAt).toISOString())) : '';

    return `
      <div class="container page fade-in">
        <span class="page-eyebrow">Mon compte</span>
        <h1 class="page-title" style="margin-bottom:24px;">Bonjour, ${esc(u.name.split(' ')[0])} ${esc(u.avatar)}</h1>

        <div class="acc-grid">
          <aside class="acc-side">
            <div class="acc-side-header">
              <div class="acc-avatar-big">${esc(u.avatar)}</div>
              <div class="acc-name">${esc(u.name)}</div>
              <div class="acc-email">${esc(u.email)}</div>
              ${sinceTxt ? `<div class="acc-since">${esc(sinceTxt)}</div>` : ''}
            </div>
            <nav class="acc-nav">
              <a class="acc-nav-item ${activeTab === 'overview' ? 'is-active' : ''}" href="${eat.routeUrl('account')}">
                <span class="acc-nav-icon">🏠</span>Vue d'ensemble
              </a>
              <a class="acc-nav-item ${activeTab === 'settings' ? 'is-active' : ''}" href="${eat.routeUrl('settings')}">
                <span class="acc-nav-icon">✎</span>Profil
              </a>
              <a class="acc-nav-item ${activeTab === 'security' ? 'is-active' : ''}" href="${eat.routeUrl('security')}">
                <span class="acc-nav-icon">🔒</span>Sécurité
              </a>
              <a class="acc-nav-item" href="${eat.routeUrl('saved')}">
                <span class="acc-nav-icon">★</span>Mes favoris
              </a>
              <a class="acc-nav-item" href="${eat.routeUrl('cart')}">
                <span class="acc-nav-icon">🛒</span>Mon panier
              </a>
              <a class="acc-nav-item" href="${eat.routeUrl('pantry')}">
                <span class="acc-nav-icon">🥕</span>Mes provisions
              </a>
              <button type="button" class="acc-nav-item acc-nav-danger" id="acc-logout" style="width:100%;text-align:left;">
                <span class="acc-nav-icon">↪</span>Se déconnecter
              </button>
            </nav>
          </aside>

          <main class="acc-main">${body}</main>
        </div>
      </div>
    `;
  }

  /** Vue d'ensemble du compte avec stats. */
  eat.viewAccount = function () {
    const u = eat.user();
    if (!u) return redirectView(eat.routeUrl('login', [], { next: '#/account' }));

    const stats = {
      saved: eat.savedIds().length,
      cart: eat.cart().length,
      pantry: eat.pantry().length,
      reviews: eat.myReviewCount()
    };

    const body = `
      <h2>Vue d'ensemble</h2>
      <p class="acc-main-lead">Tes activités sur eatrail en un coup d'œil.</p>

      <div class="acc-stats">
        <a class="acc-stat" href="${eat.routeUrl('saved')}">
          <span class="acc-stat-icon">★</span>
          <div class="acc-stat-num">${stats.saved}</div>
          <div class="acc-stat-label">Favoris</div>
        </a>
        <a class="acc-stat" href="${eat.routeUrl('cart')}">
          <span class="acc-stat-icon">🛒</span>
          <div class="acc-stat-num">${stats.cart}</div>
          <div class="acc-stat-label">Items au panier</div>
        </a>
        <a class="acc-stat" href="${eat.routeUrl('pantry')}">
          <span class="acc-stat-icon">🥕</span>
          <div class="acc-stat-num">${stats.pantry}</div>
          <div class="acc-stat-label">Provisions</div>
        </a>
        <div class="acc-stat" style="cursor:default;">
          <span class="acc-stat-icon">⭐</span>
          <div class="acc-stat-num">${stats.reviews}</div>
          <div class="acc-stat-label">Avis postés</div>
        </div>
      </div>

      <div class="acc-section-title">Recommandations pour toi</div>
      ${(() => {
        const recos = eat.personalRecs(3);
        if (!recos.length) return '<p style="font-size:14px;color:var(--muted);">Sauvegarde quelques recettes pour activer les recommandations personnalisées.</p>';
        return `<div class="recipe-grid" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;">${recos.map(recipeCard).join('')}</div>`;
      })()}

      <div class="acc-section-title">Raccourcis</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <a class="btn btn-primary btn-sm" href="${eat.routeUrl('recipes')}">Parcourir les recettes</a>
        <a class="btn btn-ghost btn-sm" href="${eat.routeUrl('settings')}">Modifier mon profil</a>
        <a class="btn btn-ghost btn-sm" href="${eat.routeUrl('security')}">Changer mon mot de passe</a>
      </div>
    `;

    return accountShell('overview', body);
  };

  /** Settings : édition nom / avatar / email. */
  eat.viewAccountSettings = function () {
    const u = eat.user();
    if (!u) return redirectView(eat.routeUrl('login', [], { next: '#/settings' }));

    const avatarPicker = eat.AVATARS.map(a =>
      `<button type="button" class="avatar-pick ${a === u.avatar ? 'is-active' : ''}" data-avatar="${esc(a)}">${esc(a)}</button>`
    ).join('');

    const body = `
      <h2>Profil</h2>
      <p class="acc-main-lead">Modifie tes informations personnelles. Ton e-mail sert à te reconnecter.</p>

      <form id="settings-form" novalidate>
        <input type="hidden" id="settings-avatar-input" value="${esc(u.avatar)}" />

        <div class="field">
          <label class="field-label">Avatar</label>
          <div class="profile-avatar-display" id="settings-avatar-display" style="margin:8px auto 12px;">${esc(u.avatar)}</div>
          <div class="avatar-picker avatar-picker-inline">${avatarPicker}</div>
        </div>

        <div class="field">
          <label class="field-label" for="settings-name">Nom ou pseudo</label>
          <input type="text" id="settings-name" class="field-input" maxlength="32" value="${esc(u.name)}" required />
          <div class="field-error" id="settings-name-error" hidden></div>
        </div>

        <div class="field">
          <label class="field-label" for="settings-email">E-mail</label>
          <input type="email" id="settings-email" class="field-input" value="${esc(u.email)}" required />
          <div class="field-help">Si tu changes ton email, utilise le nouveau pour te reconnecter ensuite.</div>
          <div class="field-error" id="settings-email-error" hidden></div>
        </div>

        <button type="submit" class="btn btn-primary auth-submit" id="settings-submit">Enregistrer</button>
        <div class="auth-banner auth-banner-success" id="settings-success" hidden><span class="auth-banner-icon">✓</span><div>Profil mis à jour.</div></div>
        <div class="auth-banner auth-banner-error" id="settings-form-error" hidden></div>
      </form>
    `;

    return accountShell('settings', body);
  };

  /** Security : change password + delete account. */
  eat.viewAccountSecurity = function () {
    const u = eat.user();
    if (!u) return redirectView(eat.routeUrl('login', [], { next: '#/security' }));

    const body = `
      <h2>Sécurité</h2>
      <p class="acc-main-lead">Change ton mot de passe ou supprime définitivement ton compte.</p>

      <form id="password-form" novalidate>
        <div class="field">
          <label class="field-label" for="pwd-current">Mot de passe actuel</label>
          <div class="pwd-wrap">
            <input type="password" id="pwd-current" class="field-input" autocomplete="current-password" required />
            <button type="button" class="pwd-toggle" data-pwd-toggle="pwd-current" aria-label="Afficher / masquer">👁</button>
          </div>
          <div class="field-error" id="pwd-current-error" hidden></div>
        </div>

        <div class="field">
          <label class="field-label" for="pwd-new">Nouveau mot de passe</label>
          <div class="pwd-wrap">
            <input type="password" id="pwd-new" class="field-input" autocomplete="new-password" required />
            <button type="button" class="pwd-toggle" data-pwd-toggle="pwd-new" aria-label="Afficher / masquer">👁</button>
          </div>
          <div class="pwd-strength" id="pwd-strength" data-score="0" hidden>
            <div class="pwd-strength-bar">
              <span class="pwd-strength-segment"></span>
              <span class="pwd-strength-segment"></span>
              <span class="pwd-strength-segment"></span>
              <span class="pwd-strength-segment"></span>
            </div>
            <div class="pwd-strength-label">Force : <strong id="pwd-strength-label">—</strong></div>
            <ul class="pwd-strength-hints" id="pwd-strength-hints"></ul>
          </div>
          <div class="field-error" id="pwd-new-error" hidden></div>
        </div>

        <button type="submit" class="btn btn-primary auth-submit" id="pwd-submit">Changer le mot de passe</button>
        <div class="auth-banner auth-banner-success" id="pwd-success" hidden><span class="auth-banner-icon">✓</span><div>Mot de passe modifié.</div></div>
        <div class="auth-banner auth-banner-error" id="pwd-form-error" hidden></div>
      </form>

      <div class="danger-zone">
        <h3>Zone dangereuse</h3>
        <p>La suppression de ton compte est définitive. Tes favoris, ton panier et tes avis seront perdus.</p>
        <button type="button" class="btn btn-danger-ghost btn-sm" id="acc-delete-toggle">Supprimer mon compte…</button>

        <form id="delete-form" novalidate hidden style="margin-top:18px;">
          <div class="field">
            <label class="field-label" for="del-pwd">Confirme avec ton mot de passe</label>
            <div class="pwd-wrap">
              <input type="password" id="del-pwd" class="field-input" autocomplete="current-password" required />
              <button type="button" class="pwd-toggle" data-pwd-toggle="del-pwd" aria-label="Afficher / masquer">👁</button>
            </div>
            <div class="field-error" id="del-pwd-error" hidden></div>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <button type="submit" class="btn btn-danger" id="del-submit">Supprimer définitivement</button>
            <button type="button" class="btn btn-ghost" id="acc-delete-cancel">Annuler</button>
          </div>
          <div class="auth-banner auth-banner-error" id="del-form-error" hidden></div>
        </form>
      </div>
    `;

    return accountShell('security', body);
  };

  // ─────────────────────────────────────────────────────────
  // v1.3 — ONBOARDING (5 écrans)
  // ─────────────────────────────────────────────────────────

  /**
   * Routeur d'écran selon le numéro d'étape.
   * Retourne le HTML d'un écran complet, full-page (pas de container).
   */
  eat.viewOnboarding = function (stepStr) {
    if (!eat.auth.isAuthenticated()) {
      return redirectView(eat.routeUrl('signup'));
    }
    const step = Math.max(1, Math.min(5, parseInt(stepStr, 10) || 1));
    eat.prefs.patch({ onboardingStep: step });

    let body = '';
    switch (step) {
      case 1: body = onbStepWelcome(); break;
      case 2: body = onbStepDiet(); break;
      case 3: body = onbStepTastes(); break;
      case 4: body = onbStepPractical(); break;
      case 5: body = onbStepPayoff(); break;
    }

    const pct = (step / 5) * 100;
    const labels = ['Bienvenue', 'Régime', 'Goûts', 'Pratique', 'Tes recettes'];

    return `
      <div class="onb-page" id="onb-root">
        <div class="onb-progress">
          <div class="onb-progress-bar"><div class="onb-progress-fill" style="width:${pct}%"></div></div>
          <div class="onb-progress-step">${step} / 5 · ${labels[step - 1]}</div>
          ${step < 5 ? `<a href="#" class="onb-skip" data-onb-skip="1">Passer</a>` : ''}
        </div>
        <div class="onb-body">${body}</div>
      </div>
    `;
  };

  function onbStepWelcome() {
    const u = eat.user();
    return `
      <div class="onb-step">
        <span class="onb-eyebrow">Découverte · 5 étapes · ~2 min</span>
        <h1 class="onb-title">Bienvenue ${esc(u ? u.name.split(' ')[0] : '')},<br/><em>on t'aide à démarrer.</em></h1>
        <p class="onb-lead">5 questions rapides pour qu'eatrail apprenne ce que tu aimes. Plus on en sait, mieux on te suggère des plats que tu vas vraiment cuisiner.</p>

        <div style="display:flex;flex-direction:column;gap:12px;max-width:380px;margin:30px auto 0;font-size:14px;color:var(--ink);text-align:left;">
          <div style="display:flex;align-items:center;gap:10px;"><span style="font-size:22px;">🥦</span> <span>Tes <strong>régimes</strong> et <strong>allergies</strong> — pour ne plus jamais voir un plat qu'on ne peut pas manger</span></div>
          <div style="display:flex;align-items:center;gap:10px;"><span style="font-size:22px;">🌍</span> <span>Tes <strong>cuisines préférées</strong> — pour les mettre en avant</span></div>
          <div style="display:flex;align-items:center;gap:10px;"><span style="font-size:22px;">⏱</span> <span>Ton <strong>temps</strong>, ton <strong>budget</strong>, ton <strong>équipement</strong> — pour le réalisable</span></div>
        </div>

        <div class="onb-actions" style="justify-content:center;margin-top:40px;">
          <a class="btn btn-ghost" href="${eat.routeUrl('home')}" data-onb-skip="1">Plus tard</a>
          <a class="btn btn-primary btn-lg" href="${eat.routeUrl('onboarding', ['2'])}">C'est parti →</a>
        </div>
        <div class="onb-actions-mobile-fixed">
          <a class="btn btn-ghost" href="${eat.routeUrl('home')}" data-onb-skip="1">Plus tard</a>
          <a class="btn btn-primary" href="${eat.routeUrl('onboarding', ['2'])}">C'est parti →</a>
        </div>
      </div>
    `;
  }

  function onbStepDiet() {
    const p = eat.prefs.get();
    const dietsHtml = eat.prefs.DIETS.map(d => `
      <button type="button" class="opt-card ${p.diets.includes(d.id) ? 'is-selected' : ''}"
        data-onb-diet="${esc(d.id)}">
        <span class="opt-card-emoji">${d.emoji}</span>
        <span class="opt-card-label">${esc(d.label)}</span>
      </button>
    `).join('');

    const allergensHtml = eat.prefs.ALLERGENS.map(a => {
      const sev = p.allergens[a.id] || '';
      return `
        <button type="button" class="opt-card ${sev ? 'is-selected' : ''}"
          data-onb-allergen="${esc(a.id)}">
          <span class="opt-card-emoji">${a.emoji}</span>
          <span class="opt-card-label">${esc(a.label)}</span>
          ${sev ? `<div class="opt-card-sev" data-stop="1">
            <button type="button" data-onb-allergen-sev="${esc(a.id)}|soft" class="${sev === 'soft' ? 'is-on' : ''}">léger</button>
            <button type="button" data-onb-allergen-sev="${esc(a.id)}|strict" class="${sev === 'strict' ? 'is-on' : ''}">strict</button>
          </div>` : ''}
        </button>
      `;
    }).join('');

    return `
      <div class="onb-step">
        <span class="onb-eyebrow">Étape 2/5 · Régime + allergies</span>
        <h1 class="onb-title">Y a-t-il des choses<br/>qu'on doit <em>éviter</em> ?</h1>
        <p class="onb-lead">Dis-nous tes régimes et allergies. On filtre les recettes en conséquence — strict (jamais affiché) ou léger (avec warning).</p>

        <div class="onb-section">
          <div class="onb-section-title">Régime alimentaire</div>
          <div class="onb-section-help">Multi-sélection. Tu peux laisser vide si rien ne s'applique.</div>
          <div class="opt-grid">${dietsHtml}</div>
        </div>

        <div class="onb-section">
          <div class="onb-section-title">Allergies déclarées</div>
          <div class="onb-section-help">Clique pour ajouter, puis choisis « léger » (alerte) ou « strict » (jamais affiché).</div>
          <div class="opt-grid">${allergensHtml}</div>
        </div>

        ${onbActions(2, 3)}
      </div>
    `;
  }

  function onbStepTastes() {
    const p = eat.prefs.get();
    const cuisinesHtml = eat.prefs.CUISINES.map(c => `
      <button type="button" class="flag-card ${p.cuisines.includes(c.id) ? 'is-selected' : ''}"
        data-onb-cuisine="${esc(c.id)}">
        <span class="flag-card-flag">${esc(c.flag)}</span>
        <span class="flag-card-label">${esc(c.label)}</span>
      </button>
    `).join('');

    const platesHtml = eat.prefs.SAMPLE_PLATES
      .map(id => eat.recipeById(id))
      .filter(Boolean)
      .map(r => {
        const w = (p.cuisineWeights || {})[r.origin.country] || 0;
        const cls = w > 0 ? 'is-liked' : (w < 0 ? 'is-disliked' : '');
        const tog = w > 0 ? '♥' : (w < 0 ? '×' : '?');
        const img = (window.EATRAIL_IMAGES || {})[r.id] || '';
        // Background = gradient by default (instant render, no flash if image fails);
        // an <img> overlay on top fades in when loaded, so users SEE the actual dish.
        return `
          <button type="button" class="plate-card ${cls}" style="background:${esc(r.gradient)}"
            data-onb-plate="${esc(r.id)}|${esc(r.origin.country)}">
            ${img ? `<img class="plate-card-img" src="${esc(img)}" alt="" loading="lazy" onerror="this.remove();" />` : ''}
            <div class="plate-card-flag">${esc(r.origin.flag)}</div>
            <div class="plate-card-toggle">${tog}</div>
            <div class="plate-card-title">${esc(r.title)}</div>
          </button>
        `;
      }).join('');

    const spice = p.spiceTolerance || 2;
    const lvl = p.cookingLevel || 2;
    const lvlsHtml = eat.prefs.COOKING_LEVELS.map(l => `
      <button type="button" class="level-card ${lvl === l.id ? 'is-selected' : ''}"
        data-onb-level="${l.id}">
        <span class="level-emoji">${l.emoji}</span>
        <div class="level-label">${esc(l.label)}</div>
        <div class="level-desc">${esc(l.desc)}</div>
      </button>
    `).join('');

    const userMoods = new Set(p.moods || []);
    const moodsHtml = eat.prefs.MOODS.map(m => `
      <button type="button" class="opt-card ${userMoods.has(m.id) ? 'is-selected' : ''}"
        data-onb-mood="${esc(m.id)}">
        <span class="opt-card-emoji">${m.emoji}</span>
        <span class="opt-card-label">${esc(m.label)}</span>
        <span class="opt-card-sub">${esc(m.desc)}</span>
      </button>
    `).join('');

    return `
      <div class="onb-step">
        <span class="onb-eyebrow">Étape 3/5 · Goûts</span>
        <h1 class="onb-title">Qu'est-ce qui<br/><em>te fait envie</em> ?</h1>
        <p class="onb-lead">Sélectionne tes cuisines préférées et clique sur les plats qui te tentent. Plus tu en dis, mieux on te suggère.</p>

        <div class="onb-section">
          <div class="onb-section-title">Tes cuisines aimées</div>
          <div class="onb-section-help">Multi-sélection. Boost direct sur les recettes correspondantes.</div>
          <div class="flag-grid">${cuisinesHtml}</div>
        </div>

        <div class="onb-section">
          <div class="onb-section-title">Tu aimes ? Tu n'aimes pas ?</div>
          <div class="onb-section-help">Clique une fois pour aimer (♥), deux fois pour ne pas aimer (×).</div>
          <div class="plate-grid">${platesHtml}</div>
        </div>

        <div class="onb-section">
          <div class="onb-section-title">Tolérance au piquant : <strong style="color:var(--primary);">${esc(eat.prefs.SPICE_LABELS[spice])}</strong></div>
          <div class="range-wrap">
            <input type="range" class="range-input" id="onb-spice"
              min="0" max="5" step="1" value="${spice}"
              style="--pct: ${(spice / 5) * 100}%" />
            <div class="range-marks">
              <span>doux</span><span>moyen</span><span>fort</span><span>brûle-moi</span>
            </div>
          </div>
        </div>

        <div class="onb-section">
          <div class="onb-section-title">Quel style te tente ?</div>
          <div class="onb-section-help">Multi-sélection. Boost les recettes correspondantes (ex. "Sain" pour manger léger, "Gourmand" pour se faire plaisir).</div>
          <div class="opt-grid">${moodsHtml}</div>
        </div>

        <div class="onb-section">
          <div class="onb-section-title">Niveau cuisinier</div>
          <div class="level-grid">${lvlsHtml}</div>
        </div>

        ${onbActions(3, 4, 2)}
      </div>
    `;
  }

  function onbStepPractical() {
    const p = eat.prefs.get();
    const equipHtml = eat.prefs.EQUIPMENT.map(eq => `
      <button type="button" class="opt-card ${p.equipment.includes(eq.id) ? 'is-selected' : ''}"
        data-onb-equipment="${esc(eq.id)}">
        <span class="opt-card-emoji">${eq.emoji}</span>
        <span class="opt-card-label">${esc(eq.label)}</span>
      </button>
    `).join('');

    const adults = (p.household && p.household.adults) || 2;
    const kids = (p.household && p.household.kids) || 0;
    const budget = p.weeklyBudget || 100;
    const minutes = p.weeknightMinutes || 30;

    return `
      <div class="onb-step">
        <span class="onb-eyebrow">Étape 4/5 · Pratique</span>
        <h1 class="onb-title">Le <em>vrai</em> de la vie<br/>de tous les jours.</h1>
        <p class="onb-lead">Combien de bouches, combien de temps, combien de dollars : on calibre les suggestions là-dessus.</p>

        <div class="onb-section">
          <div class="onb-section-title">Ton foyer</div>
          <div style="display:flex;gap:24px;flex-wrap:wrap;align-items:center;">
            <div>
              <div style="font-size:13px;color:var(--muted);margin-bottom:6px;">Adultes</div>
              <div class="stepper">
                <button type="button" data-onb-household="adults|-1">−</button>
                <span class="stepper-value" id="onb-adults">${adults}</span>
                <button type="button" data-onb-household="adults|1">+</button>
              </div>
            </div>
            <div>
              <div style="font-size:13px;color:var(--muted);margin-bottom:6px;">Enfants</div>
              <div class="stepper">
                <button type="button" data-onb-household="kids|-1">−</button>
                <span class="stepper-value" id="onb-kids">${kids}</span>
                <button type="button" data-onb-household="kids|1">+</button>
              </div>
            </div>
          </div>
        </div>

        <div class="onb-section">
          <div class="onb-section-title">Budget courses hebdo : <strong style="color:var(--primary);">$<span id="onb-budget-val">${budget}</span></strong></div>
          <div class="range-wrap">
            <input type="range" class="range-input" id="onb-budget"
              min="30" max="300" step="10" value="${budget}"
              style="--pct: ${((budget - 30) / 270) * 100}%" />
            <div class="range-marks">
              <span>$30</span><span>$100</span><span>$200</span><span>$300+</span>
            </div>
          </div>
        </div>

        <div class="onb-section">
          <div class="onb-section-title">Temps moyen le soir : <strong style="color:var(--primary);"><span id="onb-time-val">${minutes}</span> min</strong></div>
          <div class="range-wrap">
            <input type="range" class="range-input" id="onb-time"
              min="15" max="120" step="15" value="${minutes}"
              style="--pct: ${((minutes - 15) / 105) * 100}%" />
            <div class="range-marks">
              <span>15</span><span>45</span><span>1h</span><span>2h</span>
            </div>
          </div>
        </div>

        <div class="onb-section">
          <div class="onb-section-title">Code postal</div>
          <div class="onb-section-help">Pour trouver les magasins les plus proches. Par défaut : Midtown NYC.</div>
          <input type="text" id="onb-zip" class="field-input" maxlength="10" value="${esc(p.zip)}" style="max-width:200px;" />
        </div>

        <div class="onb-section">
          <div class="onb-section-title">Ton équipement</div>
          <div class="onb-section-help">Coche ce que tu as. On filtre les recettes impossibles.</div>
          <div class="opt-grid">${equipHtml}</div>
        </div>

        ${onbActions(4, 5, 3)}
      </div>
    `;
  }

  function onbStepPayoff() {
    // Génère 6 recettes recommandées en fonction des prefs
    const recipes = eat.prefs.filterRecipes(eat.allRecipes(), { sortByScore: true }).slice(0, 6);
    const cardsHtml = recipes.length
      ? recipes.map(r => recipeCardWithMatch(r)).join('')
      : `<div class="empty"><h3>Hum, aucun match parfait</h3><p>Tes critères sont stricts. Tu pourras les ajuster dans <a href="${eat.routeUrl('preferences')}">Mes préférences</a>.</p></div>`;

    return `
      <div class="onb-step">
        <span class="onb-eyebrow">Étape 5/5 · Le payoff</span>
        <h1 class="onb-title">Voici 6 recettes<br/><em>faites pour toi.</em></h1>
        <p class="onb-lead">On les a sélectionnées en croisant tes goûts, contraintes et équipement. Sauvegarde celles qui te plaisent — elles iront dans tes Favoris.</p>

        <div style="margin: 0 auto 28px; max-width: 100%;">
          <div class="recipe-grid" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;">
            ${cardsHtml}
          </div>
        </div>

        <div class="onb-actions" style="justify-content:center;">
          <a class="btn btn-ghost" href="${eat.routeUrl('onboarding', ['4'])}">← Retour</a>
          <button type="button" class="btn btn-primary btn-lg" id="onb-finish">Terminer & explorer →</button>
        </div>
        <div class="onb-actions-mobile-fixed">
          <a class="btn btn-ghost" href="${eat.routeUrl('onboarding', ['4'])}">←</a>
          <button type="button" class="btn btn-primary" id="onb-finish">Terminer →</button>
        </div>
      </div>
    `;
  }

  /** Footer d'actions pour les étapes intermédiaires. */
  function onbActions(currentStep, nextStep, prevStep) {
    const prev = prevStep ? `<a class="btn btn-ghost" href="${eat.routeUrl('onboarding', [String(prevStep)])}">← Retour</a>` : '<span></span>';
    return `
      <div class="onb-actions">
        ${prev}
        <a class="btn btn-primary btn-lg" href="${eat.routeUrl('onboarding', [String(nextStep)])}">Continuer →</a>
      </div>
      <div class="onb-actions-mobile-fixed">
        ${prevStep ? `<a class="btn btn-ghost" href="${eat.routeUrl('onboarding', [String(prevStep)])}">←</a>` : ''}
        <a class="btn btn-primary" href="${eat.routeUrl('onboarding', [String(nextStep)])}">Continuer →</a>
      </div>
    `;
  }

  /** Carte recette enrichie d'un badge "match XX%" (utilisée sur le payoff + recos perso). */
  function recipeCardWithMatch(r) {
    const score = eat.prefs.scoreRecipe(r);
    const al = eat.prefs.matchesAllergens(r);
    const matchClass = al.status === 'warn' ? 'is-warn' : '';
    const html = recipeCard(r);
    // Insère le badge match juste après recipe-card-hero
    return html.replace(
      '<div class="recipe-card-hero"',
      `<div class="match-badge ${matchClass}" style="position:absolute;top:14px;left:14px;">${score}% match</div><div class="recipe-card-hero"`
    ).replace(
      'class="recipe-card"',
      'class="recipe-card" style="position:relative;"'
    );
  }
  eat.recipeCardWithMatch = recipeCardWithMatch;

  // ─────────────────────────────────────────────────────────
  // v1.3 — Page Préférences
  // ─────────────────────────────────────────────────────────

  eat.viewAccountPreferences = function () {
    const u = eat.user();
    if (!u) return redirectView(eat.routeUrl('login', [], { next: '#/preferences' }));

    const p = eat.prefs.get();
    const activeCount = eat.prefs.activeFilterCount();

    const dietsHtml = eat.prefs.DIETS.map(d => `
      <button type="button" class="opt-card ${p.diets.includes(d.id) ? 'is-selected' : ''}"
        data-prefs-diet="${esc(d.id)}">
        <span class="opt-card-emoji">${d.emoji}</span>
        <span class="opt-card-label">${esc(d.label)}</span>
      </button>
    `).join('');

    const allergensHtml = eat.prefs.ALLERGENS.map(a => {
      const sev = p.allergens[a.id] || '';
      return `
        <button type="button" class="opt-card ${sev ? 'is-selected' : ''}"
          data-prefs-allergen="${esc(a.id)}">
          <span class="opt-card-emoji">${a.emoji}</span>
          <span class="opt-card-label">${esc(a.label)}</span>
          ${sev ? `<div class="opt-card-sev" data-stop="1">
            <button type="button" data-prefs-allergen-sev="${esc(a.id)}|soft" class="${sev === 'soft' ? 'is-on' : ''}">léger</button>
            <button type="button" data-prefs-allergen-sev="${esc(a.id)}|strict" class="${sev === 'strict' ? 'is-on' : ''}">strict</button>
          </div>` : ''}
        </button>
      `;
    }).join('');

    const cuisinesHtml = eat.prefs.CUISINES.map(c => `
      <button type="button" class="flag-card ${p.cuisines.includes(c.id) ? 'is-selected' : ''}"
        data-prefs-cuisine="${esc(c.id)}">
        <span class="flag-card-flag">${esc(c.flag)}</span>
        <span class="flag-card-label">${esc(c.label)}</span>
      </button>
    `).join('');

    const lvlsHtml = eat.prefs.COOKING_LEVELS.map(l => `
      <button type="button" class="level-card ${(p.cookingLevel || 2) === l.id ? 'is-selected' : ''}"
        data-prefs-level="${l.id}">
        <span class="level-emoji">${l.emoji}</span>
        <div class="level-label">${esc(l.label)}</div>
        <div class="level-desc">${esc(l.desc)}</div>
      </button>
    `).join('');

    const equipHtml = eat.prefs.EQUIPMENT.map(eq => `
      <button type="button" class="opt-card ${p.equipment.includes(eq.id) ? 'is-selected' : ''}"
        data-prefs-equipment="${esc(eq.id)}">
        <span class="opt-card-emoji">${eq.emoji}</span>
        <span class="opt-card-label">${esc(eq.label)}</span>
      </button>
    `).join('');

    const dislikesChips = (p.dislikes || []).map(d => `
      <span class="pantry-chip">${esc(d)}<button type="button" data-prefs-dislike-remove="${esc(d)}">×</button></span>
    `).join('');

    const adults = (p.household && p.household.adults) || 2;
    const kids = (p.household && p.household.kids) || 0;
    const budget = p.weeklyBudget || 100;
    const minutes = p.weeknightMinutes || 30;
    const spice = p.spiceTolerance || 2;

    const body = `
      <h2>Mes préférences</h2>
      <p class="acc-main-lead">${activeCount} filtre${activeCount > 1 ? 's' : ''} actif${activeCount > 1 ? 's' : ''}. Modifie ce que tu veux — c'est sauvegardé en direct.</p>

      ${!p.onboardingCompleted ? `
        <div class="auth-banner auth-banner-info" style="margin-bottom:24px;">
          <span class="auth-banner-icon">ⓘ</span>
          <div>Ton onboarding n'est pas terminé. <a href="${eat.routeUrl('onboarding', [String(p.onboardingStep || 1)])}" style="color:var(--primary);font-weight:600;">Reprendre</a> ou continue ici à la main.</div>
        </div>
      ` : ''}

      <div class="prefs-section">
        <div class="prefs-section-head">
          <div class="prefs-section-title">Régime alimentaire</div>
          ${(p.diets || []).length ? `<span class="prefs-section-active">${p.diets.length} actif${p.diets.length > 1 ? 's' : ''}</span>` : ''}
        </div>
        <div class="opt-grid">${dietsHtml}</div>
      </div>

      <div class="prefs-section">
        <div class="prefs-section-head">
          <div class="prefs-section-title">Allergies</div>
          ${Object.keys(p.allergens || {}).length ? `<span class="prefs-section-active">${Object.keys(p.allergens).length} actif${Object.keys(p.allergens).length > 1 ? 's' : ''}</span>` : ''}
        </div>
        <div class="opt-grid">${allergensHtml}</div>
      </div>

      <div class="prefs-section">
        <div class="prefs-section-head">
          <div class="prefs-section-title">Aversions (ingrédients à éviter)</div>
        </div>
        <form class="dislike-input" id="prefs-dislike-form">
          <input type="text" id="prefs-dislike-input" placeholder="Ex : coriandre, abats…" autocomplete="off" />
          <button type="submit" class="btn btn-primary btn-sm">Ajouter</button>
        </form>
        <div class="dislike-list">${dislikesChips || '<span style="font-size:13px;color:var(--muted);">Aucune aversion déclarée.</span>'}</div>
      </div>

      <div class="prefs-section">
        <div class="prefs-section-head">
          <div class="prefs-section-title">Cuisines préférées</div>
          ${(p.cuisines || []).length ? `<span class="prefs-section-active">${p.cuisines.length} active${p.cuisines.length > 1 ? 's' : ''}</span>` : ''}
        </div>
        <div class="flag-grid">${cuisinesHtml}</div>
      </div>

      <div class="prefs-section">
        <div class="prefs-section-head">
          <div class="prefs-section-title">Tolérance épicé : <span style="color:var(--primary);">${esc(eat.prefs.SPICE_LABELS[spice])}</span></div>
        </div>
        <div class="range-wrap">
          <input type="range" class="range-input" id="prefs-spice"
            min="0" max="5" step="1" value="${spice}"
            style="--pct: ${(spice / 5) * 100}%" />
          <div class="range-marks">
            <span>doux</span><span>moyen</span><span>fort</span><span>brûle-moi</span>
          </div>
        </div>
      </div>

      <div class="prefs-section">
        <div class="prefs-section-head">
          <div class="prefs-section-title">Niveau cuisinier</div>
        </div>
        <div class="level-grid">${lvlsHtml}</div>
      </div>

      <div class="prefs-section">
        <div class="prefs-section-head">
          <div class="prefs-section-title">Foyer + budget + temps</div>
        </div>
        <div style="display:flex;gap:24px;flex-wrap:wrap;align-items:flex-end;margin-bottom:18px;">
          <div>
            <div style="font-size:13px;color:var(--muted);margin-bottom:6px;">Adultes</div>
            <div class="stepper">
              <button type="button" data-prefs-household="adults|-1">−</button>
              <span class="stepper-value" id="prefs-adults">${adults}</span>
              <button type="button" data-prefs-household="adults|1">+</button>
            </div>
          </div>
          <div>
            <div style="font-size:13px;color:var(--muted);margin-bottom:6px;">Enfants</div>
            <div class="stepper">
              <button type="button" data-prefs-household="kids|-1">−</button>
              <span class="stepper-value" id="prefs-kids">${kids}</span>
              <button type="button" data-prefs-household="kids|1">+</button>
            </div>
          </div>
        </div>
        <div style="margin-bottom:18px;">
          <div style="font-size:13px;color:var(--muted);margin-bottom:6px;">Budget hebdo : <strong style="color:var(--primary);">$<span id="prefs-budget-val">${budget}</span></strong></div>
          <div class="range-wrap">
            <input type="range" class="range-input" id="prefs-budget" min="30" max="300" step="10" value="${budget}"
              style="--pct: ${((budget - 30) / 270) * 100}%" />
          </div>
        </div>
        <div>
          <div style="font-size:13px;color:var(--muted);margin-bottom:6px;">Temps semaine : <strong style="color:var(--primary);"><span id="prefs-time-val">${minutes}</span> min</strong></div>
          <div class="range-wrap">
            <input type="range" class="range-input" id="prefs-time" min="15" max="120" step="15" value="${minutes}"
              style="--pct: ${((minutes - 15) / 105) * 100}%" />
          </div>
        </div>
      </div>

      <div class="prefs-section">
        <div class="prefs-section-head">
          <div class="prefs-section-title">Équipement</div>
          ${(p.equipment || []).length ? `<span class="prefs-section-active">${p.equipment.length} item${p.equipment.length > 1 ? 's' : ''}</span>` : ''}
        </div>
        <div class="opt-grid">${equipHtml}</div>
      </div>

      <div class="prefs-section">
        <div class="prefs-section-head">
          <div class="prefs-section-title">Code postal</div>
        </div>
        <input type="text" id="prefs-zip" class="field-input" maxlength="10" value="${esc(p.zip)}" style="max-width:200px;" />
      </div>

      <div class="danger-zone" style="margin-top:18px;">
        <h3 style="color:var(--ink);">Refaire l'onboarding</h3>
        <p>Repasse les 5 écrans à zéro pour repartir d'une feuille blanche.</p>
        <a class="btn btn-ghost btn-sm" href="${eat.routeUrl('onboarding', ['1'])}" id="prefs-redo-onb">Recommencer la découverte</a>
      </div>
    `;

    return accountShellExtended('preferences', body);
  };

  /** Variante de accountShell qui inclut un onglet "Préférences". */
  function accountShellExtended(activeTab, body) {
    const u = eat.user();
    if (!u) return redirectView(eat.routeUrl('login', [], { next: '#/preferences' }));

    const sinceTxt = u.createdAt ? ('Membre depuis ' + eat.fmtDate(new Date(u.createdAt).toISOString())) : '';
    return `
      <div class="container page fade-in">
        <span class="page-eyebrow">Mon compte</span>
        <h1 class="page-title" style="margin-bottom:24px;">Bonjour, ${esc(u.name.split(' ')[0])} ${esc(u.avatar)}</h1>

        <div class="acc-grid">
          <aside class="acc-side">
            <div class="acc-side-header">
              <div class="acc-avatar-big">${esc(u.avatar)}</div>
              <div class="acc-name">${esc(u.name)}</div>
              <div class="acc-email">${esc(u.email)}</div>
              ${sinceTxt ? `<div class="acc-since">${esc(sinceTxt)}</div>` : ''}
            </div>
            <nav class="acc-nav">
              <a class="acc-nav-item ${activeTab === 'overview' ? 'is-active' : ''}" href="${eat.routeUrl('account')}"><span class="acc-nav-icon">🏠</span>Vue d'ensemble</a>
              <a class="acc-nav-item ${activeTab === 'preferences' ? 'is-active' : ''}" href="${eat.routeUrl('preferences')}"><span class="acc-nav-icon">🎯</span>Préférences</a>
              <a class="acc-nav-item ${activeTab === 'settings' ? 'is-active' : ''}" href="${eat.routeUrl('settings')}"><span class="acc-nav-icon">✎</span>Profil</a>
              <a class="acc-nav-item ${activeTab === 'security' ? 'is-active' : ''}" href="${eat.routeUrl('security')}"><span class="acc-nav-icon">🔒</span>Sécurité</a>
              <a class="acc-nav-item" href="${eat.routeUrl('saved')}"><span class="acc-nav-icon">★</span>Mes favoris</a>
              <a class="acc-nav-item" href="${eat.routeUrl('cart')}"><span class="acc-nav-icon">🛒</span>Mon panier</a>
              <a class="acc-nav-item" href="${eat.routeUrl('pantry')}"><span class="acc-nav-icon">🥕</span>Mes provisions</a>
              <button type="button" class="acc-nav-item acc-nav-danger" id="acc-logout" style="width:100%;text-align:left;">
                <span class="acc-nav-icon">↪</span>Se déconnecter
              </button>
            </nav>
          </aside>

          <main class="acc-main">${body}</main>
        </div>
      </div>
    `;
  }
  // Remplace l'ancien accountShell (qui n'avait pas l'onglet Préférences).
  // Les vues existantes (viewAccount/Settings/Security) doivent maintenant l'utiliser :
  eat.viewAccount = (function (orig) {
    return function () {
      const u = eat.user();
      if (!u) return redirectView(eat.routeUrl('login', [], { next: '#/account' }));
      // Récupère le body depuis l'ancienne fonction en interceptant
      // (plus simple : on duplique le body ici pour éviter le couplage)
      const stats = {
        saved: eat.savedIds().length,
        cart: eat.cart().length,
        pantry: eat.pantry().length,
        reviews: eat.myReviewCount()
      };
      const recosCount = eat.prefs.activeFilterCount();
      const banner = eat.prefs.isOnboardingNeeded() ? `
        <div class="onb-banner" style="margin-bottom:24px;">
          <div class="onb-banner-icon">✨</div>
          <div class="onb-banner-body">
            <div class="onb-banner-title">Termine la découverte</div>
            <div class="onb-banner-text">Réponds à ${5 - ((eat.prefs.get().onboardingStep || 1) - 1)} questions de plus pour des recommandations sur-mesure.</div>
          </div>
          <a class="btn btn-sm" href="${eat.routeUrl('onboarding', [String(eat.prefs.onboardingResumeStep())])}">Reprendre →</a>
        </div>` : '';

      const body = `
        ${banner}
        <h2>Vue d'ensemble</h2>
        <p class="acc-main-lead">Tes activités sur eatrail en un coup d'œil. ${recosCount > 0 ? `<strong>${recosCount} préférences actives</strong> appliquées à tes recos.` : ''}</p>

        <div class="acc-stats">
          <a class="acc-stat" href="${eat.routeUrl('saved')}">
            <span class="acc-stat-icon">★</span>
            <div class="acc-stat-num">${stats.saved}</div>
            <div class="acc-stat-label">Favoris</div>
          </a>
          <a class="acc-stat" href="${eat.routeUrl('cart')}">
            <span class="acc-stat-icon">🛒</span>
            <div class="acc-stat-num">${stats.cart}</div>
            <div class="acc-stat-label">Items au panier</div>
          </a>
          <a class="acc-stat" href="${eat.routeUrl('pantry')}">
            <span class="acc-stat-icon">🥕</span>
            <div class="acc-stat-num">${stats.pantry}</div>
            <div class="acc-stat-label">Provisions</div>
          </a>
          <div class="acc-stat" style="cursor:default;">
            <span class="acc-stat-icon">⭐</span>
            <div class="acc-stat-num">${stats.reviews}</div>
            <div class="acc-stat-label">Avis postés</div>
          </div>
        </div>

        <div class="acc-section-title">Recommandations pour toi</div>
        ${(() => {
          const recos = eat.personalRecs(3);
          if (!recos.length) return '<p style="font-size:14px;color:var(--muted);">Sauvegarde quelques recettes ou complète tes préférences pour des recos personnalisées.</p>';
          return `<div class="recipe-grid" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;">${recos.map(recipeCardWithMatch).join('')}</div>`;
        })()}

        <div class="acc-section-title">Raccourcis</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <a class="btn btn-primary btn-sm" href="${eat.routeUrl('recipes')}">Parcourir les recettes</a>
          <a class="btn btn-ghost btn-sm" href="${eat.routeUrl('preferences')}">Mes préférences</a>
          <a class="btn btn-ghost btn-sm" href="${eat.routeUrl('settings')}">Profil</a>
          <a class="btn btn-ghost btn-sm" href="${eat.routeUrl('security')}">Sécurité</a>
        </div>
      `;
      return accountShellExtended('overview', body);
    };
  })(eat.viewAccount);

  eat.viewAccountSettings = (function (orig) {
    return function () {
      const u = eat.user();
      if (!u) return redirectView(eat.routeUrl('login', [], { next: '#/settings' }));
      const avatarPicker = eat.AVATARS.map(a =>
        `<button type="button" class="avatar-pick ${a === u.avatar ? 'is-active' : ''}" data-avatar="${esc(a)}">${esc(a)}</button>`
      ).join('');
      const body = `
        <h2>Profil</h2>
        <p class="acc-main-lead">Modifie tes informations personnelles.</p>
        <form id="settings-form" novalidate>
          <input type="hidden" id="settings-avatar-input" value="${esc(u.avatar)}" />
          <div class="field">
            <label class="field-label">Avatar</label>
            <div class="profile-avatar-display" id="settings-avatar-display" style="margin:8px auto 12px;">${esc(u.avatar)}</div>
            <div class="avatar-picker avatar-picker-inline">${avatarPicker}</div>
          </div>
          <div class="field">
            <label class="field-label" for="settings-name">Nom ou pseudo</label>
            <input type="text" id="settings-name" class="field-input" maxlength="32" value="${esc(u.name)}" required />
            <div class="field-error" id="settings-name-error" hidden></div>
          </div>
          <div class="field">
            <label class="field-label" for="settings-email">E-mail</label>
            <input type="email" id="settings-email" class="field-input" value="${esc(u.email)}" required />
            <div class="field-help">Si tu changes ton email, utilise le nouveau pour te reconnecter ensuite.</div>
            <div class="field-error" id="settings-email-error" hidden></div>
          </div>
          <button type="submit" class="btn btn-primary auth-submit" id="settings-submit">Enregistrer</button>
          <div class="auth-banner auth-banner-success" id="settings-success" hidden><span class="auth-banner-icon">✓</span><div>Profil mis à jour.</div></div>
          <div class="auth-banner auth-banner-error" id="settings-form-error" hidden></div>
        </form>
      `;
      return accountShellExtended('settings', body);
    };
  })(eat.viewAccountSettings);

  eat.viewAccountSecurity = (function (orig) {
    return function () {
      const u = eat.user();
      if (!u) return redirectView(eat.routeUrl('login', [], { next: '#/security' }));
      const body = `
        <h2>Sécurité</h2>
        <p class="acc-main-lead">Change ton mot de passe ou supprime ton compte.</p>

        <form id="password-form" novalidate>
          <div class="field">
            <label class="field-label" for="pwd-current">Mot de passe actuel</label>
            <div class="pwd-wrap">
              <input type="password" id="pwd-current" class="field-input" autocomplete="current-password" required />
              <button type="button" class="pwd-toggle" data-pwd-toggle="pwd-current" aria-label="Afficher / masquer">👁</button>
            </div>
            <div class="field-error" id="pwd-current-error" hidden></div>
          </div>
          <div class="field">
            <label class="field-label" for="pwd-new">Nouveau mot de passe</label>
            <div class="pwd-wrap">
              <input type="password" id="pwd-new" class="field-input" autocomplete="new-password" required />
              <button type="button" class="pwd-toggle" data-pwd-toggle="pwd-new" aria-label="Afficher / masquer">👁</button>
            </div>
            <div class="pwd-strength" id="pwd-strength" data-score="0" hidden>
              <div class="pwd-strength-bar">
                <span class="pwd-strength-segment"></span>
                <span class="pwd-strength-segment"></span>
                <span class="pwd-strength-segment"></span>
                <span class="pwd-strength-segment"></span>
              </div>
              <div class="pwd-strength-label">Force : <strong id="pwd-strength-label">—</strong></div>
              <ul class="pwd-strength-hints" id="pwd-strength-hints"></ul>
            </div>
            <div class="field-error" id="pwd-new-error" hidden></div>
          </div>
          <button type="submit" class="btn btn-primary auth-submit" id="pwd-submit">Changer le mot de passe</button>
          <div class="auth-banner auth-banner-success" id="pwd-success" hidden><span class="auth-banner-icon">✓</span><div>Mot de passe modifié.</div></div>
          <div class="auth-banner auth-banner-error" id="pwd-form-error" hidden></div>
        </form>

        <div class="danger-zone">
          <h3>Zone dangereuse</h3>
          <p>La suppression de ton compte est définitive. Tes favoris, ton panier et tes avis seront perdus.</p>
          <button type="button" class="btn btn-danger-ghost btn-sm" id="acc-delete-toggle">Supprimer mon compte…</button>
          <form id="delete-form" novalidate hidden style="margin-top:18px;">
            <div class="field">
              <label class="field-label" for="del-pwd">Confirme avec ton mot de passe</label>
              <div class="pwd-wrap">
                <input type="password" id="del-pwd" class="field-input" autocomplete="current-password" required />
                <button type="button" class="pwd-toggle" data-pwd-toggle="del-pwd" aria-label="Afficher / masquer">👁</button>
              </div>
              <div class="field-error" id="del-pwd-error" hidden></div>
            </div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;">
              <button type="submit" class="btn btn-danger" id="del-submit">Supprimer définitivement</button>
              <button type="button" class="btn btn-ghost" id="acc-delete-cancel">Annuler</button>
            </div>
            <div class="auth-banner auth-banner-error" id="del-form-error" hidden></div>
          </form>
        </div>
      `;
      return accountShellExtended('security', body);
    };
  })(eat.viewAccountSecurity);

  // ─────────────────────────────────────────────────────────
  // Helpers : redirect view (immédiate via location.replace)
  // ─────────────────────────────────────────────────────────

  function redirectView(toHash) {
    requestAnimationFrame(() => { location.replace(toHash); });
    return `<div class="container page"><div class="empty"><p>Redirection…</p></div></div>`;
  }
  eat.redirectView = redirectView;

  // ─────────────────────────────────────────────────────────
  // 404
  // ─────────────────────────────────────────────────────────

  function notFoundView(label) {
    return `
      <div class="container page fade-in">
        <div class="empty">
          <h3>${esc(label || 'Page introuvable')}</h3>
          <p>Le contenu demandé n'existe pas (encore).</p>
          <p style="margin-top:24px;"><a class="btn btn-primary" href="${eat.routeUrl('home')}">Retour accueil</a></p>
        </div>
      </div>
    `;
  }

  eat.viewNotFound = notFoundView;

})(window.eat);
