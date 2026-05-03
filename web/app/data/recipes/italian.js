/* eatrail · v1.5 — recipes / italian (25) */
window.EATRAIL_RECIPES = (window.EATRAIL_RECIPES || []).concat([
  { id: "carbonara", title: "Spaghetti alla Carbonara", origin: { country: "Italie", region: "Rome", flag: "🇮🇹" }, auth: 95, duration: 25, servings: 4, difficulty: 2, budget: { perPerson: 7.0, level: "$$" }, diets: [], moods: ["quick", "comfort"], gradient: "linear-gradient(135deg, #D9A441 0%, #F5F7EE 100%)", summary: "Spaghetti, guanciale, jaunes d'œufs, pecorino, poivre noir. Aucune crème.", story: "Quattro ingredienti, basta. Pas de crème, pas d'oignon, pas d'ail. Émulsionner les jaunes hors feu avec l'eau de cuisson.", validator: { name: "Mariella Conte", role: "Cheffe · Don Angie", city: "West Village, NY" }, category: "nouilles", allergens: ["gluten", "œufs", "lait"],
    ingredients: [
      { name: "Spaghetti bronze cut", qty: 400, unit: "g", tags: ["pantry", "european"] },
      { name: "Guanciale", qty: 200, unit: "g", tags: ["italian", "european", "specialty"], rare: true, substitutes: ["pancetta"] },
      { name: "Pecorino romano DOP", qty: 100, unit: "g", tags: ["italian", "european", "specialty"], rare: true },
      { name: "Jaunes d'œuf", qty: 4, unit: "pièce", tags: ["supermarket"] },
      { name: "Œuf entier", qty: 1, unit: "pièce", tags: ["supermarket"] },
      { name: "Poivre noir en grains", qty: 2, unit: "c.c.", tags: ["pantry"] }
    ],
    steps: [
      { title: "Eau salée", instruction: "4L eau + sel, bouillir.", time: 8 },
      { title: "Guanciale", instruction: "Cubes 5 mm, poêler à sec 8 min jusqu'à croustillant.", time: 10 },
      { title: "Émulsion", instruction: "Bol : jaunes + œuf + pecorino + poivre + 2 c.s. eau de cuisson.", time: 4 },
      { title: "Pâtes + mélange", instruction: "HORS FEU : pâtes égouttées sur guanciale, verser émulsion en remuant vif.", time: 5 }
    ]
  },
  { id: "ragu-bolognese", title: "Tagliatelle al Ragù alla Bolognese", origin: { country: "Italie", region: "Bologne", flag: "🇮🇹" }, auth: 96, duration: 240, servings: 6, difficulty: 2, budget: { perPerson: 6.5, level: "$$" }, diets: [], moods: ["comfort", "festive"], gradient: "linear-gradient(135deg, #C85A3A 0%, #15211A 100%)", summary: "Le vrai ragù bolognais : viandes mijotées 3h, lait, vin blanc, soffritto.", story: "Recette officiellement déposée à Bologne en 1982. PAS de spaghetti. Lait obligatoire (attendrit), tomate en concentré seulement.", validator: { name: "Mariella Conte", role: "Cheffe · Don Angie", city: "West Village, NY" }, category: "nouilles", allergens: ["gluten", "lait"],
    ingredients: [
      { name: "Tagliatelle fraîches aux œufs", qty: 600, unit: "g", tags: ["italian", "european"], rare: true },
      { name: "Bœuf haché 15%", qty: 400, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Veau haché", qty: 200, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Pancetta non fumée", qty: 80, unit: "g", tags: ["italian", "european"] },
      { name: "Soffritto (carotte + céleri + oignon)", qty: 1, unit: "lot", tags: ["produce", "supermarket"] },
      { name: "Lait entier", qty: 250, unit: "ml", tags: ["supermarket"] },
      { name: "Vin blanc sec", qty: 200, unit: "ml", tags: ["specialty", "supermarket"] },
      { name: "Concentré de tomate", qty: 2, unit: "c.s.", tags: ["pantry"] },
      { name: "Bouillon de bœuf", qty: 500, unit: "ml", tags: ["pantry"] },
      { name: "Parmigiano Reggiano", qty: 100, unit: "g", tags: ["italian", "european"], rare: true }
    ],
    steps: [
      { title: "Soffritto", instruction: "Suer battuto 12 min huile + beurre.", time: 14 },
      { title: "Viandes", instruction: "Pancetta + bœuf + veau, dorer 10 min.", time: 12 },
      { title: "Vin + tomate + lait", instruction: "Vin réduit, concentré, lait, mijoter 30 min.", time: 35 },
      { title: "Long mijotage", instruction: "Bouillon par étapes, 2h30 doux. Sauce brune-épaisse.", time: 150 },
      { title: "Service", instruction: "Tagliatelle 3 min eau salée, mélanger au ragù, parmigiano.", time: 5 }
    ]
  },
  { id: "risotto-milanese", title: "Risotto alla Milanese", origin: { country: "Italie", region: "Milan", flag: "🇮🇹" }, auth: 93, duration: 35, servings: 4, difficulty: 2, budget: { perPerson: 6.0, level: "$$" }, diets: ["vegetarian"], moods: ["comfort", "festive"], gradient: "linear-gradient(135deg, #D9A441 0%, #F5F7EE 100%)", summary: "Risotto au safran et moelle de bœuf, signature dorée milanaise.", story: "Riz Carnaroli ou Vialone Nano. Mantecatura beurre + parmesan = la finale onctueuse.", validator: { name: "Mariella Conte", role: "Cheffe · Don Angie", city: "West Village, NY" }, category: "bol", allergens: ["lait"],
    ingredients: [
      { name: "Riz Carnaroli", qty: 320, unit: "g", tags: ["italian", "european"], rare: true },
      { name: "Bouillon de bœuf", qty: 1.2, unit: "L", tags: ["pantry"] },
      { name: "Safran", qty: 1, unit: "pincée", tags: ["spice"], rare: true },
      { name: "Moelle de bœuf", qty: 60, unit: "g", tags: ["butcher", "specialty"] },
      { name: "Échalote", qty: 1, unit: "pièce", tags: ["produce"] },
      { name: "Vin blanc", qty: 100, unit: "ml", tags: ["specialty"] },
      { name: "Beurre froid", qty: 80, unit: "g", tags: ["supermarket"] },
      { name: "Parmigiano Reggiano", qty: 80, unit: "g", tags: ["italian", "european"], rare: true }
    ],
    steps: [
      { title: "Bouillon safran", instruction: "Diluer safran dans 100 ml bouillon chaud.", time: 5 },
      { title: "Soffritto", instruction: "Moelle + 30g beurre, échalote 4 min.", time: 5 },
      { title: "Toaster riz", instruction: "Riz 2 min, vin évaporé.", time: 5 },
      { title: "Bouillon louche", instruction: "Louche par louche en remuant 18 min. Verser bouillon safran à mi-cuisson.", time: 20 },
      { title: "Mantecatura", instruction: "Hors feu : beurre froid + parmesan, battre 1 min.", time: 2 }
    ]
  },
  { id: "pizza-margherita", title: "Pizza Margherita", origin: { country: "Italie", region: "Naples", flag: "🇮🇹" }, auth: 94, duration: 1500, servings: 4, difficulty: 2, budget: { perPerson: 4.5, level: "$" }, diets: ["vegetarian"], moods: ["wow", "comfort"], gradient: "linear-gradient(135deg, #C85A3A 0%, #5C8A3A 100%)", summary: "La napolitaine vraie : pâte 24h, San Marzano, mozzarella di bufala, basilic.", story: "Créée en 1889 pour la reine Margherita (couleurs du drapeau). Certifiée STG. Four à 450 °C+, cuisson 90 sec.", validator: { name: "Mariella Conte", role: "Cheffe · Don Angie", city: "West Village, NY" }, category: "pain", allergens: ["gluten", "lait"],
    ingredients: [
      { name: "Farine 00", qty: 500, unit: "g", tags: ["italian", "european", "pantry"], rare: true },
      { name: "Eau", qty: 320, unit: "ml", tags: ["pantry"] },
      { name: "Levure boulangère sèche", qty: 2, unit: "g", tags: ["pantry"] },
      { name: "Sel", qty: 12, unit: "g", tags: ["pantry"] },
      { name: "Tomates San Marzano DOP", qty: 400, unit: "g", tags: ["italian", "european"], rare: true },
      { name: "Mozzarella di bufala", qty: 250, unit: "g", tags: ["italian", "european"], rare: true },
      { name: "Basilic frais", qty: 1, unit: "botte", tags: ["produce"] },
      { name: "Huile d'olive vierge extra", qty: 4, unit: "c.s.", tags: ["italian"] }
    ],
    steps: [
      { title: "Pâte 24h", instruction: "Pétrir 12 min. Pousse 2h ambiante puis 24-48h frigo.", time: 25 },
      { title: "Façonner", instruction: "4 pâtons 200g, pousse 1h.", time: 65 },
      { title: "Sauce crue", instruction: "Tomates écrasées main + sel + huile, pas de cuisson.", time: 3 },
      { title: "Étaler aux mains", instruction: "Du centre vers extérieur, bord épais.", time: 5 },
      { title: "Cuisson", instruction: "Pierre 280-300°C, 7-9 min, position haute.", time: 10 }
    ]
  },
  { id: "cacio-e-pepe", title: "Cacio e Pepe", origin: { country: "Italie", region: "Rome", flag: "🇮🇹" }, auth: 96, duration: 20, servings: 4, difficulty: 2, budget: { perPerson: 5.5, level: "$$" }, diets: ["vegetarian"], moods: ["quick", "comfort"], gradient: "linear-gradient(135deg, #F5F7EE 0%, #15211A 100%)", summary: "Pâtes-fromage-poivre. 3 ingrédients seulement, technique millimétrée.", story: "L'apothéose romaine de la simplicité. Le pecorino doit former une crème sans grumeau — eau de cuisson tiède (pas chaude), mouvements lents.", validator: { name: "Mariella Conte", role: "Cheffe · Don Angie", city: "West Village, NY" }, category: "nouilles", allergens: ["gluten", "lait"],
    ingredients: [
      { name: "Tonnarelli ou spaghetti", qty: 400, unit: "g", tags: ["italian", "pantry"] },
      { name: "Pecorino romano DOP râpé fin", qty: 200, unit: "g", tags: ["italian", "european"], rare: true },
      { name: "Poivre noir entier", qty: 2, unit: "c.s.", tags: ["pantry"] }
    ],
    steps: [
      { title: "Toaster poivre", instruction: "Concasser au mortier, toaster 30 sec à sec.", time: 2 },
      { title: "Pâtes", instruction: "Cuire al dente. Réserver 300 ml d'eau.", time: 9 },
      { title: "Crème", instruction: "Bol : pecorino + 4 c.s. eau tiède (pas chaude !) + poivre. Fouetter en pâte épaisse.", time: 3 },
      { title: "Mélange", instruction: "Pâtes encore chaudes versées sur la crème, mélanger vif. Allonger eau si besoin.", time: 3 }
    ]
  },
  { id: "amatriciana", title: "Bucatini all'Amatriciana", origin: { country: "Italie", region: "Amatrice, Latium", flag: "🇮🇹" }, auth: 95, duration: 30, servings: 4, difficulty: 1, budget: { perPerson: 6.0, level: "$$" }, diets: [], moods: ["comfort"], gradient: "linear-gradient(135deg, #C85A3A 0%, #D9A441 100%)", summary: "Bucatini, guanciale, tomate, pecorino, piment. Le rouge romain.", story: "Originaire d'Amatrice (Latium). Codifiée par décret communal — pas d'oignon, pas d'ail. Guanciale obligatoire.", validator: { name: "Mariella Conte", role: "Cheffe · Don Angie", city: "West Village, NY" }, category: "nouilles", allergens: ["gluten", "lait"],
    ingredients: [
      { name: "Bucatini", qty: 400, unit: "g", tags: ["italian", "pantry"] },
      { name: "Guanciale", qty: 200, unit: "g", tags: ["italian", "european"], rare: true },
      { name: "Tomates pelées San Marzano", qty: 400, unit: "g", tags: ["italian"], rare: true },
      { name: "Pecorino romano", qty: 100, unit: "g", tags: ["italian"], rare: true },
      { name: "Piment rouge sec", qty: 1, unit: "pièce", tags: ["pantry"] },
      { name: "Vin blanc sec", qty: 60, unit: "ml", tags: ["specialty"] }
    ],
    steps: [
      { title: "Guanciale", instruction: "Cubes, faire fondre 8 min jusqu'à croustillant.", time: 10 },
      { title: "Vin", instruction: "Déglacer au vin blanc.", time: 2 },
      { title: "Sauce tomate", instruction: "Tomates écrasées + piment, mijoter 10 min.", time: 12 },
      { title: "Pâtes", instruction: "Bucatini al dente, mélanger dans la sauce, pecorino râpé.", time: 11 }
    ]
  },
  { id: "lasagne-bolognese", title: "Lasagne alla Bolognese", origin: { country: "Italie", region: "Bologne", flag: "🇮🇹" }, auth: 92, duration: 300, servings: 8, difficulty: 3, budget: { perPerson: 6.5, level: "$$" }, diets: [], moods: ["festive", "comfort"], gradient: "linear-gradient(135deg, #D9A441 0%, #C85A3A 100%)", summary: "Couches de pâte verte aux épinards, ragù, béchamel, parmesan. Plat dominical.", story: "Forme codifiée par l'Académie italienne de cuisine. Pâte verte aux épinards (sfoglia verde) typique de Bologne.", validator: { name: "Mariella Conte", role: "Cheffe · Don Angie", city: "West Village, NY" }, category: "nouilles", allergens: ["gluten", "œufs", "lait"],
    ingredients: [
      { name: "Plaques de lasagne aux épinards", qty: 500, unit: "g", tags: ["italian", "european"] },
      { name: "Ragù bolognese", qty: 1, unit: "L", tags: ["butcher"] },
      { name: "Lait entier", qty: 1, unit: "L", tags: ["supermarket"] },
      { name: "Beurre", qty: 100, unit: "g", tags: ["supermarket"] },
      { name: "Farine", qty: 100, unit: "g", tags: ["pantry"] },
      { name: "Muscade", qty: 1, unit: "pincée", tags: ["pantry"] },
      { name: "Parmigiano Reggiano", qty: 200, unit: "g", tags: ["italian"], rare: true }
    ],
    steps: [
      { title: "Préparer ragù", instruction: "Voir recette ragù Bolognese (3h cuisson).", time: 180 },
      { title: "Béchamel", instruction: "Roux beurre-farine, lait chaud peu à peu, 10 min, muscade.", time: 12 },
      { title: "Précuire pâtes", instruction: "Plaques 90 sec eau bouillante, glacer.", time: 10 },
      { title: "Montage 6 couches", instruction: "Béchamel-pâte-ragù-béchamel-parmesan x6.", time: 15 },
      { title: "Cuisson", instruction: "Four 180°C, 40 min jusqu'à doré-craquelé en surface.", time: 42 }
    ]
  },
  { id: "pesto-genovese", title: "Trofie al Pesto Genovese", origin: { country: "Italie", region: "Gênes", flag: "🇮🇹" }, auth: 93, duration: 30, servings: 4, difficulty: 2, budget: { perPerson: 6.0, level: "$$" }, diets: ["vegetarian"], moods: ["quick", "healthy"], gradient: "linear-gradient(135deg, #5C8A3A 0%, #F5F7EE 100%)", summary: "Pâtes ligures, pesto basilic-pignons-parmesan-pecorino-ail-huile.", story: "Pesto = au mortier (mai pestato = jamais battu). Basilic de Pra' AOC. Trofie typiques de la Ligurie, parfois servies avec pommes de terre + haricots verts.", validator: { name: "Mariella Conte", role: "Cheffe · Don Angie", city: "West Village, NY" }, category: "nouilles", allergens: ["gluten", "fruits à coque", "lait"],
    ingredients: [
      { name: "Trofie ligures", qty: 400, unit: "g", tags: ["italian", "pantry"], rare: true },
      { name: "Basilic frais", qty: 100, unit: "g", tags: ["produce"] },
      { name: "Pignons de pin", qty: 50, unit: "g", tags: ["italian", "pantry"] },
      { name: "Parmigiano Reggiano", qty: 60, unit: "g", tags: ["italian"], rare: true },
      { name: "Pecorino sardo", qty: 30, unit: "g", tags: ["italian"], rare: true },
      { name: "Ail", qty: 1, unit: "gousse", tags: ["produce"] },
      { name: "Huile d'olive ligure", qty: 150, unit: "ml", tags: ["italian"] },
      { name: "Pommes de terre + haricots verts", qty: 1, unit: "lot", tags: ["produce"] }
    ],
    steps: [
      { title: "Pesto au mortier", instruction: "Ail + sel, écraser. Basilic + pignons en plusieurs fois. Fromages, huile en filet.", time: 12 },
      { title: "Cuire pâtes + légumes", instruction: "Eau salée : pommes de terre 6 min, haricots 4 min, trofie 8 min. Tout ensemble vers la fin.", time: 14 },
      { title: "Mélange", instruction: "Égoutter, mélanger au pesto + 2 c.s. d'eau de cuisson.", time: 4 }
    ]
  },
  { id: "osso-buco", title: "Osso Buco alla Milanese", origin: { country: "Italie", region: "Milan", flag: "🇮🇹" }, auth: 91, duration: 180, servings: 4, difficulty: 2, budget: { perPerson: 12.0, level: "$$$" }, diets: [], moods: ["festive", "comfort"], gradient: "linear-gradient(135deg, #C85A3A 0%, #D9A441 100%)", summary: "Tranches de jarret de veau braisées, vin blanc, légumes, gremolata.", story: "Jarret = osso (os) + buco (trou) = la moelle au centre. Servi traditionnellement avec risotto Milanese. La gremolata (citron-ail-persil) en fin de cuisson coupe le gras.", validator: { name: "Mariella Conte", role: "Cheffe · Don Angie", city: "West Village, NY" }, category: "ragoût", allergens: ["gluten"],
    ingredients: [
      { name: "Tranches de jarret de veau", qty: 4, unit: "pièce", tags: ["butcher", "specialty"] },
      { name: "Farine", qty: 50, unit: "g", tags: ["pantry"] },
      { name: "Vin blanc sec", qty: 250, unit: "ml", tags: ["specialty"] },
      { name: "Bouillon de veau", qty: 500, unit: "ml", tags: ["pantry"] },
      { name: "Tomates concassées", qty: 200, unit: "g", tags: ["pantry"] },
      { name: "Carotte + céleri + oignon", qty: 1, unit: "lot", tags: ["produce"] },
      { name: "Beurre + huile", qty: 80, unit: "g", tags: ["supermarket"] },
      { name: "Gremolata : citron + ail + persil", qty: 1, unit: "lot", tags: ["produce"] }
    ],
    steps: [
      { title: "Saisir veau", instruction: "Fariner, saisir 6 min par face.", time: 10 },
      { title: "Soffritto + vin", instruction: "Légumes brunoise 8 min, vin réduit.", time: 12 },
      { title: "Mijotage", instruction: "Tomate + bouillon. Couvrir, 2h30 doux ou four 160°C.", time: 150 },
      { title: "Gremolata", instruction: "Hacher zeste citron + ail + persil, parsemer juste avant service.", time: 4 }
    ]
  },
  { id: "saltimbocca", title: "Saltimbocca alla Romana", origin: { country: "Italie", region: "Rome", flag: "🇮🇹" }, auth: 90, duration: 25, servings: 4, difficulty: 2, budget: { perPerson: 9.0, level: "$$" }, diets: [], moods: ["quick", "festive"], gradient: "linear-gradient(135deg, #5C8A3A 0%, #D9A441 100%)", summary: "Escalopes de veau, jambon de Parme, sauge, sauce vin blanc-beurre.", story: "Saltimbocca = saute en bouche. Le pic en bois maintient sauge-jambon contre veau. Cuisson rapide, sauce déglacée immédiate.", validator: { name: "Mariella Conte", role: "Cheffe · Don Angie", city: "West Village, NY" }, category: "ragoût", allergens: ["gluten", "lait"],
    ingredients: [
      { name: "Escalopes de veau fines", qty: 8, unit: "pièce", tags: ["butcher"] },
      { name: "Tranches de jambon de Parme", qty: 8, unit: "pièce", tags: ["italian"], rare: true },
      { name: "Feuilles de sauge fraîche", qty: 16, unit: "pièce", tags: ["produce"] },
      { name: "Beurre", qty: 60, unit: "g", tags: ["supermarket"] },
      { name: "Vin blanc sec", qty: 100, unit: "ml", tags: ["specialty"] },
      { name: "Farine", qty: 30, unit: "g", tags: ["pantry"] }
    ],
    steps: [
      { title: "Monter", instruction: "Sur chaque escalope : 1 sauge + 1 jambon, fixer au pic.", time: 5 },
      { title: "Saisir", instruction: "Fariner côté veau. Beurre chaud, 90 sec côté jambon, 60 sec côté veau.", time: 6 },
      { title: "Sauce", instruction: "Réserver veau. Vin dans la poêle, réduire, finir au beurre.", time: 4 },
      { title: "Service", instruction: "Napper, manger immédiatement.", time: 2 }
    ]
  },
  { id: "caprese", title: "Insalata Caprese", origin: { country: "Italie", region: "Capri", flag: "🇮🇹" }, auth: 95, duration: 10, servings: 4, difficulty: 1, budget: { perPerson: 5.0, level: "$$" }, diets: ["vegetarian", "gluten-free"], moods: ["quick", "healthy"], gradient: "linear-gradient(135deg, #5C8A3A 0%, #C85A3A 100%)", summary: "Tomates mûres, mozzarella di bufala, basilic, huile d'olive. 4 ingrédients.", story: "Inventée à Capri dans les années 50. Couleurs du drapeau italien. Tomates DOIVENT être ultra-mûres, mozzarella encore tiède.", validator: { name: "Mariella Conte", role: "Cheffe · Don Angie", city: "West Village, NY" }, category: "mezze", allergens: ["lait"],
    ingredients: [
      { name: "Tomates mûres (cœur de bœuf)", qty: 4, unit: "pièce", tags: ["produce"] },
      { name: "Mozzarella di bufala fresca", qty: 250, unit: "g", tags: ["italian"], rare: true },
      { name: "Basilic frais", qty: 1, unit: "botte", tags: ["produce"] },
      { name: "Huile d'olive vierge extra", qty: 60, unit: "ml", tags: ["italian"] },
      { name: "Sel + poivre", qty: 1, unit: "qsp", tags: ["pantry"] }
    ],
    steps: [
      { title: "Trancher", instruction: "Tomates et mozzarella en rondelles 1 cm.", time: 4 },
      { title: "Dresser", instruction: "Alterner tomate-mozza, basilic entre.", time: 4 },
      { title: "Assaisonner", instruction: "Huile généreuse, sel, poivre, AU MOMENT de servir.", time: 2 }
    ]
  },
  { id: "vongole", title: "Spaghetti alle Vongole", origin: { country: "Italie", region: "Naples", flag: "🇮🇹" }, auth: 92, duration: 35, servings: 4, difficulty: 2, budget: { perPerson: 11.0, level: "$$$" }, diets: ["pescatarian"], moods: ["quick", "festive"], gradient: "linear-gradient(135deg, #D9A441 0%, #5C8A3A 100%)", summary: "Spaghetti, palourdes ouvertes au vin blanc, ail, persil, peperoncino.", story: "Le pâtes-fruits-de-mer de référence. Vongole veraci (palourdes vraies) si possible. JAMAIS de fromage avec poisson en Italie.", validator: { name: "Mariella Conte", role: "Cheffe · Don Angie", city: "West Village, NY" }, category: "nouilles", allergens: ["gluten", "mollusques"],
    ingredients: [
      { name: "Palourdes vraies", qty: 1000, unit: "g", tags: ["fish", "specialty"] },
      { name: "Spaghetti", qty: 400, unit: "g", tags: ["italian", "pantry"] },
      { name: "Vin blanc sec", qty: 150, unit: "ml", tags: ["specialty"] },
      { name: "Ail", qty: 4, unit: "gousses", tags: ["produce"] },
      { name: "Persil plat", qty: 1, unit: "botte", tags: ["produce"] },
      { name: "Peperoncino sec", qty: 1, unit: "pièce", tags: ["pantry"] },
      { name: "Huile d'olive", qty: 80, unit: "ml", tags: ["italian"] }
    ],
    steps: [
      { title: "Dégorger palourdes", instruction: "Eau salée 1h, jeter sable.", time: 60 },
      { title: "Ouvrir palourdes", instruction: "Casserole couverte 5 min vif. Filtrer le jus.", time: 6 },
      { title: "Sauce", instruction: "Ail + peperoncino dans huile. Vin + jus filtré, réduire.", time: 6 },
      { title: "Pâtes", instruction: "Al dente. Mélanger dans sauce + palourdes décortiquées (garder 1/3 en coquille).", time: 10 },
      { title: "Persil", instruction: "Hors feu, jamais de fromage." }
    ]
  },
  { id: "tiramisu", title: "Tiramisù", origin: { country: "Italie", region: "Vénétie", flag: "🇮🇹" }, auth: 92, duration: 270, servings: 8, difficulty: 2, budget: { perPerson: 4.0, level: "$" }, diets: ["vegetarian"], moods: ["wow", "festive"], gradient: "linear-gradient(135deg, #15211A 0%, #D9A441 100%)", summary: "Mascarpone, sabayon, biscuits trempés au café, cacao amer.", story: "Inventé à Trévise dans les années 70. Tira-mi-su = remonte-moi (caféine). Mascarpone obligatoire. Pas de crème fouettée à l'ancienne — sabayon italien battu chaud.", validator: { name: "Mariella Conte", role: "Cheffe · Don Angie", city: "West Village, NY" }, category: "brunch", allergens: ["gluten", "œufs", "lait"],
    ingredients: [
      { name: "Boudoirs (savoiardi)", qty: 300, unit: "g", tags: ["italian"] },
      { name: "Mascarpone", qty: 500, unit: "g", tags: ["italian"], rare: true },
      { name: "Œufs frais", qty: 6, unit: "pièce", tags: ["supermarket"] },
      { name: "Sucre", qty: 150, unit: "g", tags: ["pantry"] },
      { name: "Café espresso refroidi", qty: 400, unit: "ml", tags: ["pantry"] },
      { name: "Marsala (optionnel)", qty: 50, unit: "ml", tags: ["italian"] },
      { name: "Cacao amer", qty: 30, unit: "g", tags: ["pantry"] }
    ],
    steps: [
      { title: "Sabayon", instruction: "Jaunes + sucre au bain-marie, fouetter au ruban 8 min.", time: 10 },
      { title: "Mascarpone", instruction: "Détendre mascarpone, incorporer au sabayon.", time: 4 },
      { title: "Blancs", instruction: "Monter en neige ferme, incorporer délicatement.", time: 6 },
      { title: "Montage", instruction: "Tremper boudoirs dans café (1 sec), couches alternées avec mascarpone.", time: 10 },
      { title: "Repos", instruction: "4h frigo minimum, cacao au moment.", time: 240 }
    ]
  },
  { id: "panna-cotta", title: "Panna Cotta", origin: { country: "Italie", region: "Piémont", flag: "🇮🇹" }, auth: 91, duration: 250, servings: 6, difficulty: 1, budget: { perPerson: 2.5, level: "$" }, diets: ["vegetarian"], moods: ["quick", "wow"], gradient: "linear-gradient(135deg, #F5F7EE 0%, #C85A3A 100%)", summary: "Crème cuite, vanille, gélatine. Démoulée, coulis fruits rouges.", story: "Recette piémontaise simple : crème + sucre + vanille + gélatine. Texture parfaite : trembler en démoulant, fondre en bouche.", validator: { name: "Mariella Conte", role: "Cheffe · Don Angie", city: "West Village, NY" }, category: "brunch", allergens: ["lait"],
    ingredients: [
      { name: "Crème liquide entière", qty: 500, unit: "ml", tags: ["supermarket"] },
      { name: "Lait entier", qty: 100, unit: "ml", tags: ["supermarket"] },
      { name: "Sucre", qty: 80, unit: "g", tags: ["pantry"] },
      { name: "Gousse de vanille", qty: 1, unit: "pièce", tags: ["pantry"] },
      { name: "Gélatine en feuilles", qty: 4, unit: "g", tags: ["pantry"] },
      { name: "Coulis fruits rouges", qty: 200, unit: "g", tags: ["supermarket"] }
    ],
    steps: [
      { title: "Hydrater gélatine", instruction: "Eau froide 10 min.", time: 10 },
      { title: "Infuser", instruction: "Crème + lait + sucre + vanille fendue, frémir.", time: 6 },
      { title: "Gélatine", instruction: "Hors feu, gélatine essorée, mélanger.", time: 2 },
      { title: "Mouler + repos", instruction: "Verser dans ramequins, 4h frigo.", time: 240 },
      { title: "Démouler", instruction: "Plonger 5 sec eau chaude, coulis dessus." }
    ]
  },
  { id: "polenta-salsiccia", title: "Polenta con Salsiccia", origin: { country: "Italie", region: "Vénétie", flag: "🇮🇹" }, auth: 88, duration: 60, servings: 4, difficulty: 1, budget: { perPerson: 5.5, level: "$" }, diets: ["gluten-free"], moods: ["comfort"], gradient: "linear-gradient(135deg, #D9A441 0%, #15211A 100%)", summary: "Polenta crémeuse + saucisse italienne mijotée + sauce tomate.", story: "Plat de la Vénétie rurale. Polenta lentement remuée 40 min (la version express tue tout). Saucisses fraîches type luganica.", validator: { name: "Mariella Conte", role: "Cheffe · Don Angie", city: "West Village, NY" }, category: "bol", allergens: ["lait"],
    ingredients: [
      { name: "Polenta jaune", qty: 250, unit: "g", tags: ["italian", "pantry"] },
      { name: "Saucisses italiennes fraîches", qty: 500, unit: "g", tags: ["italian", "butcher"] },
      { name: "Tomates concassées", qty: 400, unit: "g", tags: ["pantry"] },
      { name: "Vin rouge", qty: 100, unit: "ml", tags: ["specialty"] },
      { name: "Oignon + ail", qty: 1, unit: "lot", tags: ["produce"] },
      { name: "Beurre + parmesan", qty: 1, unit: "lot", tags: ["italian"] }
    ],
    steps: [
      { title: "Saucisses", instruction: "Émietter, dorer 8 min.", time: 10 },
      { title: "Sauce", instruction: "Oignon-ail, vin réduit, tomate, mijoter 20 min.", time: 25 },
      { title: "Polenta", instruction: "1L eau salée bouillante, polenta en pluie en remuant. Fouet 40 min doux.", time: 42 },
      { title: "Service", instruction: "Polenta crémée beurre+parmesan, sauce dessus." }
    ]
  },
  { id: "arancini", title: "Arancini Siciliani", origin: { country: "Italie", region: "Sicile", flag: "🇮🇹" }, auth: 91, duration: 90, servings: 6, difficulty: 3, budget: { perPerson: 4.5, level: "$" }, diets: [], moods: ["street", "wow"], gradient: "linear-gradient(135deg, #D9A441 0%, #C85A3A 100%)", summary: "Boules de risotto safran fourrées ragù-petits pois-mozzarella, panées et frites.", story: "Street food sicilien. Forme conique (montagne Etna) à Catane, ronde à Palerme. Le risotto safran est cuit et refroidi avant façonnage.", validator: { name: "Mariella Conte", role: "Cheffe · Don Angie", city: "West Village, NY" }, category: "ragoût", allergens: ["gluten", "lait", "œufs"],
    ingredients: [
      { name: "Riz arborio cuit + safran", qty: 500, unit: "g", tags: ["italian", "pantry"] },
      { name: "Ragù bolognese", qty: 200, unit: "g", tags: ["butcher"] },
      { name: "Petits pois", qty: 100, unit: "g", tags: ["produce"] },
      { name: "Mozzarella en cubes", qty: 150, unit: "g", tags: ["italian"] },
      { name: "Œufs", qty: 2, unit: "pièce", tags: ["supermarket"] },
      { name: "Chapelure", qty: 200, unit: "g", tags: ["pantry"] },
      { name: "Huile pour friture", qty: 1, unit: "L", tags: ["pantry"] }
    ],
    steps: [
      { title: "Refroidir riz", instruction: "Risotto safran cuit la veille, frigo.", time: 720 },
      { title: "Façonner", instruction: "Boule riz, creuser, garnir 1 c.c. ragù+pois+mozza, refermer.", time: 25 },
      { title: "Panure", instruction: "Œuf battu → chapelure.", time: 12 },
      { title: "Friture", instruction: "180°C, 5 min jusqu'à doré-bronze.", time: 8 }
    ]
  },
  { id: "bruschetta", title: "Bruschetta al Pomodoro", origin: { country: "Italie", region: "Toscane", flag: "🇮🇹" }, auth: 92, duration: 15, servings: 4, difficulty: 1, budget: { perPerson: 2.5, level: "$" }, diets: ["vegan", "vegetarian", "dairy-free"], moods: ["quick", "healthy"], gradient: "linear-gradient(135deg, #C85A3A 0%, #5C8A3A 100%)", summary: "Pain grillé frotté à l'ail, tomates concassées, basilic, huile d'olive.", story: "Antipasto rustique romain et toscan. Pain rustique grillé, frotté à l'ail cru. Tomates écrasées à la main, jamais mixées.", validator: { name: "Mariella Conte", role: "Cheffe · Don Angie", city: "West Village, NY" }, category: "mezze", allergens: ["gluten"],
    ingredients: [
      { name: "Pain de campagne", qty: 8, unit: "tranches", tags: ["supermarket"] },
      { name: "Tomates très mûres", qty: 4, unit: "pièce", tags: ["produce"] },
      { name: "Ail", qty: 2, unit: "gousses", tags: ["produce"] },
      { name: "Basilic frais", qty: 0.5, unit: "botte", tags: ["produce"] },
      { name: "Huile d'olive vierge extra", qty: 60, unit: "ml", tags: ["italian"] },
      { name: "Sel marin", qty: 1, unit: "qsp", tags: ["pantry"] }
    ],
    steps: [
      { title: "Tomates", instruction: "Concasser à la main, sel + huile + basilic, 5 min.", time: 6 },
      { title: "Griller pain", instruction: "Plancha ou grill, dorer chaque face.", time: 4 },
      { title: "Frotter ail", instruction: "Frotter chaque tranche chaude.", time: 2 },
      { title: "Garnir", instruction: "Tomates dessus, huile, basilic." }
    ]
  },
  { id: "minestrone", title: "Minestrone", origin: { country: "Italie", region: "Lombardie", flag: "🇮🇹" }, auth: 89, duration: 90, servings: 6, difficulty: 1, budget: { perPerson: 3.5, level: "$" }, diets: ["vegan", "vegetarian", "dairy-free"], moods: ["comfort", "healthy"], gradient: "linear-gradient(135deg, #5C8A3A 0%, #D9A441 100%)", summary: "Soupe de légumes de saison + haricots + petites pâtes + parmesan croûte.", story: "Plat-base italien. Croûte de parmesan dans la cuisson = secret umami. Petites pâtes (ditalini) ajoutées à la fin pour rester al dente.", validator: { name: "Mariella Conte", role: "Cheffe · Don Angie", city: "West Village, NY" }, category: "soupe", allergens: ["gluten"],
    ingredients: [
      { name: "Haricots cannellini cuits", qty: 400, unit: "g", tags: ["pantry"] },
      { name: "Carotte + céleri + oignon", qty: 1, unit: "lot", tags: ["produce"] },
      { name: "Courgette + pommes de terre + chou", qty: 1, unit: "lot", tags: ["produce"] },
      { name: "Tomates concassées", qty: 400, unit: "g", tags: ["pantry"] },
      { name: "Ditalini pâtes", qty: 150, unit: "g", tags: ["italian", "pantry"] },
      { name: "Croûte de parmesan", qty: 1, unit: "pièce", tags: ["italian"] },
      { name: "Huile d'olive + basilic", qty: 1, unit: "lot", tags: ["italian"] }
    ],
    steps: [
      { title: "Soffritto", instruction: "Brunoise carotte-céleri-oignon, suer 10 min huile.", time: 12 },
      { title: "Légumes", instruction: "Pommes de terre, courgette, chou en cubes 5 min.", time: 6 },
      { title: "Bouillon", instruction: "Tomates + 2L eau + croûte parmesan + sel + haricots, 45 min.", time: 47 },
      { title: "Pâtes", instruction: "Ditalini 8 min direct dans la soupe.", time: 10 },
      { title: "Service", instruction: "Huile crue + basilic + parmesan râpé." }
    ]
  },
  { id: "pizza-marinara", title: "Pizza Marinara", origin: { country: "Italie", region: "Naples", flag: "🇮🇹" }, auth: 95, duration: 1500, servings: 4, difficulty: 2, budget: { perPerson: 3.0, level: "$" }, diets: ["vegan", "vegetarian", "dairy-free"], moods: ["wow"], gradient: "linear-gradient(135deg, #C85A3A 0%, #15211A 100%)", summary: "Pizza simplissime : tomate, ail, origan, huile d'olive. Pas de fromage.", story: "L'autre vraie pizza napolitaine, antérieure à la Margherita. Du nom des marins (marinai). Tomates San Marzano, origan séché, ail tranché, basta.", validator: { name: "Mariella Conte", role: "Cheffe · Don Angie", city: "West Village, NY" }, category: "pain", allergens: ["gluten"],
    ingredients: [
      { name: "Pâte à pizza fermentée 24h", qty: 4, unit: "pâtons", tags: ["italian"] },
      { name: "Tomates San Marzano", qty: 400, unit: "g", tags: ["italian"], rare: true },
      { name: "Ail", qty: 4, unit: "gousses", tags: ["produce"] },
      { name: "Origan séché", qty: 2, unit: "c.s.", tags: ["pantry"] },
      { name: "Huile d'olive vierge extra", qty: 60, unit: "ml", tags: ["italian"] }
    ],
    steps: [
      { title: "Étaler", instruction: "Aux mains, fin au centre, bord épais.", time: 4 },
      { title: "Garnir", instruction: "Tomate écrasée + lamelles d'ail + origan + huile.", time: 3 },
      { title: "Cuisson", instruction: "Pierre 280°C, 7 min.", time: 9 }
    ]
  },
  { id: "pasta-norma", title: "Pasta alla Norma", origin: { country: "Italie", region: "Catane, Sicile", flag: "🇮🇹" }, auth: 91, duration: 50, servings: 4, difficulty: 2, budget: { perPerson: 5.5, level: "$$" }, diets: ["vegetarian"], moods: ["comfort"], gradient: "linear-gradient(135deg, #5C8A3A 0%, #C85A3A 100%)", summary: "Pâtes, sauce tomate, aubergines frites, ricotta salata râpée, basilic.", story: "Hommage à l'opéra Norma de Bellini (catanais). Aubergines impérativement frites, jamais cuites au four. Ricotta salata sicilienne typique.", validator: { name: "Mariella Conte", role: "Cheffe · Don Angie", city: "West Village, NY" }, category: "nouilles", allergens: ["gluten", "lait"],
    ingredients: [
      { name: "Spaghetti ou rigatoni", qty: 400, unit: "g", tags: ["italian", "pantry"] },
      { name: "Aubergines", qty: 600, unit: "g", tags: ["produce"] },
      { name: "Tomates concassées", qty: 600, unit: "g", tags: ["pantry"] },
      { name: "Ail", qty: 2, unit: "gousses", tags: ["produce"] },
      { name: "Basilic frais", qty: 1, unit: "botte", tags: ["produce"] },
      { name: "Ricotta salata", qty: 100, unit: "g", tags: ["italian"], rare: true, substitutes: ["feta sec râpé"] },
      { name: "Huile pour friture", qty: 300, unit: "ml", tags: ["pantry"] }
    ],
    steps: [
      { title: "Aubergines", instruction: "Cubes 2 cm, saler 20 min, éponger. Frire 4 min.", time: 28 },
      { title: "Sauce", instruction: "Ail dans huile, tomates, mijoter 15 min.", time: 17 },
      { title: "Pâtes + service", instruction: "Pâtes al dente dans sauce. Aubergines + basilic. Ricotta salata râpée généreuse." }
    ]
  },
  { id: "gnocchi-romana", title: "Gnocchi alla Romana", origin: { country: "Italie", region: "Rome", flag: "🇮🇹" }, auth: 88, duration: 75, servings: 4, difficulty: 2, budget: { perPerson: 4.5, level: "$" }, diets: ["vegetarian"], moods: ["comfort"], gradient: "linear-gradient(135deg, #D9A441 0%, #F5F7EE 100%)", summary: "Gnocchi disques de semoule + lait + parmesan, gratinés au beurre.", story: "Différents des gnocchi de pommes de terre. Pâte de semoule cuite dans le lait, refroidie, découpée en disques, gratinée. Plat romain dominical.", validator: { name: "Mariella Conte", role: "Cheffe · Don Angie", city: "West Village, NY" }, category: "raviolis", allergens: ["gluten", "lait", "œufs"],
    ingredients: [
      { name: "Semoule fine", qty: 250, unit: "g", tags: ["pantry"] },
      { name: "Lait entier", qty: 1, unit: "L", tags: ["supermarket"] },
      { name: "Beurre", qty: 100, unit: "g", tags: ["supermarket"] },
      { name: "Parmigiano Reggiano", qty: 150, unit: "g", tags: ["italian"], rare: true },
      { name: "Jaunes d'œuf", qty: 2, unit: "pièce", tags: ["supermarket"] },
      { name: "Muscade", qty: 1, unit: "pincée", tags: ["pantry"] }
    ],
    steps: [
      { title: "Pâte", instruction: "Lait + sel + muscade bouillant, semoule en pluie en fouettant 8 min.", time: 12 },
      { title: "Enrichir", instruction: "Hors feu : 50g beurre + 100g parmesan + jaunes.", time: 4 },
      { title: "Refroidir", instruction: "Étaler 1 cm sur film, 1h frigo.", time: 60 },
      { title: "Disques", instruction: "Découper à l'emporte-pièce 5 cm.", time: 5 },
      { title: "Gratin", instruction: "Beurrer plat, écailler disques, beurre fondu + parmesan. Four 200°C, 18 min.", time: 22 }
    ]
  },
  { id: "pasta-fagioli", title: "Pasta e Fagioli", origin: { country: "Italie", region: "Vénétie", flag: "🇮🇹" }, auth: 90, duration: 90, servings: 6, difficulty: 1, budget: { perPerson: 3.0, level: "$" }, diets: ["vegan", "vegetarian", "dairy-free"], moods: ["comfort", "healthy"], gradient: "linear-gradient(135deg, #C85A3A 0%, #5C8A3A 100%)", summary: "Soupe-pâtes-haricots cannellini, romarin, ail, croûte de pain.", story: "Cucina povera de Vénétie. Mi-soupe mi-pâtes — texture épaisse. Romarin + ail typique. Mixer 1/3 des haricots pour le crémeux.", validator: { name: "Mariella Conte", role: "Cheffe · Don Angie", city: "West Village, NY" }, category: "soupe", allergens: ["gluten"],
    ingredients: [
      { name: "Haricots cannellini cuits", qty: 500, unit: "g", tags: ["pantry"] },
      { name: "Pâtes courtes (ditali)", qty: 200, unit: "g", tags: ["italian", "pantry"] },
      { name: "Pancetta (option)", qty: 80, unit: "g", tags: ["italian"] },
      { name: "Tomates concassées", qty: 200, unit: "g", tags: ["pantry"] },
      { name: "Romarin frais", qty: 1, unit: "branche", tags: ["produce"] },
      { name: "Ail + oignon", qty: 1, unit: "lot", tags: ["produce"] },
      { name: "Huile d'olive", qty: 60, unit: "ml", tags: ["italian"] }
    ],
    steps: [
      { title: "Base", instruction: "Pancetta + oignon-ail-romarin 8 min.", time: 10 },
      { title: "Mixer 1/3 haricots", instruction: "Avec un peu de leur eau, ajouter au pot.", time: 4 },
      { title: "Mijoter", instruction: "Tomates + reste haricots + 1.5L eau, 30 min.", time: 32 },
      { title: "Pâtes", instruction: "Ditali al dente direct dans la soupe.", time: 9 },
      { title: "Service", instruction: "Huile crue + parmesan râpé + poivre." }
    ]
  },
  { id: "pollo-cacciatora", title: "Pollo alla Cacciatora", origin: { country: "Italie", region: "Toscane", flag: "🇮🇹" }, auth: 88, duration: 90, servings: 4, difficulty: 1, budget: { perPerson: 6.5, level: "$$" }, diets: ["dairy-free", "halal-friendly"], moods: ["comfort"], gradient: "linear-gradient(135deg, #C85A3A 0%, #5C8A3A 100%)", summary: "Poulet braisé tomate-vin blanc-romarin-olives — recette du chasseur.", story: "Plat rustique toscan. Originellement avec gibier, adapté au poulet. Vin blanc obligatoire (rouge serait Marengo). Olives noires Taggiasche typiques.", validator: { name: "Mariella Conte", role: "Cheffe · Don Angie", city: "West Village, NY" }, category: "ragoût", allergens: [],
    ingredients: [
      { name: "Cuisses de poulet", qty: 6, unit: "pièce", tags: ["butcher", "supermarket"] },
      { name: "Tomates concassées", qty: 400, unit: "g", tags: ["pantry"] },
      { name: "Vin blanc sec", qty: 200, unit: "ml", tags: ["specialty"] },
      { name: "Olives noires Taggiasche", qty: 100, unit: "g", tags: ["italian"], rare: true },
      { name: "Romarin + sauge fraîches", qty: 1, unit: "lot", tags: ["produce"] },
      { name: "Champignons (option)", qty: 200, unit: "g", tags: ["produce"] },
      { name: "Ail", qty: 4, unit: "gousses", tags: ["produce"] }
    ],
    steps: [
      { title: "Saisir poulet", instruction: "Dorer 8 min huile.", time: 10 },
      { title: "Aromates + vin", instruction: "Ail-herbes 1 min, vin réduit.", time: 6 },
      { title: "Mijoter", instruction: "Tomates + champignons, couvrir, 50 min.", time: 52 },
      { title: "Olives + service", instruction: "Olives 10 min avant la fin. Polenta ou pain.", time: 12 }
    ]
  },
  { id: "panzanella", title: "Panzanella", origin: { country: "Italie", region: "Toscane", flag: "🇮🇹" }, auth: 89, duration: 30, servings: 4, difficulty: 1, budget: { perPerson: 3.0, level: "$" }, diets: ["vegan", "vegetarian", "dairy-free"], moods: ["healthy", "quick"], gradient: "linear-gradient(135deg, #5C8A3A 0%, #D9A441 100%)", summary: "Salade toscane : pain rassis trempé, tomates, oignons, basilic, vinaigre.", story: "Recette anti-gaspi du pain dur. Été toscan. Tremper le pain dans eau + vinaigre, presser, mélanger juste avant.", validator: { name: "Mariella Conte", role: "Cheffe · Don Angie", city: "West Village, NY" }, category: "mezze", allergens: ["gluten"],
    ingredients: [
      { name: "Pain de campagne rassis", qty: 300, unit: "g", tags: ["supermarket"] },
      { name: "Tomates mûres", qty: 4, unit: "pièce", tags: ["produce"] },
      { name: "Concombre", qty: 1, unit: "pièce", tags: ["produce"] },
      { name: "Oignon rouge", qty: 1, unit: "pièce", tags: ["produce"] },
      { name: "Basilic frais", qty: 1, unit: "botte", tags: ["produce"] },
      { name: "Vinaigre rouge", qty: 30, unit: "ml", tags: ["pantry"] },
      { name: "Huile d'olive", qty: 60, unit: "ml", tags: ["italian"] }
    ],
    steps: [
      { title: "Pain", instruction: "Cubes 3 cm, tremper eau + vinaigre 10 min, presser.", time: 12 },
      { title: "Légumes", instruction: "Tomates en gros morceaux, concombre tranché, oignon ciselé.", time: 6 },
      { title: "Mélange", instruction: "Tout réunir + huile + basilic + sel, repos 10 min.", time: 12 }
    ]
  },
  { id: "cannelloni-spinaci", title: "Cannelloni Spinaci-Ricotta", origin: { country: "Italie", region: "Émilie-Romagne", flag: "🇮🇹" }, auth: 91, duration: 90, servings: 6, difficulty: 2, budget: { perPerson: 5.5, level: "$" }, diets: ["vegetarian"], moods: ["comfort", "festive"], gradient: "linear-gradient(135deg, #5C8A3A 0%, #F5F7EE 100%)", summary: "Cannelloni farcis épinards-ricotta-parmesan, sauce béchamel + tomate, gratinés.", story: "Plat dominical Émilie-Romagne. Pâte à lasagne roulée + farce ricotta-épinards-muscade. Béchamel + sauce tomate, gratinés au four.", validator: { name: "Marco Ferrari", role: "Chef · Lilia", city: "Williamsburg, NY" }, category: "pâtes", allergens: ["gluten", "œufs", "lactose"],
    ingredients: [{ name: "Plaques pâte fraîche ou tubes cannelloni + épinards + ricotta + parmesan + œuf + muscade + ail + tomates concassées + basilic + beurre + farine + lait + mozzarella", qty: 1, unit: "lot", tags: ["pantry", "produce"] }],
    steps: [{ title: "Farce", instruction: "Épinards essorés + ricotta + parmesan + œuf + muscade.", time: 12 }, { title: "Sauce tomate", instruction: "Ail + tomates + basilic, mijoter 18 min.", time: 22 }, { title: "Béchamel", instruction: "Roux + lait + sel + muscade.", time: 10 }, { title: "Garnir+gratiner", instruction: "Tubes farcis dans plat, sauce tomate dessous, béchamel dessus + mozzarella, four 200°C 25 min.", time: 30 }] }
]);
