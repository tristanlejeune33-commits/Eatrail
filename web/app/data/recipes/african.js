/* eatrail · v1.4 — recipes / african
 * Cuisines couvertes : Éthiopie, Nigeria, Sénégal, Afrique du Sud.
 */

window.EATRAIL_RECIPES = (window.EATRAIL_RECIPES || []).concat([

  // ── ÉTHIOPIE ──────────────────────────────────────────
  {
    id: "doro-wat",
    title: "Doro Wat",
    origin: { country: "Éthiopie", region: "Addis-Abeba", flag: "🇪🇹" },
    auth: 92, duration: 120, servings: 4, difficulty: 2,
    budget: { perPerson: 6.1, level: "$$" },
    diets: ["dairy-free", "halal-friendly"], moods: ["comfort", "festive", "spicy"],
    gradient: "linear-gradient(135deg, #C85A3A 0%, #5C8A3A 100%)",
    summary: "Ragoût épicé de poulet au berbéré et beurre niter kibbeh, servi sur injera.",
    story: "Plat national éthiopien servi pour les grandes occasions. La cuisson lente de 1kg d'oignons est non-négociable — c'est la base umami. Le berbéré, mélange de 15+ épices, doit être torréfié maison ou acheté très frais.",
    validator: { name: "Mulugeta Tessema", role: "Chef · Awash NYC", city: "East Village, NY" },
    category: "ragoût", allergens: ["lait"],
    ingredients: [
      { name: "Cuisses de poulet sans peau", qty: 1000, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Oignons rouges", qty: 1000, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Berbéré (mélange épices éthiopien)", qty: 4, unit: "c.s.", tags: ["african", "specialty"], rare: true, substitutes: ["paprika fumé + cayenne + cardamome + fenugrec + ail moulu"] },
      { name: "Niter kibbeh (beurre clarifié épicé)", qty: 80, unit: "g", tags: ["african", "specialty"], rare: true, substitutes: ["ghee + cardamome + cannelle infusés"] },
      { name: "Ail frais", qty: 8, unit: "gousses", tags: ["produce", "supermarket"] },
      { name: "Gingembre frais", qty: 40, unit: "g", tags: ["produce", "asian"] },
      { name: "Concentré de tomate", qty: 50, unit: "g", tags: ["pantry", "supermarket"] },
      { name: "Œufs durs", qty: 4, unit: "pièce", tags: ["supermarket"] },
      { name: "Vin rouge sec", qty: 100, unit: "ml", tags: ["specialty", "supermarket"] },
      { name: "Injera (pain teff fermenté)", qty: 4, unit: "pièce", tags: ["african", "specialty"], rare: true, substitutes: ["crêpes fines de teff maison"] },
      { name: "Citron jaune", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] }
    ],
    steps: [
      { title: "Mariner poulet", instruction: "Citron + sel sur le poulet, 30 min.", time: 30 },
      { title: "Suer oignons", instruction: "Émincer 1 kg d'oignons. Cuire à sec dans la cocotte 30 min jusqu'à compotés bruns. Ajouter niter kibbeh.", time: 35 },
      { title: "Berbéré", instruction: "Ajouter ail + gingembre râpés, berbéré, concentré de tomate. Cuire 5 min : doit sentir grillé, pas brûlé.", time: 6 },
      { title: "Mijotage", instruction: "Ajouter poulet, vin, eau à hauteur. Couvrir, feu doux 45 min. Sauce doit napper.", time: 45 },
      { title: "Œufs + service", instruction: "Strier les œufs durs, plonger 10 min dans la sauce. Servir sur injera, mains uniquement." }
    ]
  },

  {
    id: "misir-wat",
    title: "Misir Wat (lentilles rouges éthiopiennes)",
    origin: { country: "Éthiopie", region: "Addis-Abeba", flag: "🇪🇹" },
    auth: 93, duration: 60, servings: 4, difficulty: 1,
    budget: { perPerson: 2.8, level: "$" },
    diets: ["vegan", "vegetarian", "dairy-free", "gluten-free"], moods: ["comfort", "spicy", "healthy"],
    gradient: "linear-gradient(135deg, #C85A3A 0%, #D9A441 100%)",
    summary: "Lentilles corail mijotées au berbéré et oignons compotés — version vegan du wat.",
    story: "Plat-base des jeûnes orthodoxes éthiopiens (très fréquents). La même technique que le Doro Wat : oignons longuement compotés + berbéré frais. Servi avec injera et autres wats sur un grand plateau commun.",
    validator: { name: "Mulugeta Tessema", role: "Chef · Awash NYC", city: "East Village, NY" },
    category: "ragoût", allergens: [],
    ingredients: [
      { name: "Lentilles corail", qty: 300, unit: "g", tags: ["pantry", "south-asian"] },
      { name: "Oignons rouges", qty: 600, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Berbéré", qty: 3, unit: "c.s.", tags: ["african", "specialty"], rare: true },
      { name: "Ail frais", qty: 5, unit: "gousses", tags: ["produce", "supermarket"] },
      { name: "Gingembre frais", qty: 25, unit: "g", tags: ["produce", "asian"] },
      { name: "Concentré de tomate", qty: 2, unit: "c.s.", tags: ["pantry"] },
      { name: "Huile végétale", qty: 60, unit: "ml", tags: ["pantry"] },
      { name: "Injera", qty: 4, unit: "pièce", tags: ["african", "specialty"], rare: true }
    ],
    steps: [
      { title: "Oignons à sec", instruction: "Suer oignons hachés à sec 20 min jusqu'à compotés brun-clair. Ajouter huile.", time: 22 },
      { title: "Berbéré", instruction: "Ail-gingembre + concentré tomate + berbéré, 5 min en remuant — doit embaumer.", time: 6 },
      { title: "Lentilles", instruction: "Lentilles rincées + 800 ml eau bouillante + sel. Frémir 25 min jusqu'à fondues. Texture purée-rustique.", time: 27 },
      { title: "Service", instruction: "Sur injera, à manger à la main. Accompagne d'autres wats." }
    ]
  },

  // ── NIGERIA ───────────────────────────────────────────
  {
    id: "jollof-rice",
    title: "Jollof Rice",
    origin: { country: "Nigeria", region: "Lagos", flag: "🇳🇬" },
    auth: 90, duration: 75, servings: 6, difficulty: 2,
    budget: { perPerson: 4.2, level: "$" },
    diets: ["dairy-free", "vegetarian"], moods: ["festive", "comfort"],
    gradient: "linear-gradient(135deg, #C85A3A 0%, #D9A441 100%)",
    summary: "Riz long mijoté dans une base tomate-poivron-piment fumée, plat de fête ouest-africain.",
    story: "Plat-totem disputé entre Nigeria, Ghana, Sénégal — chacun jure que le sien est le vrai. La signature nigériane : la base 'pepper mix' rouge mixée à cru, le 'party rice' avec son fond de cocotte légèrement brûlé (le bottom-pot).",
    validator: { name: "Adaeze Okafor", role: "Chef · Buka", city: "Clinton Hill, Brooklyn" },
    category: "bol", allergens: [],
    ingredients: [
      { name: "Riz long parfumé (basmati ou similaire)", qty: 500, unit: "g", tags: ["pantry", "african", "south-asian"] },
      { name: "Tomates Roma", qty: 6, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Poivrons rouges", qty: 3, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Scotch bonnet (ata rodo)", qty: 2, unit: "pièce", tags: ["african", "caribbean", "produce"], rare: true, substitutes: ["habanero"] },
      { name: "Concentré de tomate", qty: 100, unit: "g", tags: ["pantry", "supermarket"] },
      { name: "Oignon rouge", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Cubes Maggi (bouillon ouest-africain)", qty: 3, unit: "cubes", tags: ["african", "specialty"], rare: true, substitutes: ["bouillon de volaille"] },
      { name: "Curry en poudre", qty: 1, unit: "c.s.", tags: ["pantry", "south-asian"] },
      { name: "Thym séché", qty: 1, unit: "c.s.", tags: ["pantry"] },
      { name: "Feuilles de laurier", qty: 2, unit: "pièce", tags: ["pantry"] },
      { name: "Huile végétale", qty: 100, unit: "ml", tags: ["pantry", "supermarket"] },
      { name: "Bouillon de volaille", qty: 600, unit: "ml", tags: ["pantry", "supermarket"] }
    ],
    steps: [
      { title: "Pepper mix", instruction: "Mixer tomates + poivrons + scotch bonnet + 1 oignon. Réduire à la casserole 20 min jusqu'à pâte épaisse foncée.", time: 25 },
      { title: "Base", instruction: "Faire revenir oignon émincé dans huile, ajouter concentré de tomate, frire 5 min. Ajouter pepper mix, curry, thym, cubes Maggi.", time: 8 },
      { title: "Riz", instruction: "Laver riz jusqu'à eau claire. Ajouter à la base, mélanger. Verser bouillon juste à hauteur, laurier.", time: 5 },
      { title: "Cuisson party rice", instruction: "Couvrir, feu doux 25 min sans soulever. Pour le bottom-pot : feu vif les 3 dernières min.", time: 28 },
      { title: "Repos + service", instruction: "Hors feu, 10 min couvert. Aérer à la fourchette. Servir avec poulet grillé, plantain frit, moin moin." }
    ]
  },

  {
    id: "egusi-soup",
    title: "Egusi Soup",
    origin: { country: "Nigeria", region: "Yoruba/Igbo", flag: "🇳🇬" },
    auth: 92, duration: 90, servings: 6, difficulty: 2,
    budget: { perPerson: 5.0, level: "$" },
    diets: ["dairy-free"], moods: ["comfort", "spicy", "wow"],
    gradient: "linear-gradient(135deg, #2D6940 0%, #C85A3A 100%)",
    summary: "Soupe ouest-africaine épaisse aux graines de melon moulues, épinards, viande, poisson fumé.",
    story: "Plat universel du Nigeria, du Bénin et du Ghana. Les graines d'egusi (cucurbita) moulues s'ouvrent en grumeaux blancs caractéristiques. Servi avec fufu (igname pilée) ou pounded yam à manger à la main.",
    validator: { name: "Adaeze Okafor", role: "Chef · Buka", city: "Clinton Hill, Brooklyn" },
    category: "soupe", allergens: ["poisson"],
    ingredients: [
      { name: "Graines d'egusi moulues", qty: 250, unit: "g", tags: ["african", "specialty"], rare: true, substitutes: ["graines de courge moulues"] },
      { name: "Bœuf en cubes", qty: 400, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Stockfish (poisson séché)", qty: 100, unit: "g", tags: ["african", "fish"], rare: true },
      { name: "Crevettes séchées", qty: 30, unit: "g", tags: ["african", "asian"] },
      { name: "Épinards (ou ugu)", qty: 400, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Tomates", qty: 4, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Scotch bonnet", qty: 2, unit: "pièce", tags: ["african", "produce"], rare: true },
      { name: "Oignon", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Cubes Maggi", qty: 2, unit: "pièce", tags: ["african", "specialty"], rare: true },
      { name: "Huile de palme rouge", qty: 100, unit: "ml", tags: ["african", "specialty"], rare: true, substitutes: ["huile végétale + paprika"] }
    ],
    steps: [
      { title: "Bouillon de bœuf", instruction: "Bœuf + oignon + Maggi + sel, eau à hauteur, 30 min. Réserver bouillon.", time: 32 },
      { title: "Pâte d'egusi", instruction: "Mélanger egusi + un peu d'eau jusqu'à pâte épaisse.", time: 4 },
      { title: "Sauter base", instruction: "Huile palme + tomate-piment-oignon mixés, 10 min jusqu'à réduit.", time: 12 },
      { title: "Ajouter egusi", instruction: "Verser pâte d'egusi en boules dans la sauce, NE PAS REMUER 10 min : forme grumeaux blancs.", time: 12 },
      { title: "Réunir", instruction: "Ajouter bouillon + bœuf + stockfish trempé + crevettes séchées. Mijoter 15 min.", time: 17 },
      { title: "Légumes verts", instruction: "Épinards en lanières, 5 min. Servir avec fufu ou riz." }
    ]
  },

  // ── SÉNÉGAL ──────────────────────────────────────────
  {
    id: "thieboudienne",
    title: "Thiéboudienne",
    origin: { country: "Sénégal", region: "Saint-Louis, Sénégal", flag: "🇸🇳" },
    auth: 95, duration: 150, servings: 6, difficulty: 3,
    budget: { perPerson: 8.0, level: "$$" },
    diets: ["dairy-free", "halal-friendly", "pescatarian"], moods: ["festive", "comfort", "wow"],
    gradient: "linear-gradient(135deg, #D9A441 0%, #C85A3A 60%, #2D6940 100%)",
    summary: "Plat national sénégalais : poisson farci, riz cuit dans le bouillon de tomate, légumes-trésors.",
    story: "Inventé à Saint-Louis au XIXe par Penda Mbaye. Le riz brisé doit être cuit dans le bouillon (pas à part) pour absorber tout le goût. Servi sur grand plateau commun, manger à la main.",
    validator: { name: "Adaeze Okafor", role: "Chef · Buka", city: "Clinton Hill, Brooklyn" },
    category: "bol", allergens: ["poisson"],
    ingredients: [
      { name: "Mérou ou tilapia entier", qty: 1500, unit: "g", tags: ["fish", "specialty"] },
      { name: "Riz brisé (ou jasmin)", qty: 600, unit: "g", tags: ["pantry", "african"] },
      { name: "Concentré de tomate", qty: 150, unit: "g", tags: ["pantry"] },
      { name: "Tomates fraîches", qty: 4, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Manioc, patate douce, carottes, chou, aubergine", qty: 2, unit: "kg", tags: ["produce", "supermarket"] },
      { name: "Oignons jaunes", qty: 3, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Persil + ail (rof)", qty: 1, unit: "lot", tags: ["produce", "supermarket"] },
      { name: "Yet (mollusque fermenté)", qty: 50, unit: "g", tags: ["african", "fish"], rare: true, substitutes: ["sauce poisson"] },
      { name: "Cubes Maggi", qty: 3, unit: "pièce", tags: ["african"], rare: true },
      { name: "Huile végétale", qty: 100, unit: "ml", tags: ["pantry"] },
      { name: "Piment", qty: 2, unit: "pièce", tags: ["produce"] }
    ],
    steps: [
      { title: "Farce rof", instruction: "Mixer persil + ail + piment + sel + Maggi en pâte. Inciser le poisson, fourrer.", time: 8 },
      { title: "Tomate", instruction: "Frire concentré + tomates dans cocotte 10 min, ajouter eau couvrant + Maggi + yet, frémir 15 min.", time: 27 },
      { title: "Légumes + poisson", instruction: "Pocher poisson 8 min. Réserver. Cuire légumes par étapes : manioc-carotte 20 min, autres 12 min. Réserver.", time: 30 },
      { title: "Riz", instruction: "Filtrer le bouillon. Cuire le riz directement dedans, 25 min. Ajouter eau si besoin.", time: 28 },
      { title: "Service", instruction: "Riz au centre du plateau, légumes en couronne, poisson au sommet. Manger à la main." }
    ]
  },

  {
    id: "yassa-poulet",
    title: "Yassa Poulet",
    origin: { country: "Sénégal", region: "Casamance, Sénégal", flag: "🇸🇳" },
    auth: 92, duration: 90, servings: 6, difficulty: 1,
    budget: { perPerson: 5.5, level: "$$" },
    diets: ["dairy-free", "halal-friendly"], moods: ["comfort", "festive"],
    gradient: "linear-gradient(135deg, #D9A441 0%, #5C8A3A 100%)",
    summary: "Poulet mariné citron-moutarde-oignon, mijoté avec une compotée d'oignons confits acidulés.",
    story: "Recette de Casamance (sud Sénégal). Le ratio oignons/viande est inversé : 1 kg d'oignons pour 1 kg de poulet. Le citron + moutarde de Dijon (héritage colonial) attendrissent et parfument.",
    validator: { name: "Adaeze Okafor", role: "Chef · Buka", city: "Clinton Hill, Brooklyn" },
    category: "ragoût", allergens: [],
    ingredients: [
      { name: "Cuisses de poulet entières", qty: 1500, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Oignons jaunes", qty: 1500, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Citrons jaunes (gros)", qty: 4, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Moutarde de Dijon", qty: 3, unit: "c.s.", tags: ["pantry"] },
      { name: "Ail", qty: 6, unit: "gousses", tags: ["produce", "supermarket"] },
      { name: "Cubes Maggi", qty: 2, unit: "pièce", tags: ["african"], rare: true },
      { name: "Piment scotch bonnet", qty: 1, unit: "pièce", tags: ["african"], rare: true },
      { name: "Olives vertes dénoyautées", qty: 100, unit: "g", tags: ["middle-east", "european"] },
      { name: "Huile d'arachide", qty: 80, unit: "ml", tags: ["pantry"] },
      { name: "Riz blanc", qty: 500, unit: "g", tags: ["pantry"] },
      { name: "Feuille de laurier", qty: 2, unit: "pièce", tags: ["pantry"] }
    ],
    steps: [
      { title: "Marinade", instruction: "Émincer oignons. Mixer citrons + moutarde + ail + Maggi. Recouvrir poulet + oignons, 4 h frigo.", time: 240 },
      { title: "Saisir poulet", instruction: "Récupérer poulet de la marinade, dorer 8 min cocotte. Réserver.", time: 10 },
      { title: "Compotée d'oignons", instruction: "Verser oignons + marinade dans la cocotte, suer 25 min jusqu'à fondants-translucides.", time: 27 },
      { title: "Mijoter", instruction: "Remettre poulet + olives + laurier + 200 ml eau. Frémir 35 min couvert.", time: 37 },
      { title: "Service", instruction: "Riz blanc à part. Sauce abondante sur le riz, poulet et oignons confits dessus." }
    ]
  },

  // ── AFRIQUE DU SUD ───────────────────────────────────
  {
    id: "bunny-chow",
    title: "Bunny Chow",
    origin: { country: "Afrique du Sud", region: "Durban, Afrique du Sud", flag: "🇿🇦" },
    auth: 88, duration: 90, servings: 4, difficulty: 2,
    budget: { perPerson: 5.0, level: "$" },
    diets: ["dairy-free", "halal-friendly"], moods: ["street", "comfort", "spicy"],
    gradient: "linear-gradient(135deg, #C85A3A 0%, #15211A 100%)",
    summary: "Demi-pain de mie évidé, rempli de curry d'agneau. Street food indo-sud-africaine.",
    story: "Inventé à Durban par la communauté indo-tamoule au début XXe (transport facile pour les ouvriers). Le pain absorbe la sauce, on mange à la main, pain et garniture jusqu'à la dernière mie. Pas de couverts.",
    validator: { name: "Adaeze Okafor", role: "Chef · Buka", city: "Clinton Hill, Brooklyn" },
    category: "sandwich", allergens: ["gluten"],
    ingredients: [
      { name: "Pain de mie blanc carré (loaf)", qty: 2, unit: "pièce", tags: ["pantry", "supermarket"] },
      { name: "Épaule d'agneau en cubes 3 cm", qty: 700, unit: "g", tags: ["butcher", "south-asian"] },
      { name: "Tomates concassées", qty: 400, unit: "g", tags: ["pantry"] },
      { name: "Oignons jaunes", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Pommes de terre", qty: 300, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Pâte gingembre-ail", qty: 2, unit: "c.s.", tags: ["south-asian"] },
      { name: "Curry de Durban (ou madras)", qty: 3, unit: "c.s.", tags: ["south-asian", "specialty"], rare: true },
      { name: "Cardamome + cannelle + clous de girofle", qty: 1, unit: "lot", tags: ["spice"] },
      { name: "Yaourt nature", qty: 100, unit: "g", tags: ["supermarket"] },
      { name: "Coriandre fraîche", qty: 1, unit: "botte", tags: ["produce"] },
      { name: "Carotte rapée + sambals (service)", qty: 1, unit: "lot", tags: ["produce"] }
    ],
    steps: [
      { title: "Saisir agneau", instruction: "Dorer agneau dans cocotte, 8 min. Réserver.", time: 10 },
      { title: "Curry base", instruction: "Oignons 6 min + ail-gingembre + épices entières + curry powder, 2 min.", time: 9 },
      { title: "Mijoter", instruction: "Tomates + agneau + 300 ml eau, frémir 50 min.", time: 52 },
      { title: "Pommes de terre", instruction: "Ajouter pommes de terre 25 min avant la fin.", time: 25 },
      { title: "Évider pains", instruction: "Couper chaque pain en 2. Évider la mie en gardant 2 cm de paroi (mie servira à éponger).", time: 5 },
      { title: "Service", instruction: "Remplir chaque demi-pain de curry. Coriandre, yaourt, carotte sambal. Manger à la main, mie en bouchon." }
    ]
  }
]);
