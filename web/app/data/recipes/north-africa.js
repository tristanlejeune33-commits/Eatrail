/* eatrail · v1.4 — recipes / north-africa
 * Cuisines couvertes : Maroc, Tunisie, Égypte.
 */

window.EATRAIL_RECIPES = (window.EATRAIL_RECIPES || []).concat([

  // ── MAROC ─────────────────────────────────────────────
  {
    id: "tagine-poulet-citron",
    title: "Tagine poulet citron confit",
    origin: { country: "Maroc", region: "Fès", flag: "🇲🇦" },
    auth: 89, duration: 80, servings: 4, difficulty: 2,
    budget: { perPerson: 7.2, level: "$$" },
    diets: ["dairy-free", "halal-friendly"], moods: ["comfort", "festive"],
    gradient: "linear-gradient(135deg, #5C8A3A 0%, #C85A3A 100%)",
    summary: "Cuisses de poulet mijotées avec citrons confits, olives vertes et ras-el-hanout.",
    story: "Plat dominical fassi par excellence. Le citron confit (msayer) doit avoir au moins 6 mois — c'est la signature. À NYC, Kalustyan's tient le bon. Sans tagine en argile, une cocotte en fonte fait l'affaire.",
    validator: { name: "Karim Bennani", role: "Chef-propriétaire · Café Mogador", city: "East Village, NY" },
    category: "ragoût", allergens: [],
    ingredients: [
      { name: "Cuisses de poulet avec peau", qty: 6, unit: "pièce", tags: ["butcher", "supermarket"] },
      { name: "Citrons confits au sel", qty: 2, unit: "pièce", tags: ["middle-east", "north-africa"], rare: true, substitutes: ["citrons frais + sel (texture différente)"] },
      { name: "Olives vertes dénoyautées (picholine)", qty: 150, unit: "g", tags: ["middle-east", "european"] },
      { name: "Coriandre fraîche", qty: 1, unit: "botte", tags: ["produce", "supermarket"] },
      { name: "Persil plat", qty: 1, unit: "botte", tags: ["produce", "supermarket"] },
      { name: "Ras-el-hanout", qty: 2, unit: "c.s.", tags: ["middle-east", "north-africa", "pantry"], rare: true, substitutes: ["mélange maison : cumin, coriandre, gingembre, cannelle, paprika, poivre"] },
      { name: "Safran iranien", qty: 1, unit: "pincée", tags: ["middle-east", "spice"], rare: true },
      { name: "Gingembre frais", qty: 20, unit: "g", tags: ["produce", "asian"] },
      { name: "Oignon jaune", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Huile d'olive vierge", qty: 4, unit: "c.s.", tags: ["pantry", "supermarket"] }
    ],
    steps: [
      { title: "Marinade éclair", instruction: "Mixer ail, gingembre, ras-el-hanout, safran, huile, jus de citron. Enrober le poulet 20 min.", time: 25 },
      { title: "Saisir", instruction: "Dorer les cuisses peau dessous 6 min dans la cocotte chaude. Réserver.", time: 8 },
      { title: "Base aromatique", instruction: "Suer oignons en lamelles 8 min. Remettre poulet, ajouter eau à mi-hauteur, citrons confits en quartiers, herbes ficelées.", time: 10 },
      { title: "Mijotage", instruction: "Couvrir, feu doux, 45 min. À mi-cuisson ajouter olives. Sauce doit nourrir, pas bouillir.", time: 45 },
      { title: "Service", instruction: "Parsemer herbes hachées. Accompagner de pain ksra ou semoule fine roulée à la main." }
    ]
  },

  {
    id: "couscous-royal",
    title: "Couscous royal (sept légumes)",
    origin: { country: "Maroc", region: "Marrakech", flag: "🇲🇦" },
    auth: 92, duration: 180, servings: 8, difficulty: 2,
    budget: { perPerson: 8.5, level: "$$" },
    diets: ["dairy-free", "halal-friendly"], moods: ["festive", "wow"],
    gradient: "linear-gradient(135deg, #D9A441 0%, #C85A3A 100%)",
    summary: "Semoule roulée à la vapeur, bouillon parfumé, agneau + merguez + poulet, 7 légumes, harissa.",
    story: "Plat du vendredi midi. Semoule cuite trois fois à la vapeur (la vraie technique), entre deux passages on aère à la main avec huile + eau de fleur d'oranger. Le bouillon doit être doré-orangé, parfumé safran + ras-el-hanout.",
    validator: { name: "Karim Bennani", role: "Chef-propriétaire · Café Mogador", city: "East Village, NY" },
    category: "bol", allergens: ["gluten"],
    ingredients: [
      { name: "Semoule moyenne", qty: 600, unit: "g", tags: ["middle-east", "north-africa", "pantry"] },
      { name: "Épaule d'agneau en cubes", qty: 800, unit: "g", tags: ["butcher", "middle-east"] },
      { name: "Cuisses de poulet", qty: 4, unit: "pièce", tags: ["butcher", "supermarket"] },
      { name: "Merguez", qty: 8, unit: "pièce", tags: ["butcher", "middle-east"] },
      { name: "Pois chiches secs", qty: 200, unit: "g", tags: ["middle-east", "pantry"] },
      { name: "Carottes", qty: 4, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Navets", qty: 3, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Courgettes", qty: 3, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Aubergine", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Citrouille (potimarron)", qty: 400, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Concentré de tomate", qty: 100, unit: "g", tags: ["pantry"] },
      { name: "Ras-el-hanout", qty: 3, unit: "c.s.", tags: ["middle-east", "north-africa"], rare: true },
      { name: "Safran", qty: 1, unit: "pincée", tags: ["middle-east", "spice"], rare: true },
      { name: "Beurre clarifié (smen)", qty: 100, unit: "g", tags: ["middle-east"], rare: true, substitutes: ["beurre nature"] },
      { name: "Harissa", qty: 60, unit: "g", tags: ["middle-east", "north-africa"], rare: true }
    ],
    steps: [
      { title: "Tremper pois chiches", instruction: "8 h ou la veille.", time: 480 },
      { title: "Bouillon", instruction: "Cocotte du couscoussier : agneau + poulet doré, oignons, ras-el-hanout, safran, concentré, eau couvrant + 5 cm. 1 h.", time: 65 },
      { title: "Légumes par étapes", instruction: "Ajouter selon temps de cuisson : carottes/navets 25 min, courgettes/aubergine 15 min, citrouille 10 min.", time: 25 },
      { title: "Semoule trois passages", instruction: "Hydrater semoule + huile + sel. Vapeur 15 min. Aérer + 100 ml eau. Vapeur 15 min. Beurre clarifié + aérer. Vapeur 15 min.", time: 50 },
      { title: "Merguez", instruction: "Griller à part, ajouter au plat de service.", time: 8 },
      { title: "Service", instruction: "Semoule en dôme, légumes + viandes au sommet, bouillon en saucière, harissa diluée à part." }
    ]
  },

  {
    id: "pastilla-pigeon",
    title: "Pastilla au pigeon (ou poulet)",
    origin: { country: "Maroc", region: "Fès", flag: "🇲🇦" },
    auth: 93, duration: 180, servings: 8, difficulty: 3,
    budget: { perPerson: 7.0, level: "$$" },
    diets: ["halal-friendly"], moods: ["festive", "wow"],
    gradient: "linear-gradient(135deg, #D9A441 0%, #15211A 100%)",
    summary: "Tourte feuilletée sucrée-salée : pigeon mijoté, œufs, amandes, cannelle, sucre glace.",
    story: "Plat-trésor des grandes occasions fassies. Sucré-salé andalou (héritage al-Andalus). Le contraste sucre glace + cannelle dessus + viande dedans est la signature absolue. Feuilles de warqa traditionnelles, à défaut feuilles brick fines.",
    validator: { name: "Karim Bennani", role: "Chef-propriétaire · Café Mogador", city: "East Village, NY" },
    category: "ragoût", allergens: ["gluten", "œufs", "fruits à coque"],
    ingredients: [
      { name: "Pigeons (ou cuisses de poulet)", qty: 4, unit: "pièce", tags: ["butcher", "middle-east"] },
      { name: "Feuilles de brick (warqa)", qty: 12, unit: "pièce", tags: ["middle-east"], rare: true },
      { name: "Oignons jaunes", qty: 3, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Œufs", qty: 6, unit: "pièce", tags: ["supermarket"] },
      { name: "Amandes émondées", qty: 200, unit: "g", tags: ["middle-east", "pantry"] },
      { name: "Cannelle moulue + bâton", qty: 1, unit: "lot", tags: ["pantry"] },
      { name: "Safran", qty: 1, unit: "pincée", tags: ["middle-east", "spice"], rare: true },
      { name: "Gingembre moulu", qty: 1, unit: "c.c.", tags: ["pantry"] },
      { name: "Eau de fleur d'oranger", qty: 2, unit: "c.s.", tags: ["middle-east"], rare: true },
      { name: "Beurre clarifié", qty: 150, unit: "g", tags: ["middle-east"] },
      { name: "Sucre glace", qty: 60, unit: "g", tags: ["pantry"] },
      { name: "Coriandre + persil", qty: 1, unit: "lot", tags: ["produce"] }
    ],
    steps: [
      { title: "Mijoter pigeon", instruction: "Pigeon + oignons + safran + cannelle bâton + gingembre + eau couvrant. 1h jusqu'à très tendre. Réserver bouillon.", time: 65 },
      { title: "Effilocher", instruction: "Désosser pigeon, effilocher la chair grossier.", time: 12 },
      { title: "Œufs brouillés à la sauce", instruction: "Réduire bouillon à 200 ml. Battre œufs, verser dans bouillon, brouiller doux jusqu'à crémeux.", time: 12 },
      { title: "Amandes", instruction: "Frire amandes dans beurre clarifié, sucre, cannelle. Concasser grossier.", time: 8 },
      { title: "Montage", instruction: "Beurrer moule. Disposer 6 feuilles de brick en éventail. Couches : œufs, viande, amandes. Refermer feuilles, ajouter 4 feuilles dessus en spirale.", time: 18 },
      { title: "Cuisson + déco", instruction: "Four 200 °C, 25 min jusqu'à doré. Saupoudrer abondamment sucre glace + cannelle en motif géométrique.", time: 28 }
    ]
  },

  {
    id: "harira",
    title: "Harira",
    origin: { country: "Maroc", region: "partout", flag: "🇲🇦" },
    auth: 90, duration: 90, servings: 6, difficulty: 1,
    budget: { perPerson: 3.0, level: "$" },
    diets: ["dairy-free", "halal-friendly"], moods: ["comfort", "healthy"],
    gradient: "linear-gradient(135deg, #C85A3A 0%, #5C8A3A 100%)",
    summary: "Soupe-repas du Ramadan : pois chiches, lentilles, agneau, tomate, herbes, vermicelles.",
    story: "Soupe de rupture du jeûne. Doit être épaisse-onctueuse — la liaison se fait à la tadouira (mélange farine-eau). Servie avec dattes et chebakia (gâteaux au miel).",
    validator: { name: "Karim Bennani", role: "Chef-propriétaire · Café Mogador", city: "East Village, NY" },
    category: "soupe", allergens: ["gluten"],
    ingredients: [
      { name: "Agneau en petits cubes", qty: 300, unit: "g", tags: ["butcher", "middle-east"] },
      { name: "Pois chiches secs", qty: 150, unit: "g", tags: ["middle-east", "pantry"] },
      { name: "Lentilles vertes", qty: 100, unit: "g", tags: ["pantry"] },
      { name: "Tomates concassées", qty: 800, unit: "g", tags: ["pantry", "supermarket"] },
      { name: "Concentré de tomate", qty: 2, unit: "c.s.", tags: ["pantry"] },
      { name: "Oignon jaune", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Céleri branche", qty: 3, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Coriandre + persil hachés", qty: 1, unit: "lot", tags: ["produce", "supermarket"] },
      { name: "Cumin + curcuma + cannelle + gingembre + poivre", qty: 1, unit: "lot", tags: ["pantry"] },
      { name: "Vermicelles fins", qty: 80, unit: "g", tags: ["pantry"] },
      { name: "Farine T55 (tadouira)", qty: 60, unit: "g", tags: ["pantry"] },
      { name: "Citron jaune (service)", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Dattes (accompagnement)", qty: 200, unit: "g", tags: ["middle-east"] }
    ],
    steps: [
      { title: "Tremper pois chiches", instruction: "8 h ou la veille.", time: 480 },
      { title: "Démarrer", instruction: "Cocotte : huile + agneau + oignons + céleri + épices + concentré. Suer 8 min.", time: 10 },
      { title: "Mijoter", instruction: "Tomates + pois chiches + lentilles + 2L eau, herbes ficelées. Frémir 1 h.", time: 65 },
      { title: "Vermicelles", instruction: "Ajouter vermicelles 10 min avant la fin.", time: 10 },
      { title: "Tadouira", instruction: "Délayer farine dans 250 ml d'eau froide. Verser en filet en remuant : la soupe lie-épaissit, 5 min.", time: 7 },
      { title: "Service", instruction: "Bols, herbes fraîches, citron pressé, dattes à côté." }
    ]
  },

  // ── TUNISIE ───────────────────────────────────────────
  {
    id: "shakshuka",
    title: "Shakshuka",
    origin: { country: "Tunisie / Israël", region: "Maghreb-Levant", flag: "🇹🇳" },
    auth: 87, duration: 35, servings: 4, difficulty: 1,
    budget: { perPerson: 3.2, level: "$" },
    diets: ["vegetarian", "halal-friendly"], moods: ["quick", "comfort", "healthy"],
    gradient: "linear-gradient(135deg, #C85A3A 0%, #D9A441 100%)",
    summary: "Œufs pochés dans une sauce tomate-poivron parfumée au cumin et harissa.",
    story: "Plat berbère tunisien adopté par toute la Méditerranée orientale. Le mot vient de l'arabe « secouer ». Servir au centre de la table, dans la poêle, avec pain pour saucer. Variation : ajouter feta émiettée, merguez, ou épinards.",
    validator: { name: "Yael Cohen", role: "Cheffe · Miznon", city: "Chelsea, NY" },
    category: "brunch", allergens: ["œufs", "gluten", "lait"],
    ingredients: [
      { name: "Poivrons rouges", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Tomates Roma mûres", qty: 8, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Œufs", qty: 6, unit: "pièce", tags: ["supermarket"] },
      { name: "Oignon jaune", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Ail", qty: 4, unit: "gousses", tags: ["produce", "supermarket"] },
      { name: "Harissa tunisienne", qty: 1, unit: "c.s.", tags: ["middle-east", "north-africa"], rare: true, substitutes: ["sambal + pincée cumin"] },
      { name: "Cumin moulu", qty: 2, unit: "c.c.", tags: ["pantry", "middle-east"] },
      { name: "Paprika fumé", qty: 1, unit: "c.c.", tags: ["pantry", "european"] },
      { name: "Coriandre fraîche", qty: 1, unit: "botte", tags: ["produce", "supermarket"] },
      { name: "Feta (optionnel)", qty: 100, unit: "g", tags: ["middle-east", "european", "supermarket"] },
      { name: "Huile d'olive", qty: 4, unit: "c.s.", tags: ["pantry", "supermarket"] },
      { name: "Pain pita", qty: 4, unit: "pièce", tags: ["middle-east"] }
    ],
    steps: [
      { title: "Base poivrons", instruction: "Émincer oignons et poivrons. Suer 10 min dans l'huile.", time: 10 },
      { title: "Épices", instruction: "Ajouter ail, cumin, paprika, harissa. 1 min.", time: 2 },
      { title: "Tomates", instruction: "Tomates concassées, mijoter 12 min jusqu'à sauce épaisse.", time: 12 },
      { title: "Œufs", instruction: "Creuser 6 puits dans la sauce. Casser un œuf dans chaque. Couvrir, 5-7 min : blanc pris, jaune coulant.", time: 7 },
      { title: "Service", instruction: "Coriandre, feta émiettée. Dans la poêle, au centre de la table, avec pita." }
    ]
  },

  {
    id: "brik-oeuf",
    title: "Brik à l'œuf",
    origin: { country: "Tunisie", region: "Tunis", flag: "🇹🇳" },
    auth: 89, duration: 25, servings: 4, difficulty: 2,
    budget: { perPerson: 3.5, level: "$" },
    diets: ["pescatarian", "halal-friendly"], moods: ["quick", "street", "wow"],
    gradient: "linear-gradient(135deg, #D9A441 0%, #C85A3A 100%)",
    summary: "Feuille de brick croustillante pliée en triangle, garniture thon-câpres-persil-œuf coulant.",
    story: "Spécialité tunisienne, héritage ottoman. Le défi : l'œuf doit rester coulant à l'intérieur après friture. On le casse à la dernière seconde sur la garniture, plie vite, frit immédiatement.",
    validator: { name: "Yael Cohen", role: "Cheffe · Miznon", city: "Chelsea, NY" },
    category: "ragoût", allergens: ["gluten", "œufs", "poisson"],
    ingredients: [
      { name: "Feuilles de brick", qty: 4, unit: "pièce", tags: ["middle-east"], rare: true, substitutes: ["pâte filo (texture moins exacte)"] },
      { name: "Œufs frais", qty: 4, unit: "pièce", tags: ["supermarket"] },
      { name: "Thon en boîte (huile)", qty: 200, unit: "g", tags: ["pantry"] },
      { name: "Pommes de terre cuites", qty: 200, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Câpres", qty: 2, unit: "c.s.", tags: ["pantry"] },
      { name: "Persil plat", qty: 0.5, unit: "botte", tags: ["produce", "supermarket"] },
      { name: "Oignon jaune", qty: 0.5, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Harissa", qty: 1, unit: "c.c.", tags: ["middle-east", "north-africa"], rare: true },
      { name: "Citron (service)", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Huile pour friture", qty: 500, unit: "ml", tags: ["pantry"] }
    ],
    steps: [
      { title: "Garniture", instruction: "Écraser pommes de terre + thon égoutté + câpres + persil + oignon ciselé + harissa + sel. Texture grossière.", time: 8 },
      { title: "Pliage", instruction: "Feuille de brick à plat. 3 c.s. garniture au centre, creuser puits, casser œuf dedans, plier en triangle (rabattre les coins).", time: 6 },
      { title: "Friture", instruction: "Huile à 180 °C. Glisser le brik DOUCEMENT, 90 sec par face. Doit être bronze-doré.", time: 4 },
      { title: "Service", instruction: "Égoutter sur papier. Citron pressé. Manger TRÈS chaud, l'œuf doit couler à la première bouchée." }
    ]
  },

  // ── ÉGYPTE ────────────────────────────────────────────
  {
    id: "koshari",
    title: "Koshari (street food du Caire)",
    origin: { country: "Égypte", region: "Le Caire", flag: "🇪🇬" },
    auth: 91, duration: 60, servings: 6, difficulty: 2,
    budget: { perPerson: 2.5, level: "$" },
    diets: ["vegan", "vegetarian", "dairy-free"], moods: ["comfort", "street"],
    gradient: "linear-gradient(135deg, #C85A3A 0%, #D9A441 100%)",
    summary: "Empilement riz + lentilles + macaronis + pois chiches, sauce tomate-vinaigre, oignons frits.",
    story: "Plat-roi de la rue cairote. Apparu fin XIXe avec l'arrivée des pâtes italiennes. Empilement non négociable : amidon dessous, sauces dessus. Vinaigre ajouté à table — étonne mais essentiel.",
    validator: { name: "Karim Bennani", role: "Chef-propriétaire · Café Mogador", city: "East Village, NY" },
    category: "bol", allergens: ["gluten"],
    ingredients: [
      { name: "Riz à grain long", qty: 250, unit: "g", tags: ["pantry"] },
      { name: "Lentilles brunes", qty: 200, unit: "g", tags: ["pantry"] },
      { name: "Macaronis ditalini", qty: 200, unit: "g", tags: ["pantry"] },
      { name: "Vermicelles", qty: 80, unit: "g", tags: ["pantry"] },
      { name: "Pois chiches en boîte", qty: 400, unit: "g", tags: ["pantry"] },
      { name: "Oignons jaunes", qty: 4, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Tomates concassées", qty: 800, unit: "g", tags: ["pantry"] },
      { name: "Ail", qty: 6, unit: "gousses", tags: ["produce", "supermarket"] },
      { name: "Vinaigre blanc", qty: 60, unit: "ml", tags: ["pantry"] },
      { name: "Cumin + coriandre + cayenne", qty: 1, unit: "lot", tags: ["pantry"] },
      { name: "Huile végétale", qty: 200, unit: "ml", tags: ["pantry"] }
    ],
    steps: [
      { title: "Lentilles", instruction: "Cuire 25 min eau salée jusqu'à tendres mais entières.", time: 25 },
      { title: "Riz aux vermicelles", instruction: "Toaster vermicelles dans huile jusqu'à dorés. Ajouter riz, eau (1:1.5), sel. Cuisson absorption 18 min.", time: 22 },
      { title: "Pâtes", instruction: "Cuire al dente eau salée.", time: 8 },
      { title: "Sauce tomate", instruction: "Ail dans huile + cumin + coriandre + cayenne 30 sec. Tomates + sel + 2 c.s. vinaigre, mijoter 15 min.", time: 17 },
      { title: "Oignons frits", instruction: "Frire oignons en lamelles très fines jusqu'à brun-doré croustillant, 12 min. Égoutter.", time: 14 },
      { title: "Montage", instruction: "Bol : riz dessous, lentilles, pâtes, pois chiches, sauce tomate, oignons frits dessus. Vinaigre + sauce piquante à côté." }
    ]
  }
]);
