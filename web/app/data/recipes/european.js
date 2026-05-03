/* eatrail · v1.4 — recipes / european
 * Cuisines couvertes : Italie, France, Espagne, Grèce, Allemagne, Pologne, Géorgie, UK.
 */

window.EATRAIL_RECIPES = (window.EATRAIL_RECIPES || []).concat([

  // ── ITALIE ────────────────────────────────────────────
  {
    id: "carbonara",
    title: "Spaghetti alla Carbonara",
    origin: { country: "Italie", region: "Rome", flag: "🇮🇹" },
    auth: 95, duration: 25, servings: 4, difficulty: 2,
    budget: { perPerson: 7.0, level: "$$" },
    diets: [], moods: ["quick", "comfort"],
    gradient: "linear-gradient(135deg, #D9A441 0%, #F5F7EE 100%)",
    summary: "Spaghetti, guanciale grillé, jaunes d'œufs, pecorino romano, poivre noir. Aucune crème.",
    story: "Quattro ingredienti, basta : guanciale, uovo, pecorino, pepe. Pas de crème, pas d'oignon, pas d'ail. La technique : émulsionner les jaunes avec l'eau de cuisson chaude (sans cuire) — créer une crème naturelle.",
    validator: { name: "Mariella Conte", role: "Cheffe · Don Angie", city: "West Village, NY" },
    category: "nouilles", allergens: ["gluten", "œufs", "lait"],
    ingredients: [
      { name: "Spaghetti (de bonne qualité, bronze cut)", qty: 400, unit: "g", tags: ["pantry", "european"] },
      { name: "Guanciale", qty: 200, unit: "g", tags: ["italian", "european", "specialty"], rare: true, substitutes: ["pancetta (moins authentique)"] },
      { name: "Pecorino romano DOP (râpé fin)", qty: 100, unit: "g", tags: ["italian", "european", "specialty"], rare: true },
      { name: "Jaunes d'œuf", qty: 4, unit: "pièce", tags: ["supermarket"] },
      { name: "Œuf entier", qty: 1, unit: "pièce", tags: ["supermarket"] },
      { name: "Poivre noir en grains (fraîchement moulu)", qty: 2, unit: "c.c.", tags: ["pantry"] },
      { name: "Sel pour l'eau de cuisson", qty: 1, unit: "c.s.", tags: ["pantry"] }
    ],
    steps: [
      { title: "Eau salée", instruction: "Grande casserole : 4L eau + sel. Bouillir.", time: 8 },
      { title: "Guanciale", instruction: "Cubes 5 mm. Poêler à sec à feu doux 8 min : doit rendre son gras et devenir croustillant.", time: 10 },
      { title: "Émulsion œuf", instruction: "Bol : 4 jaunes + 1 œuf entier + pecorino + poivre concassé + 2 c.s. d'eau de cuisson. Fouetter.", time: 4 },
      { title: "Pâtes", instruction: "Cuire spaghetti al dente. Réserver 200 ml d'eau de cuisson.", time: 9 },
      { title: "Mélange", instruction: "HORS FEU : pâtes égouttées dans la poêle au guanciale, mélanger. Verser l'émulsion en remuant vif. Allonger avec un peu d'eau de cuisson si besoin : crème nappante.", time: 3 },
      { title: "Service", instruction: "Assiettes chaudes, encore plus de pecorino + poivre. Manger immédiatement." }
    ]
  },

  {
    id: "ragu-bolognese",
    title: "Tagliatelle al Ragù alla Bolognese",
    origin: { country: "Italie", region: "Bologne", flag: "🇮🇹" },
    auth: 96, duration: 240, servings: 6, difficulty: 2,
    budget: { perPerson: 6.5, level: "$$" },
    diets: [], moods: ["comfort", "festive"],
    gradient: "linear-gradient(135deg, #C85A3A 0%, #15211A 100%)",
    summary: "Le vrai ragù bolognais : viandes hachées au couteau, mijoté 3 heures, lait, vin blanc, soffritto.",
    story: "Recette officiellement déposée à la Chambre de Commerce de Bologne en 1982. PAS de spaghetti (sacrilège), uniquement tagliatelle ou pappardelle. Lait obligatoire (attendrit), tomate en concentré seulement, mijotage 3 h minimum.",
    validator: { name: "Mariella Conte", role: "Cheffe · Don Angie", city: "West Village, NY" },
    category: "nouilles", allergens: ["gluten", "lait"],
    ingredients: [
      { name: "Tagliatelle fraîches aux œufs", qty: 600, unit: "g", tags: ["italian", "european"], rare: true },
      { name: "Bœuf haché 15%", qty: 400, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Veau haché (épaule)", qty: 200, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Pancetta non fumée", qty: 80, unit: "g", tags: ["italian", "european"] },
      { name: "Carotte", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Branche de céleri", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Oignon jaune", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Lait entier", qty: 250, unit: "ml", tags: ["supermarket"] },
      { name: "Vin blanc sec", qty: 200, unit: "ml", tags: ["specialty", "supermarket"] },
      { name: "Concentré de tomate", qty: 2, unit: "c.s.", tags: ["pantry"] },
      { name: "Bouillon de bœuf", qty: 500, unit: "ml", tags: ["pantry"] },
      { name: "Parmigiano Reggiano (râpé)", qty: 100, unit: "g", tags: ["italian", "european"], rare: true },
      { name: "Beurre", qty: 30, unit: "g", tags: ["supermarket"] },
      { name: "Huile d'olive", qty: 3, unit: "c.s.", tags: ["pantry"] }
    ],
    steps: [
      { title: "Soffritto", instruction: "Couper carotte + céleri + oignon en très petits dés (battuto). Suer 12 min dans huile + beurre.", time: 14 },
      { title: "Pancetta + viandes", instruction: "Pancetta hachée, 3 min. Bœuf + veau, dorer 8 min en cassant à la spatule.", time: 12 },
      { title: "Vin blanc", instruction: "Verser vin, déglacer, réduire 3 min.", time: 4 },
      { title: "Tomate + lait", instruction: "Concentré, 1 min. Lait, mijoter doux 30 min : doit s'incorporer complètement.", time: 32 },
      { title: "Mijotage long", instruction: "Bouillon en plusieurs fois, mijoter 2 h 30 à découvert très doux, ajouter bouillon si besoin. Sauce doit être brune-épaisse.", time: 150 },
      { title: "Service", instruction: "Cuire tagliatelle 3 min eau salée. Mélanger directement dans la poêle au ragù. Parmigiano généreux." }
    ]
  },

  {
    id: "risotto-milanese",
    title: "Risotto alla Milanese",
    origin: { country: "Italie", region: "Milan", flag: "🇮🇹" },
    auth: 93, duration: 35, servings: 4, difficulty: 2,
    budget: { perPerson: 6.0, level: "$$" },
    diets: ["vegetarian"], moods: ["comfort", "festive"],
    gradient: "linear-gradient(135deg, #D9A441 0%, #F5F7EE 100%)",
    summary: "Risotto au safran et moelle de bœuf, signature dorée milanaise.",
    story: "Inventé selon la légende au XVIe par un assistant peintre du Duomo qui ajoutait du safran à ses pigments. Riz Carnaroli ou Vialone Nano (jamais Arborio basique). Mantecatura beurre + parmesan = la finale onctueuse.",
    validator: { name: "Mariella Conte", role: "Cheffe · Don Angie", city: "West Village, NY" },
    category: "bol", allergens: ["lait"],
    ingredients: [
      { name: "Riz Carnaroli", qty: 320, unit: "g", tags: ["italian", "european"], rare: true, substitutes: ["Arborio"] },
      { name: "Bouillon de bœuf maison", qty: 1.2, unit: "L", tags: ["pantry"] },
      { name: "Safran iranien (filaments)", qty: 1, unit: "pincée", tags: ["spice"], rare: true },
      { name: "Moelle de bœuf", qty: 60, unit: "g", tags: ["butcher", "specialty"], substitutes: ["beurre supplémentaire"] },
      { name: "Échalote", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Vin blanc sec", qty: 100, unit: "ml", tags: ["specialty"] },
      { name: "Beurre froid", qty: 80, unit: "g", tags: ["supermarket"] },
      { name: "Parmigiano Reggiano", qty: 80, unit: "g", tags: ["italian", "european"], rare: true }
    ],
    steps: [
      { title: "Bouillon safran", instruction: "Chauffer le bouillon. Diluer le safran dans 100 ml chaud, infuser.", time: 10 },
      { title: "Soffritto", instruction: "Cocotte large : moelle + 30 g beurre, suer échalote ciselée fin 4 min.", time: 5 },
      { title: "Toaster riz", instruction: "Riz, 2 min en remuant : grains brillants, légèrement translucides aux bords.", time: 3 },
      { title: "Vin", instruction: "Verser vin, évaporer en remuant.", time: 2 },
      { title: "Bouillon louche par louche", instruction: "Ajouter bouillon chaud, louche par louche, en remuant. Quand absorbé, autre louche. 18 min total. Mi-cuisson : verser le bouillon safran.", time: 20 },
      { title: "Mantecatura", instruction: "Hors feu : beurre froid + parmesan. Battre vigoureusement à la cuiller bois 1 min : crème sans crème.", time: 2 },
      { title: "Repos + service", instruction: "Repos couvert 2 min. Servir vague, doit couler à l'assiette." }
    ]
  },

  {
    id: "pizza-margherita",
    title: "Pizza Margherita",
    origin: { country: "Italie", region: "Naples", flag: "🇮🇹" },
    auth: 94, duration: 1500, servings: 4, difficulty: 2,
    budget: { perPerson: 4.5, level: "$" },
    diets: ["vegetarian"], moods: ["wow", "comfort"],
    gradient: "linear-gradient(135deg, #C85A3A 0%, #5C8A3A 100%)",
    summary: "La napolitaine vraie : pâte fermentée 24h, San Marzano, mozzarella di bufala, basilic, huile d'olive.",
    story: "Créée en 1889 pour la reine Margherita (couleurs du drapeau italien : rouge/blanc/vert). Certifiée STG par l'UE. Pâte fermentée 24-72h, four à 450 °C+, cuisson 90 secondes. À la maison : pierre de cuisson + four max + grill.",
    validator: { name: "Mariella Conte", role: "Cheffe · Don Angie", city: "West Village, NY" },
    category: "pain", allergens: ["gluten", "lait"],
    ingredients: [
      { name: "Farine 00", qty: 500, unit: "g", tags: ["italian", "european", "pantry"], rare: true },
      { name: "Eau", qty: 320, unit: "ml", tags: ["pantry"] },
      { name: "Levure boulangère sèche", qty: 2, unit: "g", tags: ["pantry"] },
      { name: "Sel", qty: 12, unit: "g", tags: ["pantry"] },
      { name: "Tomates San Marzano DOP en boîte", qty: 400, unit: "g", tags: ["italian", "european"], rare: true, substitutes: ["tomates Roma de qualité"] },
      { name: "Mozzarella di bufala", qty: 250, unit: "g", tags: ["italian", "european"], rare: true, substitutes: ["fior di latte fior di latte"] },
      { name: "Basilic frais", qty: 1, unit: "botte", tags: ["produce", "supermarket"] },
      { name: "Huile d'olive vierge extra", qty: 4, unit: "c.s.", tags: ["italian"] },
      { name: "Sel + poivre noir", qty: 1, unit: "qsp", tags: ["pantry"] }
    ],
    steps: [
      { title: "Pâte (la veille)", instruction: "Délayer levure dans eau. Mélanger farine + sel. Verser eau, pétrir 12 min jusqu'à lisse-élastique. Pousse 2 h température ambiante puis 24-48h frigo.", time: 25 },
      { title: "Façonner", instruction: "Sortir 2h avant. Diviser en 4 pâtons 200 g, bouler. Pousse 1h dernière.", time: 10 },
      { title: "Sauce", instruction: "Écraser tomates à la main + sel + filet d'huile. Pas de cuisson (cuit sur la pizza).", time: 3 },
      { title: "Étaler", instruction: "Aux mains seulement (pas de rouleau), étaler du centre vers l'extérieur. Bord plus épais (cornicione).", time: 5 },
      { title: "Garnir + cuire", instruction: "Sauce fine. Quartiers de mozzarella + basilic + huile. Pierre de four à 280-300 °C, position haute, 7-9 min.", time: 11 }
    ]
  },

  // ── FRANCE ────────────────────────────────────────────
  {
    id: "coq-au-vin",
    title: "Coq au Vin",
    origin: { country: "France", region: "Bourgogne", flag: "🇫🇷" },
    auth: 92, duration: 240, servings: 6, difficulty: 2,
    budget: { perPerson: 8.5, level: "$$" },
    diets: ["dairy-free"], moods: ["comfort", "festive", "wow"],
    gradient: "linear-gradient(135deg, #15211A 0%, #C85A3A 100%)",
    summary: "Coq mariné au vin rouge bourguignon, lardons, oignons grelot, champignons, sauce réduite-liée.",
    story: "Plat-monument bourguignon. Doit utiliser un VRAI coq (vieux, ferme, longue cuisson) — à défaut une grosse poularde. Marinade 24 h dans le vin (un Pinot Noir). Sauce flambée au Marc de Bourgogne. Servir avec des pommes vapeur.",
    validator: { name: "Marc Forgeron", role: "Chef · Le Coucou", city: "Soho, NY" },
    category: "ragoût", allergens: ["gluten"],
    ingredients: [
      { name: "Coq découpé en 8 (ou poularde)", qty: 2200, unit: "g", tags: ["butcher", "specialty"] },
      { name: "Vin rouge Bourgogne (Pinot Noir)", qty: 750, unit: "ml", tags: ["specialty", "european"] },
      { name: "Lardons fumés", qty: 200, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Petits oignons grelot", qty: 250, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Champignons de Paris", qty: 250, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Carottes", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Oignon jaune", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Ail", qty: 4, unit: "gousses", tags: ["produce", "supermarket"] },
      { name: "Bouquet garni (thym, laurier, persil)", qty: 1, unit: "pièce", tags: ["produce", "pantry"] },
      { name: "Marc de Bourgogne (ou cognac)", qty: 50, unit: "ml", tags: ["specialty"] },
      { name: "Farine", qty: 30, unit: "g", tags: ["pantry"] },
      { name: "Beurre + huile", qty: 50, unit: "g", tags: ["supermarket"] },
      { name: "Sang de coq (optionnel)", qty: 100, unit: "ml", tags: ["butcher"], rare: true }
    ],
    steps: [
      { title: "Marinade 24h", instruction: "Coq + vin + carottes en rondelles + oignon + ail + bouquet garni. 24 h frigo, retourner à mi-temps.", time: 1440 },
      { title: "Égoutter + saisir", instruction: "Sécher coq parfaitement. Saisir morceaux dans beurre + huile, 8 min jusqu'à dorés. Réserver.", time: 12 },
      { title: "Lardons + oignons", instruction: "Dorer lardons + oignons grelot, 6 min.", time: 8 },
      { title: "Flamber", instruction: "Remettre coq, verser marc, flamber.", time: 2 },
      { title: "Mijoter", instruction: "Saupoudrer farine, mélanger 1 min. Verser marinade filtrée + bouillon. Frémir 2 h très doux.", time: 125 },
      { title: "Champignons + finition", instruction: "Sauter champignons à part, ajouter 20 min avant la fin. Optionnel : lier avec sang de coq.", time: 22 }
    ]
  },

  {
    id: "boeuf-bourguignon",
    title: "Bœuf Bourguignon",
    origin: { country: "France", region: "Bourgogne", flag: "🇫🇷" },
    auth: 93, duration: 240, servings: 6, difficulty: 2,
    budget: { perPerson: 9.0, level: "$$" },
    diets: ["dairy-free"], moods: ["comfort", "festive"],
    gradient: "linear-gradient(135deg, #15211A 0%, #C85A3A 100%)",
    summary: "Bœuf mijoté longuement au vin rouge, lardons, oignons grelot, champignons. Plat-roi bourguignon.",
    story: "Frère du coq au vin, en version bœuf. Paleron ou jumeau — coupes nerveuses qui fondent. Codifié par Escoffier puis Julia Child. Servir avec pommes vapeur ou pâtes fraîches.",
    validator: { name: "Marc Forgeron", role: "Chef · Le Coucou", city: "Soho, NY" },
    category: "ragoût", allergens: ["gluten"],
    ingredients: [
      { name: "Paleron de bœuf en gros cubes", qty: 1500, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Vin rouge Bourgogne", qty: 750, unit: "ml", tags: ["specialty", "european"] },
      { name: "Lardons fumés", qty: 200, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Oignons grelot", qty: 300, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Champignons de Paris", qty: 300, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Carottes", qty: 3, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Ail", qty: 4, unit: "gousses", tags: ["produce", "supermarket"] },
      { name: "Bouquet garni", qty: 1, unit: "pièce", tags: ["produce", "pantry"] },
      { name: "Concentré de tomate", qty: 1, unit: "c.s.", tags: ["pantry"] },
      { name: "Farine", qty: 30, unit: "g", tags: ["pantry"] },
      { name: "Beurre", qty: 30, unit: "g", tags: ["supermarket"] },
      { name: "Huile", qty: 3, unit: "c.s.", tags: ["pantry"] }
    ],
    steps: [
      { title: "Marinade", instruction: "Bœuf + vin + carottes + bouquet garni + ail. 12 h.", time: 720 },
      { title: "Saisir bœuf", instruction: "Sécher, saisir dans cocotte 8 min. Réserver.", time: 10 },
      { title: "Lardons + aromates", instruction: "Lardons + carottes égouttées + oignons, 6 min.", time: 8 },
      { title: "Roux + mouillage", instruction: "Remettre bœuf, farine, 2 min. Marinade vin + concentré + bouillon couvrant.", time: 5 },
      { title: "Mijoter", instruction: "Frémissement très doux 2h30 couvert. Sauce doit napper la cuiller.", time: 152 },
      { title: "Garniture", instruction: "Glacer oignons grelot et champignons à part, ajouter 15 min avant la fin.", time: 17 }
    ]
  },

  {
    id: "ratatouille",
    title: "Ratatouille niçoise",
    origin: { country: "France", region: "Nice", flag: "🇫🇷" },
    auth: 91, duration: 90, servings: 6, difficulty: 1,
    budget: { perPerson: 3.5, level: "$" },
    diets: ["vegan", "vegetarian", "dairy-free", "gluten-free"], moods: ["healthy", "comfort"],
    gradient: "linear-gradient(135deg, #C85A3A 0%, #5C8A3A 100%)",
    summary: "Légumes méditerranéens cuits SÉPARÉMENT puis réunis : aubergine, courgette, poivron, tomate, oignon, herbes de Provence.",
    story: "Recette niçoise traditionnelle. RÈGLE D'OR : chaque légume cuit séparément dans l'huile d'olive (sinon bouillie sans goût). Réunis en finale 15 min pour mariage des saveurs. Meilleur le lendemain.",
    validator: { name: "Marc Forgeron", role: "Chef · Le Coucou", city: "Soho, NY" },
    category: "ragoût", allergens: [],
    ingredients: [
      { name: "Aubergines", qty: 600, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Courgettes", qty: 600, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Poivrons (rouge + jaune)", qty: 4, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Tomates Roma mûres", qty: 800, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Oignons jaunes", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Ail", qty: 6, unit: "gousses", tags: ["produce", "supermarket"] },
      { name: "Herbes de Provence (thym + romarin + origan + sarriette)", qty: 1, unit: "lot", tags: ["produce", "pantry"] },
      { name: "Basilic frais", qty: 1, unit: "botte", tags: ["produce", "supermarket"] },
      { name: "Huile d'olive vierge", qty: 200, unit: "ml", tags: ["pantry", "european"] },
      { name: "Sel + poivre", qty: 1, unit: "qsp", tags: ["pantry"] }
    ],
    steps: [
      { title: "Préparer légumes", instruction: "Tous en cubes 2 cm réguliers. Saler aubergines 15 min, éponger.", time: 18 },
      { title: "Cuire séparément", instruction: "4 poêles ou successivement : aubergine 10 min, courgette 8 min, poivrons 12 min, oignons 10 min — chacun avec huile + sel.", time: 40 },
      { title: "Tomates", instruction: "Concasser, sauter avec ail + herbes 12 min jusqu'à confiturée.", time: 14 },
      { title: "Réunir", instruction: "Tout mélanger en cocotte, herbes ficelées, mijoter à découvert 15 min.", time: 17 },
      { title: "Finition", instruction: "Hors feu : basilic ciselé + huile crue. Servir tiède ou à température, accompagne tout." }
    ]
  },

  {
    id: "quiche-lorraine",
    title: "Quiche Lorraine",
    origin: { country: "France", region: "Lorraine", flag: "🇫🇷" },
    auth: 89, duration: 90, servings: 6, difficulty: 2,
    budget: { perPerson: 4.5, level: "$" },
    diets: [], moods: ["comfort", "quick"],
    gradient: "linear-gradient(135deg, #D9A441 0%, #F5F7EE 100%)",
    summary: "Pâte brisée, lardons, appareil œufs-crème-lait. La vraie de Lorraine sans fromage.",
    story: "RÈGLE non-négociable : la quiche Lorraine ORIGINELLE ne contient ni fromage, ni oignon. Lardons, œufs, crème, lait, muscade, point. Tous les ajouts sont des dérivés régionaux. Pâte brisée, jamais feuilletée.",
    validator: { name: "Marc Forgeron", role: "Chef · Le Coucou", city: "Soho, NY" },
    category: "brunch", allergens: ["gluten", "œufs", "lait"],
    ingredients: [
      { name: "Farine T55", qty: 250, unit: "g", tags: ["pantry"] },
      { name: "Beurre froid", qty: 125, unit: "g", tags: ["supermarket"] },
      { name: "Eau froide", qty: 60, unit: "ml", tags: ["pantry"] },
      { name: "Sel", qty: 5, unit: "g", tags: ["pantry"] },
      { name: "Lardons fumés", qty: 250, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Œufs", qty: 4, unit: "pièce", tags: ["supermarket"] },
      { name: "Crème fraîche épaisse", qty: 250, unit: "g", tags: ["supermarket"] },
      { name: "Lait entier", qty: 100, unit: "ml", tags: ["supermarket"] },
      { name: "Muscade râpée", qty: 1, unit: "pincée", tags: ["pantry"] },
      { name: "Poivre noir", qty: 1, unit: "qsp", tags: ["pantry"] }
    ],
    steps: [
      { title: "Pâte brisée", instruction: "Sabler farine + beurre froid en dés + sel à la main. Eau froide, fraiser sans pétrir. Boule, repos 30 min frigo.", time: 38 },
      { title: "Foncer moule", instruction: "Étaler 3 mm. Foncer moule à tarte 24 cm. Piquer fond. Précuire 12 min four 180 °C avec billes.", time: 18 },
      { title: "Lardons", instruction: "Sauter à sec 5 min, sans dorer trop. Égoutter sur papier.", time: 6 },
      { title: "Appareil", instruction: "Battre œufs + crème + lait + muscade + poivre (pas de sel : lardons salent).", time: 3 },
      { title: "Garnir + cuire", instruction: "Lardons sur le fond, verser appareil. Four 180 °C, 35 min jusqu'à dorée et juste prise.", time: 38 }
    ]
  },

  // ── ESPAGNE ───────────────────────────────────────────
  {
    id: "paella-valenciana",
    title: "Paella Valenciana",
    origin: { country: "Espagne", region: "Valence", flag: "🇪🇸" },
    auth: 94, duration: 75, servings: 6, difficulty: 3,
    budget: { perPerson: 8.0, level: "$$" },
    diets: ["dairy-free", "halal-friendly"], moods: ["festive", "wow"],
    gradient: "linear-gradient(135deg, #D9A441 0%, #C85A3A 60%, #5C8A3A 100%)",
    summary: "La VRAIE paella : poulet + lapin + haricots verts + safran + romarin. Le socarrat (croûte du fond) est l'objectif.",
    story: "Plat-roi de Valence, codifié à Albufera. La vraie a 10 ingrédients TOTAL, pas plus. Pas de chorizo (sacrilège), pas de fruits de mer (c'est une paella mixta différente). Le SOCARRAT (croûte caramélisée du fond) est le trophée du paellero.",
    validator: { name: "Carmen del Río", role: "Cheffe · Despaña Bar", city: "Soho, NY" },
    category: "bol", allergens: [],
    ingredients: [
      { name: "Riz Bomba (rond espagnol)", qty: 500, unit: "g", tags: ["spanish", "european"], rare: true, substitutes: ["riz Calasparra ou Arborio (acceptable)"] },
      { name: "Poulet en morceaux", qty: 600, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Lapin en morceaux", qty: 500, unit: "g", tags: ["butcher", "specialty"], substitutes: ["doubler le poulet"] },
      { name: "Haricots verts plats (ferraduras)", qty: 200, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Haricots blancs (garrofó)", qty: 100, unit: "g", tags: ["spanish", "european"], rare: true, substitutes: ["lima beans"] },
      { name: "Tomate mûre râpée", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Safran", qty: 1, unit: "pincée", tags: ["spice"], rare: true },
      { name: "Paprika doux espagnol (pimentón)", qty: 1, unit: "c.s.", tags: ["spanish", "european"] },
      { name: "Romarin frais", qty: 1, unit: "branche", tags: ["produce", "supermarket"] },
      { name: "Bouillon de poulet maison", qty: 1.4, unit: "L", tags: ["pantry"] },
      { name: "Huile d'olive", qty: 100, unit: "ml", tags: ["pantry", "european"] },
      { name: "Citron (service)", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] }
    ],
    steps: [
      { title: "Préparer paellera", instruction: "Poêle large à fond plat. Huile + sel, chauffer.", time: 4 },
      { title: "Saisir viandes", instruction: "Dorer poulet + lapin sur tous côtés, 15 min. Pousser au bord.", time: 16 },
      { title: "Légumes", instruction: "Haricots verts au centre, 5 min. Tomate râpée + paprika + safran trempé, 3 min.", time: 9 },
      { title: "Riz", instruction: "Étaler riz en couche uniforme. Verser bouillon BOUILLANT (juste à hauteur du riz, repère du rivet). Sel.", time: 3 },
      { title: "Cuisson", instruction: "Feu vif 10 min, baisser à doux 8 min. NE PAS REMUER. Dernières 2 min : feu vif pour socarrat.", time: 22 },
      { title: "Repos + service", instruction: "Couvrir torchon humide 5 min. Servir directement dans la paellera. Citron à part.", time: 6 }
    ]
  },

  {
    id: "tortilla-espanola",
    title: "Tortilla Española",
    origin: { country: "Espagne", region: "partout", flag: "🇪🇸" },
    auth: 93, duration: 45, servings: 4, difficulty: 2,
    budget: { perPerson: 2.8, level: "$" },
    diets: ["vegetarian", "gluten-free"], moods: ["comfort", "quick"],
    gradient: "linear-gradient(135deg, #D9A441 0%, #C85A3A 100%)",
    summary: "Omelette épaisse aux pommes de terre fondantes confites dans l'huile d'olive. Cœur baveux ou cuit ?",
    story: "Plat-totem espagnol. La grande division : con cebolla (avec oignon, school madrid) ou sin cebolla (sans, school franquiste). Cœur baveux à la barre, cuit à la maison. Pommes de terre confites dans bain d'huile (pas frites).",
    validator: { name: "Carmen del Río", role: "Cheffe · Despaña Bar", city: "Soho, NY" },
    category: "brunch", allergens: ["œufs"],
    ingredients: [
      { name: "Pommes de terre Yukon Gold", qty: 600, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Oignon jaune", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Œufs frais", qty: 6, unit: "pièce", tags: ["supermarket"] },
      { name: "Huile d'olive vierge", qty: 400, unit: "ml", tags: ["pantry", "european"] },
      { name: "Sel marin", qty: 1, unit: "qsp", tags: ["pantry"] }
    ],
    steps: [
      { title: "Préparer", instruction: "Pommes de terre en lamelles 3 mm. Oignon en lamelles fines.", time: 6 },
      { title: "Confire", instruction: "Poêle 24 cm : huile à 140 °C (pas plus). Pommes de terre + oignon + sel, confire 25 min en remuant doux. Doivent être tendres SANS dorer.", time: 28 },
      { title: "Égoutter + œufs", instruction: "Égoutter à fond (réserver huile). Battre œufs + sel + ajouter pommes de terre + oignon. Reposer 5 min.", time: 7 },
      { title: "Cuisson", instruction: "Poêle huilée bien chaude. Verser, baisser feu, 4 min : bord pris, centre baveux.", time: 5 },
      { title: "Retourner", instruction: "Couvrir d'une assiette, retourner, glisser dans poêle. 3 min de l'autre côté pour cœur baveux, 5 min pour cœur cuit.", time: 5 }
    ]
  },

  {
    id: "gazpacho",
    title: "Gazpacho andalou",
    origin: { country: "Espagne", region: "Andalousie", flag: "🇪🇸" },
    auth: 92, duration: 30, servings: 4, difficulty: 1,
    budget: { perPerson: 2.5, level: "$" },
    diets: ["vegan", "vegetarian", "dairy-free"], moods: ["healthy", "quick"],
    gradient: "linear-gradient(135deg, #C85A3A 0%, #D9A441 100%)",
    summary: "Soupe froide andalouse : tomates, concombre, poivron, ail, pain rassis, vinaigre xérès.",
    story: "Plat anti-canicule séville. La vraie texture est SOYEUSE, mixée puis filtrée. Pain rassis (mie blanche) trempé pour la liaison naturelle. Servir glacé avec brunoise de garniture en surface.",
    validator: { name: "Carmen del Río", role: "Cheffe · Despaña Bar", city: "Soho, NY" },
    category: "soupe", allergens: ["gluten"],
    ingredients: [
      { name: "Tomates Roma TRÈS mûres", qty: 1500, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Concombre", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Poivron vert italien", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Pain de mie rassis (mie blanche)", qty: 80, unit: "g", tags: ["pantry"] },
      { name: "Ail", qty: 1, unit: "gousse", tags: ["produce", "supermarket"] },
      { name: "Vinaigre de xérès", qty: 30, unit: "ml", tags: ["spanish", "european"], rare: true },
      { name: "Huile d'olive arbequina", qty: 80, unit: "ml", tags: ["spanish", "european"], rare: true },
      { name: "Sel marin", qty: 1, unit: "c.c.", tags: ["pantry"] },
      { name: "Garniture : brunoise concombre + tomate + poivron + œuf dur + jambon serrano", qty: 1, unit: "lot", tags: ["produce", "spanish"] }
    ],
    steps: [
      { title: "Préparer", instruction: "Tomates concassées (peler facultatif), concombre épluché, poivron sans pépins.", time: 8 },
      { title: "Tremper pain", instruction: "Émietter pain dans vinaigre + 100 ml d'eau, 10 min.", time: 10 },
      { title: "Mixer", instruction: "Mixer tomates + concombre + poivron + ail + pain trempé. Verser huile en filet (émulsion). Sel.", time: 5 },
      { title: "Filtrer", instruction: "Passer au tamis fin pour texture velours.", time: 4 },
      { title: "Repos + service", instruction: "2 h frigo minimum. Servir bien froid, brunoise + filet d'huile.", time: 122 }
    ]
  },

  // ── GRÈCE ─────────────────────────────────────────────
  {
    id: "moussaka",
    title: "Moussaka",
    origin: { country: "Grèce", region: "Athènes, Grèce", flag: "🇬🇷" },
    auth: 91, duration: 150, servings: 8, difficulty: 3,
    budget: { perPerson: 6.5, level: "$$" },
    diets: ["halal-friendly"], moods: ["comfort", "festive"],
    gradient: "linear-gradient(135deg, #D9A441 0%, #C85A3A 100%)",
    summary: "Couches d'aubergines + ragoût d'agneau + béchamel gratinée à l'œuf. Le shepherd's pie grec.",
    story: "Codifiée par le chef Tselementes au début XXe (avant : version ottomane sans béchamel). Aubergines préalablement frites pour la profondeur. Béchamel doit dorer-craqueler en surface.",
    validator: { name: "Maria Papadopoulou", role: "Cheffe · Avra Estiatorio", city: "Midtown, NY" },
    category: "ragoût", allergens: ["gluten", "lait", "œufs"],
    ingredients: [
      { name: "Aubergines", qty: 1500, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Agneau haché", qty: 700, unit: "g", tags: ["butcher", "middle-east"] },
      { name: "Tomates concassées", qty: 400, unit: "g", tags: ["pantry"] },
      { name: "Oignons", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Ail", qty: 4, unit: "gousses", tags: ["produce", "supermarket"] },
      { name: "Vin rouge", qty: 100, unit: "ml", tags: ["specialty"] },
      { name: "Cannelle + clous girofle + origan", qty: 1, unit: "lot", tags: ["pantry"] },
      { name: "Beurre", qty: 80, unit: "g", tags: ["supermarket"] },
      { name: "Farine", qty: 80, unit: "g", tags: ["pantry"] },
      { name: "Lait entier", qty: 800, unit: "ml", tags: ["supermarket"] },
      { name: "Œufs", qty: 2, unit: "pièce", tags: ["supermarket"] },
      { name: "Kefalotyri (ou parmesan) râpé", qty: 100, unit: "g", tags: ["middle-east", "european"], rare: true, substitutes: ["parmesan + pecorino"] },
      { name: "Muscade râpée", qty: 1, unit: "pincée", tags: ["pantry"] },
      { name: "Huile d'olive", qty: 100, unit: "ml", tags: ["pantry"] }
    ],
    steps: [
      { title: "Aubergines", instruction: "Tranches 1 cm. Saler 30 min, éponger. Frire dans huile par lots, 2 min par face. Égoutter.", time: 50 },
      { title: "Ragoût", instruction: "Suer oignons 8 min. Agneau, dorer 10 min. Ail + épices, 1 min. Vin, réduire. Tomate, mijoter 30 min.", time: 50 },
      { title: "Béchamel", instruction: "Fondre beurre, farine, cuire 2 min. Lait chaud peu à peu, fouetter, 8 min jusqu'à nappante. Hors feu : muscade, sel, jaunes d'œuf, fromage.", time: 12 },
      { title: "Montage", instruction: "Plat : couche aubergines, ragoût, aubergines, ragoût, aubergines. Béchamel généreuse dessus.", time: 6 },
      { title: "Cuisson", instruction: "Four 180 °C, 45 min jusqu'à doré-bronzé en surface. Repos 15 min avant de couper (sinon s'effondre).", time: 60 }
    ]
  },

  {
    id: "souvlaki-pita",
    title: "Souvlaki Pita",
    origin: { country: "Grèce", region: "Athènes, Grèce", flag: "🇬🇷" },
    auth: 90, duration: 60, servings: 4, difficulty: 1,
    budget: { perPerson: 5.5, level: "$$" },
    diets: ["halal-friendly"], moods: ["street", "quick"],
    gradient: "linear-gradient(135deg, #C85A3A 0%, #D9A441 100%)",
    summary: "Brochettes de porc grillées + tzatziki + frites + tomate, le tout enroulé dans une pita.",
    story: "Street food athénien depuis l'Antiquité. Marinade origan-citron-huile d'olive non négociable. La pita grecque (pas levantine) est plus moelleuse, sans poche. Frites DANS le wrap = signature grecque (vs falafel au Liban).",
    validator: { name: "Maria Papadopoulou", role: "Cheffe · Avra Estiatorio", city: "Midtown, NY" },
    category: "sandwich", allergens: ["gluten", "lait"],
    ingredients: [
      { name: "Échine de porc en cubes 3 cm", qty: 700, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Origan séché grec", qty: 2, unit: "c.s.", tags: ["middle-east", "european"] },
      { name: "Citrons", qty: 3, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Huile d'olive", qty: 80, unit: "ml", tags: ["european"] },
      { name: "Ail", qty: 4, unit: "gousses", tags: ["produce", "supermarket"] },
      { name: "Yaourt grec", qty: 400, unit: "g", tags: ["middle-east", "supermarket"] },
      { name: "Concombre", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Aneth + menthe (tzatziki)", qty: 1, unit: "lot", tags: ["produce"] },
      { name: "Pita grecque", qty: 4, unit: "pièce", tags: ["middle-east"] },
      { name: "Tomate + oignon rouge", qty: 1, unit: "lot", tags: ["produce"] },
      { name: "Pommes de terre frites", qty: 400, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Pics en bois", qty: 8, unit: "pièce", tags: ["pantry"] }
    ],
    steps: [
      { title: "Marinade", instruction: "Origan + jus 2 citrons + huile + ail râpé + sel. Porc dedans, 4 h frigo.", time: 240 },
      { title: "Tzatziki", instruction: "Râper concombre, presser. Mélanger yaourt + concombre + ail râpé + huile + aneth + menthe + sel.", time: 8 },
      { title: "Frites", instruction: "Frire 8 min en deux bains.", time: 12 },
      { title: "Brochettes", instruction: "Monter porc sur pics. Plancha bien chaude, 3 min par face. Charbonner les bords.", time: 8 },
      { title: "Wrap", instruction: "Pita réchauffée. Tzatziki, tomate, oignon rouge, brochette défilée, frites au cœur. Rouler dans papier sulfurisé." }
    ]
  },

  // ── ALLEMAGNE ─────────────────────────────────────────
  {
    id: "wiener-schnitzel",
    title: "Wiener Schnitzel",
    origin: { country: "Autriche", region: "Vienne, Autriche", flag: "🇩🇪" },
    auth: 92, duration: 30, servings: 4, difficulty: 2,
    budget: { perPerson: 9.5, level: "$$$" },
    diets: [], moods: ["comfort", "festive"],
    gradient: "linear-gradient(135deg, #D9A441 0%, #C85A3A 100%)",
    summary: "Escalope de veau aplatie très fin, panée beurre fondu, frite éclair, citron, pommes persillées.",
    story: "Plat-emblème viennois. Le seul vrai porte le nom : escalope de VEAU (sinon c'est un Schnitzel Wiener Art). Aplatie 5 mm, panée chapelure de pain blanc, frite dans beurre clarifié vapeur — la croûte gondoulée caractéristique.",
    validator: { name: "Klaus Müller", role: "Chef · Café Sabarsky", city: "Upper East Side, NY" },
    category: "ragoût", allergens: ["gluten", "œufs", "lait"],
    ingredients: [
      { name: "Escalopes de veau (4)", qty: 600, unit: "g", tags: ["butcher", "specialty"] },
      { name: "Farine", qty: 100, unit: "g", tags: ["pantry"] },
      { name: "Œufs", qty: 3, unit: "pièce", tags: ["supermarket"] },
      { name: "Chapelure de pain blanc fine", qty: 200, unit: "g", tags: ["pantry"] },
      { name: "Beurre clarifié", qty: 250, unit: "g", tags: ["supermarket"] },
      { name: "Citron", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Câpres + anchois (service)", qty: 1, unit: "lot", tags: ["pantry"] },
      { name: "Persil plat", qty: 0.5, unit: "botte", tags: ["produce"] },
      { name: "Pommes de terre nouvelles", qty: 600, unit: "g", tags: ["produce", "supermarket"] }
    ],
    steps: [
      { title: "Aplatir", instruction: "Escalopes entre 2 films plastique, aplatir au maillet jusqu'à 4-5 mm. Saler + poivrer.", time: 6 },
      { title: "Panure", instruction: "Farine → œuf battu → chapelure. NE PAS PRESSER la chapelure (ondule).", time: 5 },
      { title: "Pommes vapeur", instruction: "Cuire pommes 18 min. Sauter au beurre + persil.", time: 22 },
      { title: "Friture", instruction: "Beurre clarifié à 170 °C, profondeur 1,5 cm. Frire 60 sec par face en arrosant à la cuiller : panure doit gondoler.", time: 5 },
      { title: "Service", instruction: "Égoutter sur papier. Citron + capres + anchois + persil. Pommes à côté. Manger immédiatement." }
    ]
  },

  // ── POLOGNE ───────────────────────────────────────────
  {
    id: "pierogi-ruskie",
    title: "Pierogi Ruskie",
    origin: { country: "Pologne", region: "Cracovie", flag: "🇵🇱" },
    auth: 87, duration: 90, servings: 4, difficulty: 2,
    budget: { perPerson: 3.4, level: "$" },
    diets: ["vegetarian"], moods: ["comfort"],
    gradient: "linear-gradient(135deg, #F5F7EE 0%, #C85A3A 100%)",
    summary: "Raviolis polonais farcis pommes de terre & twaróg, sautés au beurre et lardons d'oignon.",
    story: "Malgré le nom (« russes »), recette est polonaise des régions de l'est. Le twaróg (fromage frais sec polonais) est non-négociable — la ricotta US est trop humide. Greenpoint reste le meilleur quartier pour les vrais twaróg fermiers.",
    validator: { name: "Agnieszka Kowalski", role: "Cuisinière · Karczma", city: "Greenpoint, Brooklyn" },
    category: "raviolis", allergens: ["gluten", "œufs", "lait"],
    ingredients: [
      { name: "Farine T55", qty: 500, unit: "g", tags: ["pantry", "supermarket"] },
      { name: "Œuf entier", qty: 1, unit: "pièce", tags: ["supermarket"] },
      { name: "Eau tiède", qty: 200, unit: "ml", tags: ["supermarket"] },
      { name: "Pommes de terre Yukon Gold", qty: 600, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Twaróg polonais (półtłusty)", qty: 300, unit: "g", tags: ["european", "specialty"], rare: true, substitutes: ["fromage farmer's cheese US"] },
      { name: "Oignon jaune", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Beurre doux", qty: 120, unit: "g", tags: ["supermarket"] },
      { name: "Crème aigre (śmietana)", qty: 200, unit: "g", tags: ["european", "supermarket"] },
      { name: "Sel et poivre", qty: 1, unit: "qsp", tags: ["pantry"] }
    ],
    steps: [
      { title: "Pâte", instruction: "Farine + sel + œuf + eau, pétrir 10 min jusqu'à lisse-élastique. Repos filmé 30 min.", time: 40 },
      { title: "Farce", instruction: "Cuire pommes de terre épluchées 25 min. Écraser à chaud, mélanger au twaróg, oignon revenu au beurre, sel-poivre. Refroidir.", time: 35 },
      { title: "Pliage", instruction: "Étaler pâte 2 mm. Découper cercles 8 cm. Garnir 1 c.c. de farce, plier en demi-lune, presser bord (humidifier si besoin).", time: 25 },
      { title: "Cuisson", instruction: "Eau bouillante salée : pierogi cuits quand ils remontent + 2 min.", time: 7 },
      { title: "Finition", instruction: "Faire fondre beurre, dorer oignon en lardons. Y faire sauter pierogi 2 min. Servir avec crème aigre." }
    ]
  },

  {
    id: "bigos",
    title: "Bigos (chasseur polonais)",
    origin: { country: "Pologne", region: "partout", flag: "🇵🇱" },
    auth: 92, duration: 240, servings: 8, difficulty: 1,
    budget: { perPerson: 5.5, level: "$" },
    diets: ["dairy-free"], moods: ["comfort", "festive"],
    gradient: "linear-gradient(135deg, #15211A 0%, #5C8A3A 100%)",
    summary: "Choucroute + chou frais + porc + saucisses fumées + champignons, mijoté plusieurs heures (encore meilleur réchauffé).",
    story: "Plat national polonais, des chasses royales. Doit cuire LONGTEMPS (4h+) et être réchauffé plusieurs fois sur 3 jours — devient meilleur. Vraies versions de campagne incluent aussi cervidés et lapin.",
    validator: { name: "Agnieszka Kowalski", role: "Cuisinière · Karczma", city: "Greenpoint, Brooklyn" },
    category: "ragoût", allergens: [],
    ingredients: [
      { name: "Choucroute crue", qty: 800, unit: "g", tags: ["european", "supermarket"] },
      { name: "Chou blanc frais", qty: 500, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Échine de porc en cubes", qty: 500, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Kielbasa fumée polonaise", qty: 300, unit: "g", tags: ["european", "specialty"], rare: true, substitutes: ["chorizo fumé ou andouillette"] },
      { name: "Lard fumé", qty: 150, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Champignons séchés (cèpes ou bolets)", qty: 30, unit: "g", tags: ["pantry", "european"] },
      { name: "Oignons", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Tomates concassées", qty: 400, unit: "g", tags: ["pantry"] },
      { name: "Vin rouge", qty: 200, unit: "ml", tags: ["specialty"] },
      { name: "Pruneaux", qty: 100, unit: "g", tags: ["pantry"] },
      { name: "Laurier + grains poivre + baies de genièvre + carvi", qty: 1, unit: "lot", tags: ["pantry"] }
    ],
    steps: [
      { title: "Tremper champignons", instruction: "Eau tiède 30 min.", time: 32 },
      { title: "Saisir viandes", instruction: "Cocotte : lard rendu, dorer porc 8 min, kielbasa en rondelles 4 min. Réserver.", time: 14 },
      { title: "Oignons", instruction: "Suer 8 min dans le gras.", time: 9 },
      { title: "Réunion", instruction: "Choucroute pressée + chou fraîchement coupé + viandes + champignons + leur eau filtrée + tomates + vin + pruneaux + épices entières. Couvrir d'eau si besoin.", time: 8 },
      { title: "Mijoter", instruction: "Frémissement 3h, remuer occasionnellement. Plus c'est long, mieux c'est.", time: 180 },
      { title: "Service", instruction: "Pain de seigle, vodka glacée. Encore meilleur réchauffé 2 jours après." }
    ]
  },

  // ── GÉORGIE ──────────────────────────────────────────
  {
    id: "khachapuri-adjarian",
    title: "Khachapuri Adjarian",
    origin: { country: "Géorgie", region: "Adjarie", flag: "🇬🇪" },
    auth: 95, duration: 90, servings: 4, difficulty: 2,
    budget: { perPerson: 5.5, level: "$" },
    diets: ["vegetarian"], moods: ["comfort", "wow", "festive"],
    gradient: "linear-gradient(135deg, #D9A441 0%, #F5F7EE 100%)",
    summary: "Bateau de pain levé garni de fromages géorgiens, œuf coulant, beurre.",
    story: "Originaire de Batoumi sur la mer Noire, sa forme de barque évoque les pêcheurs. Le mélange sulguni + imeruli donne le gras-élastique-fondant unique. À NYC, Cheese Stories (Sheepshead Bay) en importe.",
    validator: { name: "Tamuna Lobzhanidze", role: "Chef-propriétaire · Oda House", city: "East Village, NY" },
    category: "pain", allergens: ["gluten", "lait", "œufs"],
    ingredients: [
      { name: "Farine T55", qty: 500, unit: "g", tags: ["pantry", "supermarket"] },
      { name: "Levure boulangère sèche", qty: 7, unit: "g", tags: ["pantry", "supermarket"] },
      { name: "Lait entier", qty: 250, unit: "ml", tags: ["supermarket"] },
      { name: "Sulguni géorgien", qty: 250, unit: "g", tags: ["european", "specialty"], rare: true, substitutes: ["mozzarella low-moisture + feta (50/50)"] },
      { name: "Imeruli (ou fromage frais salé)", qty: 250, unit: "g", tags: ["european", "specialty"], rare: true, substitutes: ["feta crémeuse"] },
      { name: "Œufs entiers", qty: 4, unit: "pièce", tags: ["supermarket"] },
      { name: "Beurre doux", qty: 60, unit: "g", tags: ["supermarket"] },
      { name: "Sucre", qty: 10, unit: "g", tags: ["pantry"] },
      { name: "Sel fin", qty: 8, unit: "g", tags: ["pantry"] }
    ],
    steps: [
      { title: "Pâte", instruction: "Délayer levure + sucre dans lait tiède, 10 min. Mélanger farine + sel, ajouter lait, pétrir 10 min. Pousse 1h en boule.", time: 75 },
      { title: "Façonner barques", instruction: "Diviser en 4. Étaler en ovale. Rouler les bords vers l'intérieur en pinçant les pointes pour former le bateau.", time: 10 },
      { title: "Garnir", instruction: "Râper sulguni et émietter imeruli, mélanger. Garnir le creux généreusement.", time: 5 },
      { title: "Cuisson", instruction: "Four 230 °C, 12-14 min, jusqu'à fromage bouillonnant et croûte dorée.", time: 14 },
      { title: "Œuf + beurre", instruction: "Sortir, casser un œuf au centre, remettre 2 min : blanc juste pris. Ajouter une noix de beurre. Mélanger à table à la fourchette." }
    ]
  },

  {
    id: "khinkali",
    title: "Khinkali",
    origin: { country: "Géorgie", region: "Pshav-Khevsureti", flag: "🇬🇪" },
    auth: 93, duration: 100, servings: 4, difficulty: 3,
    budget: { perPerson: 5.0, level: "$" },
    diets: [], moods: ["wow", "festive"],
    gradient: "linear-gradient(135deg, #15211A 0%, #5C8A3A 100%)",
    summary: "Gros raviolis montagnards à la viande juteuse, à manger à la main par le chapeau.",
    story: "Né dans les villages d'altitude du Caucase, les khinkali se mangent debout au bar à khinkali. Le rituel : tenir par le chapeau (kudi), aspirer le bouillon, manger la viande, laisser le chapeau. Compter au moins 5 par personne pour démarrer.",
    validator: { name: "Tamuna Lobzhanidze", role: "Chef-propriétaire · Oda House", city: "East Village, NY" },
    category: "raviolis", allergens: ["gluten"],
    ingredients: [
      { name: "Farine T55", qty: 500, unit: "g", tags: ["pantry", "supermarket"] },
      { name: "Eau froide", qty: 200, unit: "ml", tags: ["pantry"] },
      { name: "Bœuf haché 20%", qty: 400, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Porc haché 20%", qty: 200, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Oignon jaune", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Bouillon de bœuf froid", qty: 200, unit: "ml", tags: ["pantry", "supermarket"] },
      { name: "Coriandre fraîche", qty: 1, unit: "botte", tags: ["produce", "supermarket"] },
      { name: "Kondari (sarriette géorgienne séchée)", qty: 1, unit: "c.c.", tags: ["european", "specialty"], rare: true, substitutes: ["thym + origan (50/50)"] },
      { name: "Ail", qty: 3, unit: "gousses", tags: ["produce", "supermarket"] },
      { name: "Poivre noir mignonnette", qty: 1, unit: "c.c.", tags: ["pantry"] }
    ],
    steps: [
      { title: "Pâte", instruction: "Farine + sel + eau froide, pétrir 12 min jusqu'à très lisse-élastique. Repos 30 min filmé.", time: 45 },
      { title: "Farce liquide", instruction: "Mélanger viandes hachées + oignon + ail râpés + coriandre + kondari + sel + poivre. AJOUTER bouillon froid petit à petit en mélangeant : la farce doit être presque liquide. C'est ça qui fait le bouillon à l'intérieur.", time: 10 },
      { title: "Façonner", instruction: "Étaler la pâte 2 mm, découper cercles 12 cm. 1 c.s. de farce au centre. Plisser le bord en éventail (vise 18 plis : c'est l'objectif des grands-mères). Pincer le sommet : c'est le chapeau.", time: 35 },
      { title: "Cuisson", instruction: "Eau bouillante salée, frémissement franc, 10 min. Remuer doux pour qu'ils ne collent pas.", time: 10 },
      { title: "Service", instruction: "Égoutter. Poivre fraîchement moulu généreux. À la main, par le chapeau, aspirer le bouillon avant de mordre." }
    ]
  },

  // ── ROYAUME-UNI ──────────────────────────────────────
  {
    id: "fish-and-chips",
    title: "Fish and Chips",
    origin: { country: "Royaume-Uni", region: "Londres, UK", flag: "🇬🇧" },
    auth: 88, duration: 50, servings: 4, difficulty: 2,
    budget: { perPerson: 8.5, level: "$$" },
    diets: ["pescatarian"], moods: ["comfort", "street"],
    gradient: "linear-gradient(135deg, #D9A441 0%, #5C8A3A 100%)",
    summary: "Cabillaud frit en pâte à la bière croustillante, frites épaisses, sauce tartare, vinaigre de malt.",
    story: "Plat-national britannique du XIXe (immigration juive + convergence ouvrière). Pâte à la bière (lager froide) pour la légèreté. Frites coupées épaisses en deux bains. Vinaigre de malt arrosé direct = signature anglaise.",
    validator: { name: "Marc Forgeron", role: "Chef · Le Coucou", city: "Soho, NY" },
    category: "ragoût", allergens: ["gluten", "poisson"],
    ingredients: [
      { name: "Filets de cabillaud (épais)", qty: 800, unit: "g", tags: ["fish", "specialty"] },
      { name: "Pommes de terre Yukon Gold", qty: 1000, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Farine T55", qty: 200, unit: "g", tags: ["pantry"] },
      { name: "Bière lager froide", qty: 250, unit: "ml", tags: ["specialty"] },
      { name: "Levure chimique", qty: 1, unit: "c.c.", tags: ["pantry"] },
      { name: "Mayo + cornichons + câpres + estragon (sauce tartare)", qty: 1, unit: "lot", tags: ["pantry"] },
      { name: "Vinaigre de malt", qty: 100, unit: "ml", tags: ["european"], rare: true },
      { name: "Petits pois (mushy peas)", qty: 300, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Huile pour friture", qty: 1.5, unit: "L", tags: ["pantry"] }
    ],
    steps: [
      { title: "Frites", instruction: "Couper en bâtonnets épais. Premier bain à 140 °C, 8 min : doivent être tendres sans dorer. Égoutter.", time: 12 },
      { title: "Pâte à frire", instruction: "Mélanger farine + levure + sel + bière FROIDE. Texture crêpe épaisse. Reposer 20 min frigo.", time: 22 },
      { title: "Tartare", instruction: "Mélanger mayo + cornichons + câpres + estragon hachés.", time: 4 },
      { title: "Mushy peas", instruction: "Petits pois cuits, écraser grossier + beurre + sel + menthe.", time: 8 },
      { title: "Friture poisson", instruction: "Tremper filets dans pâte, frire à 180 °C, 5 min jusqu'à doré-bronze.", time: 6 },
      { title: "Frites finition", instruction: "Second bain à 190 °C, 3 min : doré-croustillant. Sel.", time: 4 },
      { title: "Service", instruction: "Tout dans une assiette. Citron, vinaigre de malt à arroser, tartare, mushy peas." }
    ]
  }
]);
