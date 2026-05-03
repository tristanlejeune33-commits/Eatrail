/* eatrail · v1.4 — recipes / middle-east
 * Cuisines couvertes : Liban, Israël/Palestine, Turquie, Iran.
 */

window.EATRAIL_RECIPES = (window.EATRAIL_RECIPES || []).concat([

  // ── LIBAN ─────────────────────────────────────────────
  {
    id: "hummus-pita",
    title: "Hummus & Pita maison",
    origin: { country: "Liban", region: "Beyrouth", flag: "🇱🇧" },
    auth: 90, duration: 60, servings: 6, difficulty: 1,
    budget: { perPerson: 2.8, level: "$" },
    diets: ["vegan", "vegetarian", "dairy-free"], moods: ["healthy", "quick"],
    gradient: "linear-gradient(135deg, #F5F7EE 0%, #5C8A3A 100%)",
    summary: "Purée de pois chiches lisse et soyeuse au tahini, avec pain pita gonflé maison.",
    story: "Le débat sur l'origine ne sera jamais clos. Mais la technique levantine est claire : pois chiches secs cuits longtemps, peaux retirées, mixés très très longtemps avec tahini glacé pour la blancheur. Le tahini doit venir d'Al Wadi ou Soom — la signature.",
    validator: { name: "Rania Haddad", role: "Cuisinière · Tanoreen", city: "Bay Ridge, Brooklyn" },
    category: "mezze", allergens: ["sésame", "gluten"],
    ingredients: [
      { name: "Pois chiches secs", qty: 250, unit: "g", tags: ["middle-east", "pantry"] },
      { name: "Bicarbonate de soude", qty: 1, unit: "c.c.", tags: ["pantry"] },
      { name: "Tahini de qualité (Al Wadi)", qty: 150, unit: "g", tags: ["middle-east", "specialty"], rare: true, substitutes: ["tahini supermarché (texture moins fine)"] },
      { name: "Citrons jaunes", qty: 3, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Ail frais", qty: 2, unit: "gousses", tags: ["produce", "supermarket"] },
      { name: "Cumin moulu", qty: 1, unit: "c.c.", tags: ["pantry"] },
      { name: "Huile d'olive vierge libanaise", qty: 80, unit: "ml", tags: ["middle-east", "european", "pantry"] },
      { name: "Sumac", qty: 1, unit: "c.c.", tags: ["middle-east", "specialty"], rare: true },
      { name: "Farine T55", qty: 500, unit: "g", tags: ["pantry", "supermarket"] },
      { name: "Levure boulangère sèche", qty: 7, unit: "g", tags: ["pantry", "supermarket"] }
    ],
    steps: [
      { title: "Tremper pois chiches", instruction: "12h dans 3x leur volume d'eau + 1 c.c. bicarbonate.", time: 720 },
      { title: "Cuire pois chiches", instruction: "Égoutter. Eau fraîche + 1 c.c. bicarbonate, bouillir 1h jusqu'à très tendres. Écumer les peaux qui remontent.", time: 60 },
      { title: "Hummus", instruction: "Mixer pois chiches encore tièdes 5 min avec ail, jus de 2 citrons, cumin, sel. Ajouter tahini glacé, eau glacée petit à petit. Mixer 5 min de plus jusqu'à mousse.", time: 12 },
      { title: "Pâte à pita", instruction: "Levure + 320 ml eau tiède + sucre 5 min. Mélanger farine + sel, ajouter, pétrir 8 min. Pousse 1h.", time: 75 },
      { title: "Cuisson pita", instruction: "Boules de 80 g, étaler 4 mm. Four 250 °C avec plaque préchauffée, 3 min : doit gonfler en boule.", time: 12 },
      { title: "Dressage", instruction: "Hummus dans assiette creuse, creuser le centre, huile d'olive, sumac, pois chiches entiers. Servir avec pita chaud." }
    ]
  },

  {
    id: "manakish-zaatar",
    title: "Manakish Za'atar",
    origin: { country: "Liban", region: "Beqaa", flag: "🇱🇧" },
    auth: 92, duration: 90, servings: 4, difficulty: 1,
    budget: { perPerson: 2.4, level: "$" },
    diets: ["vegan", "vegetarian"], moods: ["quick", "healthy", "comfort"],
    gradient: "linear-gradient(135deg, #5C8A3A 0%, #D9A441 100%)",
    summary: "Pain plat libanais au mélange za'atar (thym sauvage, sumac, sésame) et huile d'olive.",
    story: "Petit-déjeuner ou collation typique du Levant. Le za'atar vraiment bon a un thym sauvage des montagnes libanaises (origanum syriacum). Sumac rouge sombre, pas pâle. À NYC : épiceries de Bay Ridge ont le bon. Huile d'olive de qualité non négociable.",
    validator: { name: "Rania Haddad", role: "Cuisinière · Tanoreen", city: "Bay Ridge, Brooklyn" },
    category: "pain", allergens: ["gluten", "sésame"],
    ingredients: [
      { name: "Farine T55", qty: 500, unit: "g", tags: ["pantry", "supermarket"] },
      { name: "Levure boulangère sèche", qty: 7, unit: "g", tags: ["pantry", "supermarket"] },
      { name: "Eau tiède", qty: 320, unit: "ml", tags: ["pantry"] },
      { name: "Huile d'olive vierge libanaise", qty: 120, unit: "ml", tags: ["middle-east", "specialty"] },
      { name: "Mélange za'atar libanais", qty: 50, unit: "g", tags: ["middle-east", "specialty"], rare: true, substitutes: ["thym + sumac + sésame + sel mélangés"] },
      { name: "Sucre", qty: 10, unit: "g", tags: ["pantry"] },
      { name: "Sel fin", qty: 8, unit: "g", tags: ["pantry"] }
    ],
    steps: [
      { title: "Pâte", instruction: "Levure + sucre + 100 ml d'eau tiède, 10 min. Farine + sel, ajouter levée + reste eau + 30 ml huile, pétrir 10 min. Pousse 1h.", time: 75 },
      { title: "Garniture za'atar", instruction: "Mélanger za'atar + 90 ml huile d'olive : pâte humide-tartinable.", time: 3 },
      { title: "Façonner", instruction: "Diviser en 4. Étaler en disques 5 mm. Pousse 15 min sur plaque.", time: 18 },
      { title: "Garnir + cuisson", instruction: "Étaler généreusement le za'atar (en laissant 1 cm de bord). Four 220 °C, 8 min : doit être tout juste doré, pas sec.", time: 9 },
      { title: "Service", instruction: "Tiède, plié en deux, avec olives, concombre, tomate, fromage akkawi. Au goûter ou petit-déj." }
    ]
  },

  {
    id: "tabbouleh",
    title: "Tabbouleh libanais",
    origin: { country: "Liban", region: "Mont-Liban", flag: "🇱🇧" },
    auth: 94, duration: 25, servings: 4, difficulty: 1,
    budget: { perPerson: 2.3, level: "$" },
    diets: ["vegan", "vegetarian"], moods: ["healthy", "quick"],
    gradient: "linear-gradient(135deg, #5C8A3A 0%, #F5F7EE 100%)",
    summary: "Salade verte de persil ciselé fin, tomates, menthe, boulgour fin, citron-huile d'olive.",
    story: "Le vrai tabbouleh libanais c'est 80% persil, 20% reste — pas une salade de boulgour. Persil ciselé au couteau (jamais mixeur). Boulgour fin gonflé par les tomates, pas l'eau.",
    validator: { name: "Rania Haddad", role: "Cuisinière · Tanoreen", city: "Bay Ridge, Brooklyn" },
    category: "mezze", allergens: ["gluten"],
    ingredients: [
      { name: "Persil plat (3 grosses bottes)", qty: 250, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Tomates Roma mûres", qty: 4, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Menthe fraîche", qty: 30, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Boulgour fin (#1)", qty: 60, unit: "g", tags: ["middle-east", "pantry"] },
      { name: "Oignons verts", qty: 4, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Citrons jaunes", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Huile d'olive libanaise", qty: 80, unit: "ml", tags: ["middle-east"] },
      { name: "Sel + poivre", qty: 1, unit: "qsp", tags: ["pantry"] }
    ],
    steps: [
      { title: "Boulgour", instruction: "Rincer le boulgour fin, mettre dans un bol. Verser le jus des tomates concassées dessus, laisser 15 min : il gonfle sans cuisson.", time: 18 },
      { title: "Hacher persil", instruction: "Sécher parfaitement les feuilles, hacher au couteau très fin. Mêmes pour la menthe.", time: 10 },
      { title: "Mélange", instruction: "Tomates en très petits dés. Oignons verts ciselés. Tout réunir avec boulgour, persil, menthe.", time: 5 },
      { title: "Assaisonner", instruction: "Sel + poivre + jus de 2 citrons + huile d'olive. Mélanger juste, servir frais." }
    ]
  },

  {
    id: "fattoush",
    title: "Fattoush",
    origin: { country: "Liban", region: "partout", flag: "🇱🇧" },
    auth: 91, duration: 20, servings: 4, difficulty: 1,
    budget: { perPerson: 2.5, level: "$" },
    diets: ["vegan", "vegetarian"], moods: ["healthy", "quick"],
    gradient: "linear-gradient(135deg, #C85A3A 0%, #5C8A3A 100%)",
    summary: "Salade libanaise au pita grillé, sumac, mélasse de grenade, légumes croquants.",
    story: "Salade des restes : pita rassis grillé, légumes du marché, sumac. La mélasse de grenade donne l'aigre-doux signature. Doit être servie immédiatement, pita encore croustillant.",
    validator: { name: "Rania Haddad", role: "Cuisinière · Tanoreen", city: "Bay Ridge, Brooklyn" },
    category: "mezze", allergens: ["gluten", "sésame"],
    ingredients: [
      { name: "Pita rassis", qty: 2, unit: "pièce", tags: ["middle-east", "supermarket"] },
      { name: "Concombres libanais", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Tomates", qty: 4, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Radis", qty: 6, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Oignon rouge", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Salade romaine", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Persil + menthe", qty: 1, unit: "lot", tags: ["produce", "supermarket"] },
      { name: "Mélasse de grenade", qty: 2, unit: "c.s.", tags: ["middle-east", "specialty"], rare: true },
      { name: "Sumac", qty: 1, unit: "c.s.", tags: ["middle-east", "specialty"], rare: true },
      { name: "Huile d'olive", qty: 60, unit: "ml", tags: ["middle-east"] },
      { name: "Citron jaune", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] }
    ],
    steps: [
      { title: "Pita doré", instruction: "Déchirer pita en bouchées. Dorer 4 min four 200 °C avec un peu d'huile.", time: 6 },
      { title: "Légumes", instruction: "Concombres + tomates en gros morceaux, radis tranchés, oignon ciselé fin.", time: 6 },
      { title: "Vinaigrette", instruction: "Mélasse + jus de citron + huile + sumac + sel, fouetter.", time: 2 },
      { title: "Service", instruction: "Mélanger légumes + herbes + pita à la dernière seconde. Verser vinaigrette, sumac dessus." }
    ]
  },

  {
    id: "kibbeh",
    title: "Kibbeh frit (croquettes de bœuf et boulgour)",
    origin: { country: "Liban", region: "Tripoli", flag: "🇱🇧" },
    auth: 88, duration: 90, servings: 6, difficulty: 3,
    budget: { perPerson: 4.0, level: "$" },
    diets: ["dairy-free", "halal-friendly"], moods: ["festive", "wow"],
    gradient: "linear-gradient(135deg, #5C8A3A 0%, #C85A3A 100%)",
    summary: "Croquettes de boulgour + bœuf cru pilé, farcies de viande sautée et pignons, frites.",
    story: "Plat-roi du Levant. Le pilage du boulgour avec la viande crue très froide est un art (jadis au mortier en pierre). Forme classique : ovale pointu (= la signature kibbeh).",
    validator: { name: "Rania Haddad", role: "Cuisinière · Tanoreen", city: "Bay Ridge, Brooklyn" },
    category: "ragoût", allergens: ["gluten", "fruits à coque"],
    ingredients: [
      { name: "Bœuf maigre haché très fin", qty: 600, unit: "g", tags: ["butcher", "middle-east"] },
      { name: "Boulgour fin (#1)", qty: 250, unit: "g", tags: ["middle-east", "pantry"] },
      { name: "Oignon (purée)", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Cumin moulu", qty: 1, unit: "c.s.", tags: ["pantry"] },
      { name: "Cannelle moulue", qty: 1, unit: "c.c.", tags: ["pantry"] },
      { name: "Piment d'Alep", qty: 1, unit: "c.c.", tags: ["middle-east", "spice"], rare: true, substitutes: ["paprika doux + pincée cayenne"] },
      { name: "Farce : bœuf haché", qty: 250, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Oignons (farce)", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Pignons de pin", qty: 50, unit: "g", tags: ["middle-east", "pantry"] },
      { name: "Huile de friture", qty: 1, unit: "L", tags: ["pantry"] }
    ],
    steps: [
      { title: "Boulgour", instruction: "Tremper 15 min, presser à fond.", time: 17 },
      { title: "Pâte", instruction: "Mixer bœuf maigre + boulgour + oignon en purée + épices + sel jusqu'à pâte lisse-collante. Très froide (15 min frigo).", time: 22 },
      { title: "Farce", instruction: "Suer oignons hachés 8 min. Ajouter bœuf, épices, sel, pignons. 5 min, refroidir.", time: 15 },
      { title: "Façonnage", instruction: "Bouler 60 g de pâte. Creuser au pouce, fourrer 1 c.c. farce, refermer en ovale pointu aux extrémités.", time: 20 },
      { title: "Friture", instruction: "Huile à 180 °C, 5 min en retournant : doré-bronze. Servir tiède avec yaourt et menthe." }
    ]
  },

  {
    id: "baba-ghanouj",
    title: "Baba Ghanouj",
    origin: { country: "Liban", region: "partout Levant", flag: "🇱🇧" },
    auth: 90, duration: 50, servings: 6, difficulty: 1,
    budget: { perPerson: 2.0, level: "$" },
    diets: ["vegan", "vegetarian", "dairy-free", "gluten-free"], moods: ["healthy", "quick"],
    gradient: "linear-gradient(135deg, #15211A 0%, #5C8A3A 100%)",
    summary: "Caviar d'aubergine fumé au feu, tahini, citron, ail, grenade.",
    story: "L'aubergine doit être brûlée au feu (gaz, charbon, BBQ) — la fumée est l'âme du plat. Pas de four électrique pour un vrai. Servir tiède, jamais froid.",
    validator: { name: "Rania Haddad", role: "Cuisinière · Tanoreen", city: "Bay Ridge, Brooklyn" },
    category: "mezze", allergens: ["sésame"],
    ingredients: [
      { name: "Aubergines (les plus mûres possibles)", qty: 1500, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Tahini", qty: 100, unit: "g", tags: ["middle-east", "specialty"], rare: true },
      { name: "Ail", qty: 2, unit: "gousses", tags: ["produce", "supermarket"] },
      { name: "Citrons jaunes", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Huile d'olive vierge", qty: 60, unit: "ml", tags: ["middle-east"] },
      { name: "Grenade (graines)", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Persil plat", qty: 0.5, unit: "botte", tags: ["produce", "supermarket"] }
    ],
    steps: [
      { title: "Brûler aubergines", instruction: "Sur la flamme directe (gaz) ou braises, retourner souvent jusqu'à peau noire-craquelée et chair effondrée, 25 min.", time: 27 },
      { title: "Égoutter", instruction: "Repos 10 min couvert. Retirer la peau, déposer la chair dans une passoire, 15 min pour évacuer le jus.", time: 25 },
      { title: "Mixer", instruction: "Hacher au couteau (texture rustique) ou mixer brièvement. Mélanger ail râpé + jus de citron + tahini + sel.", time: 8 },
      { title: "Service", instruction: "Étaler dans une assiette creuse, creuser le centre, huile d'olive, grenade, persil. Pita à côté." }
    ]
  },

  // ── ISRAËL / PALESTINE ────────────────────────────────
  {
    id: "falafel",
    title: "Falafel",
    origin: { country: "Israël", region: "Levant", flag: "🇮🇱" },
    auth: 88, duration: 90, servings: 6, difficulty: 2,
    budget: { perPerson: 2.6, level: "$" },
    diets: ["vegan", "vegetarian", "dairy-free"], moods: ["street", "quick"],
    gradient: "linear-gradient(135deg, #5C8A3A 0%, #D9A441 100%)",
    summary: "Boulettes de pois chiches crus pilés, herbes, épices, frites — extérieur croustillant, intérieur vert.",
    story: "Origine débattue (Égypte avec les fèves, Levant avec les pois chiches). La règle d'or : pois chiches CRUS trempés (jamais cuits, sinon ça s'effrite). Mixage grossier-pas-fin pour la texture.",
    validator: { name: "Rania Haddad", role: "Cuisinière · Tanoreen", city: "Bay Ridge, Brooklyn" },
    category: "mezze", allergens: ["sésame"],
    ingredients: [
      { name: "Pois chiches secs (CRUS)", qty: 300, unit: "g", tags: ["middle-east", "pantry"] },
      { name: "Persil + coriandre fraîche", qty: 100, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Oignon jaune", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Ail", qty: 4, unit: "gousses", tags: ["produce", "supermarket"] },
      { name: "Cumin + coriandre moulus", qty: 2, unit: "c.c.", tags: ["pantry"] },
      { name: "Bicarbonate de soude", qty: 1, unit: "c.c.", tags: ["pantry"] },
      { name: "Graines de sésame (extérieur, optionnel)", qty: 30, unit: "g", tags: ["middle-east", "pantry"] },
      { name: "Huile de friture", qty: 1, unit: "L", tags: ["pantry"] },
      { name: "Sauce tahini (service)", qty: 100, unit: "g", tags: ["middle-east"] }
    ],
    steps: [
      { title: "Tremper", instruction: "Pois chiches 24 h dans 3x leur volume d'eau froide.", time: 1440 },
      { title: "Mixer", instruction: "Égoutter parfaitement. Mixer avec herbes, oignon, ail, cumin, coriandre, sel — texture grossière, pas pâte. Reposer 30 min frigo.", time: 38 },
      { title: "Bicarbonate", instruction: "Juste avant friture, mélanger bicarbonate à la pâte (rend les falafels aérés).", time: 2 },
      { title: "Façonner + frire", instruction: "Boules 30 g (cuiller à mélon idéale), rouler dans sésame. Friture 175 °C, 4 min jusqu'à brun-bronze.", time: 12 }
    ]
  },

  {
    id: "sabich",
    title: "Sabich",
    origin: { country: "Israël", region: "Tel Aviv", flag: "🇮🇱" },
    auth: 86, duration: 35, servings: 4, difficulty: 1,
    budget: { perPerson: 4.5, level: "$" },
    diets: ["vegetarian"], moods: ["street", "quick", "comfort"],
    gradient: "linear-gradient(135deg, #15211A 0%, #D9A441 100%)",
    summary: "Pita garnie d'aubergines frites, œuf dur, hummus, salade israélienne, amba.",
    story: "Petit-déjeuner shabbat des juifs irakiens, devenu street food iconique de Tel Aviv. Combo non négociable : aubergine + œuf + amba (sauce mangue verte fermentée).",
    validator: { name: "Rania Haddad", role: "Cuisinière · Tanoreen", city: "Bay Ridge, Brooklyn" },
    category: "sandwich", allergens: ["gluten", "œufs", "sésame"],
    ingredients: [
      { name: "Pita", qty: 4, unit: "pièce", tags: ["middle-east", "supermarket"] },
      { name: "Aubergines", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Œufs", qty: 4, unit: "pièce", tags: ["supermarket"] },
      { name: "Hummus", qty: 200, unit: "g", tags: ["middle-east", "supermarket"] },
      { name: "Tomates", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Concombres", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Persil", qty: 0.5, unit: "botte", tags: ["produce", "supermarket"] },
      { name: "Sauce amba (mangue verte)", qty: 100, unit: "ml", tags: ["middle-east"], rare: true, substitutes: ["chutney mangue indien"] },
      { name: "Tahini sauce (allongée)", qty: 100, unit: "ml", tags: ["middle-east"] },
      { name: "Huile pour friture", qty: 200, unit: "ml", tags: ["pantry"] }
    ],
    steps: [
      { title: "Œufs durs", instruction: "10 min eau bouillante, glacer.", time: 12 },
      { title: "Aubergines", instruction: "Tranches 1,5 cm. Saler 15 min, éponger. Frire 4 min par face dans huile à 180 °C.", time: 22 },
      { title: "Salade", instruction: "Tomates + concombres en très petits dés + persil ciselé.", time: 5 },
      { title: "Montage", instruction: "Pita ouverte. Hummus, aubergines, œuf en rondelles, salade, traits d'amba et tahini.", time: 5 }
    ]
  },

  // ── TURQUIE ───────────────────────────────────────────
  {
    id: "kofte",
    title: "Köfte (boulettes turques grillées)",
    origin: { country: "Turquie", region: "Istanbul", flag: "🇹🇷" },
    auth: 89, duration: 45, servings: 4, difficulty: 2,
    budget: { perPerson: 5.8, level: "$" },
    diets: ["dairy-free", "halal-friendly"], moods: ["festive", "comfort"],
    gradient: "linear-gradient(135deg, #C85A3A 0%, #15211A 100%)",
    summary: "Boulettes allongées d'agneau, persil, cumin, grillées au charbon, servies avec yaourt.",
    story: "Plat de tous les bayan (boui-bouis) d'Istanbul. Le secret : viande pétrie longuement à la main pour qu'elle prenne une texture liée. Forme allongée pour cuisson rapide à cœur.",
    validator: { name: "Karim Bennani", role: "Chef-propriétaire · Café Mogador", city: "East Village, NY" },
    category: "ragoût", allergens: [],
    ingredients: [
      { name: "Agneau haché 20%", qty: 700, unit: "g", tags: ["butcher", "middle-east"] },
      { name: "Oignon (très fin)", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Ail (gousses, râpé)", qty: 3, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Persil plat", qty: 1, unit: "botte", tags: ["produce", "supermarket"] },
      { name: "Cumin moulu", qty: 1, unit: "c.s.", tags: ["pantry"] },
      { name: "Piment d'Alep", qty: 1, unit: "c.c.", tags: ["middle-east", "spice"], rare: true },
      { name: "Pain de mie (chapelure)", qty: 30, unit: "g", tags: ["pantry"] },
      { name: "Pita pour service", qty: 4, unit: "pièce", tags: ["middle-east"] },
      { name: "Yaourt grec", qty: 200, unit: "g", tags: ["supermarket"] },
      { name: "Sumac", qty: 1, unit: "c.c.", tags: ["middle-east"], rare: true }
    ],
    steps: [
      { title: "Pétrir viande", instruction: "Mélanger viande + oignon râpé + ail + persil ciselé + épices + sel + chapelure. Pétrir 8 min jusqu'à pâte liée.", time: 10 },
      { title: "Reposer", instruction: "30 min au frigo, ferme la pâte.", time: 30 },
      { title: "Façonner", instruction: "Cylindres 8 cm, 2 cm épaisseur, autour de pics ou directement.", time: 6 },
      { title: "Griller", instruction: "Plancha ou braises très chaudes, 3 min par face. Charbonner les bords.", time: 8 },
      { title: "Service", instruction: "Pita chaude, yaourt + sumac, salade tomate-oignon-sumac." }
    ]
  },

  {
    id: "lahmacun",
    title: "Lahmacun (pizza turque)",
    origin: { country: "Turquie", region: "Gaziantep", flag: "🇹🇷" },
    auth: 91, duration: 90, servings: 4, difficulty: 2,
    budget: { perPerson: 4.2, level: "$" },
    diets: ["dairy-free", "halal-friendly"], moods: ["street", "comfort"],
    gradient: "linear-gradient(135deg, #C85A3A 0%, #5C8A3A 100%)",
    summary: "Galette très fine, garniture viande hachée-poivron-tomate, citron, persil, roulée à la main.",
    story: "Spécialité du sud-est anatolien. Garniture mixée très fine pour cuisson éclair (3 min) au four chaud. Toujours servir avec persil, oignon rouge cru, citron — on roule comme un wrap.",
    validator: { name: "Karim Bennani", role: "Chef-propriétaire · Café Mogador", city: "East Village, NY" },
    category: "pain", allergens: ["gluten"],
    ingredients: [
      { name: "Farine T55", qty: 400, unit: "g", tags: ["pantry"] },
      { name: "Levure boulangère", qty: 7, unit: "g", tags: ["pantry"] },
      { name: "Eau tiède", qty: 250, unit: "ml", tags: ["pantry"] },
      { name: "Agneau haché", qty: 300, unit: "g", tags: ["butcher", "middle-east"] },
      { name: "Poivron rouge", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Tomate mûre", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Concentré de tomate", qty: 1, unit: "c.s.", tags: ["pantry"] },
      { name: "Concentré de poivron rouge (biber salçası)", qty: 1, unit: "c.s.", tags: ["middle-east"], rare: true },
      { name: "Oignon", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Persil plat", qty: 1, unit: "botte", tags: ["produce", "supermarket"] },
      { name: "Cumin + piment d'Alep", qty: 1, unit: "c.c.", tags: ["middle-east", "spice"] },
      { name: "Citrons (service)", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] }
    ],
    steps: [
      { title: "Pâte", instruction: "Levure + sucre + eau 10 min. Farine + sel + levée + 2 c.s. huile, pétrir 8 min. Pousse 1 h.", time: 70 },
      { title: "Garniture", instruction: "Mixer agneau + poivron + tomates + oignon + concentrés + épices + sel jusqu'à pâte presque liquide.", time: 5 },
      { title: "Étaler", instruction: "Boules 100 g, étaler en disques 2 mm, posés sur papier sulfurisé.", time: 12 },
      { title: "Garnir + cuire", instruction: "Étaler 2 c.s. de garniture en couche fine. Four 250 °C, 6 min : galette doit gondoler, viande cuite.", time: 8 },
      { title: "Service", instruction: "Garnir persil, oignon rouge ciselé, presser citron, rouler en wrap." }
    ]
  },

  // ── IRAN ──────────────────────────────────────────────
  {
    id: "khoresh-fesenjan",
    title: "Khoresh Fesenjan",
    origin: { country: "Iran", region: "Caspienne, Iran", flag: "🇮🇷" },
    auth: 94, duration: 180, servings: 6, difficulty: 2,
    budget: { perPerson: 7.5, level: "$$" },
    diets: ["dairy-free", "halal-friendly"], moods: ["festive", "wow"],
    gradient: "linear-gradient(135deg, #15211A 0%, #C85A3A 100%)",
    summary: "Ragoût persan unique : noix moulues, mélasse de grenade, canard ou poulet, sauce sombre.",
    story: "Plat des fêtes royales perses. La sauce devient brun-foncé profonde après 2 h de mijotage où l'huile des noix se sépare et caramelise. Sucré-acide-umami à la fois. Servi pour Nowruz.",
    validator: { name: "Karim Bennani", role: "Chef-propriétaire · Café Mogador", city: "East Village, NY" },
    category: "ragoût", allergens: ["fruits à coque"],
    ingredients: [
      { name: "Cuisses de canard ou poulet", qty: 1000, unit: "g", tags: ["butcher", "middle-east"] },
      { name: "Cerneaux de noix", qty: 400, unit: "g", tags: ["middle-east", "pantry"] },
      { name: "Mélasse de grenade", qty: 200, unit: "ml", tags: ["middle-east", "specialty"], rare: true },
      { name: "Oignon jaune", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Cannelle moulue", qty: 1, unit: "c.c.", tags: ["pantry"] },
      { name: "Cardamome moulue", qty: 0.5, unit: "c.c.", tags: ["south-asian"] },
      { name: "Curcuma", qty: 1, unit: "c.c.", tags: ["pantry"] },
      { name: "Sucre", qty: 2, unit: "c.s.", tags: ["pantry"] },
      { name: "Huile de tournesol", qty: 4, unit: "c.s.", tags: ["pantry"] },
      { name: "Riz basmati (accompagnement)", qty: 500, unit: "g", tags: ["pantry"] }
    ],
    steps: [
      { title: "Noix", instruction: "Toaster 5 min four 160 °C. Mixer en pâte huileuse fine.", time: 8 },
      { title: "Pâte de noix mijotée", instruction: "Casserole, eau couvrant noix mixées + sucre, frémir 1 h en remuant : couleur brunit, l'huile se sépare.", time: 65 },
      { title: "Saisir viande", instruction: "Dorer cuisses dans cocotte 6 min.", time: 8 },
      { title: "Réunion", instruction: "Oignons en suer 8 min + curcuma. Ajouter pâte de noix + viande + mélasse de grenade + épices + sel. Couvrir d'eau, mijoter 1 h doux.", time: 70 },
      { title: "Goûter", instruction: "Équilibrer : trop acide → sucre, trop sucré → mélasse. Sauce doit être brun-rouge profonde.", time: 5 },
      { title: "Service", instruction: "Servir sur riz basmati à grain long. Garnir pétales de grenade." }
    ]
  }
]);
