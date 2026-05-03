/* eatrail · v1.4 — recipes / se-asian
 * Cuisines couvertes : Vietnam, Thaïlande.
 */

window.EATRAIL_RECIPES = (window.EATRAIL_RECIPES || []).concat([

  // ── VIETNAM ────────────────────────────────────────────
  {
    id: "pho-bo",
    title: "Phở Bò",
    origin: { country: "Vietnam", region: "Hanoï", flag: "🇻🇳" },
    auth: 94, duration: 360, servings: 6, difficulty: 3,
    budget: { perPerson: 4.9, level: "$" },
    diets: ["dairy-free"], moods: ["comfort", "wow", "street"],
    gradient: "linear-gradient(135deg, #3F8B54 0%, #15211A 100%)",
    summary: "Soupe de nouilles de riz au bouillon de bœuf clarifié, parfumé aux épices torréfiées.",
    story: "Né au début du XXe siècle au Tonkin, le phở est l'âme du Vietnam. Le bouillon honnête se compte en heures, pas en cubes. Version Hanoï : claire, peu de garniture. Version Saigon : herbes, sauce hoisin, sriracha.",
    validator: { name: "Nguyễn Thi Mai", role: "Chef · Pho Bang", city: "Chinatown, NY" },
    category: "soupe", allergens: ["poisson", "soja"],
    ingredients: [
      { name: "Os à moelle de bœuf", qty: 2000, unit: "g", tags: ["butcher", "vietnamese", "asian"] },
      { name: "Jarret de bœuf", qty: 800, unit: "g", tags: ["butcher", "asian"] },
      { name: "Filet de bœuf (tranches fines)", qty: 400, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Nouilles de riz banh pho fraîches", qty: 600, unit: "g", tags: ["vietnamese", "asian"], rare: true, substitutes: ["nouilles de riz sèches (plus sec en bouche)"] },
      { name: "Gingembre frais (gros morceau)", qty: 80, unit: "g", tags: ["produce", "asian"] },
      { name: "Oignon jaune", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Anis étoilé", qty: 4, unit: "étoiles", tags: ["asian", "spice"], rare: true },
      { name: "Cannelle bâton", qty: 1, unit: "bâton", tags: ["pantry", "supermarket"] },
      { name: "Cardamome noire", qty: 2, unit: "gousses", tags: ["asian", "south-asian", "spice"], rare: true },
      { name: "Clous de girofle", qty: 6, unit: "pièce", tags: ["pantry", "spice"] },
      { name: "Nuoc mam (sauce poisson)", qty: 60, unit: "ml", tags: ["vietnamese", "asian"], rare: true },
      { name: "Sucre de canne jaune", qty: 30, unit: "g", tags: ["pantry"] },
      { name: "Coriandre fraîche, basilic thaï, menthe", qty: 1, unit: "lot", tags: ["produce", "asian", "vietnamese"] },
      { name: "Pousses de soja fraîches", qty: 200, unit: "g", tags: ["asian", "produce"] },
      { name: "Citron vert", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Piment oiseau", qty: 3, unit: "pièce", tags: ["asian", "produce"] }
    ],
    steps: [
      { title: "Blanchir les os", instruction: "Couvrir d'eau froide, bouillir 5 min, jeter, rincer. C'est le secret du bouillon clair.", time: 15 },
      { title: "Torréfier aromates", instruction: "Brûler oignon et gingembre coupés en deux à la flamme jusqu'à carbonisation des faces. Toaster les épices à sec 1 min.", time: 8 },
      { title: "Bouillon long", instruction: "Os + jarret + aromates + épices + 5L d'eau. Frémissement (jamais bouillon), 4h30. Écumer la première heure.", time: 270 },
      { title: "Filtrer + assaisonner", instruction: "Passer au chinois fin. Nuoc mam + sucre + sel à votre main. Effilocher le jarret.", time: 15 },
      { title: "Dressage", instruction: "Pocher nouilles 30 sec eau bouillante. Bols : nouilles, filet cru en lamelles, jarret, verser bouillon brûlant. Servir herbes, soja, citron, piment à part." }
    ]
  },

  {
    id: "banh-mi-thit",
    title: "Bánh Mì Thịt Nướng",
    origin: { country: "Vietnam", region: "Hô-Chi-Minh-Ville", flag: "🇻🇳" },
    auth: 88, duration: 50, servings: 4, difficulty: 2,
    budget: { perPerson: 4.6, level: "$" },
    diets: ["dairy-free"], moods: ["quick", "street"],
    gradient: "linear-gradient(135deg, #C85A3A 0%, #3F8B54 100%)",
    summary: "Sandwich vietnamien : baguette croustillante, porc grillé caramel, pickles, coriandre.",
    story: "Héritage colonial français + génie vietnamien. La baguette est unique : farine + farine de riz, mie aérienne, croûte fine. À NYC : Banh Mi Saigon Bakery (Chinatown) tient le pain de référence. Le porc se mange à toute heure, même au petit déjeuner.",
    validator: { name: "Trần Văn Hưng", role: "Boulanger · Banh Mi Saigon", city: "Chinatown, NY" },
    category: "sandwich", allergens: ["gluten", "œufs", "soja", "poisson"],
    ingredients: [
      { name: "Baguettes vietnamiennes (farine de riz)", qty: 4, unit: "pièce", tags: ["vietnamese", "asian", "specialty"], rare: true, substitutes: ["baguette française légère"] },
      { name: "Échine de porc", qty: 600, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Carottes", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Daikon (radis blanc)", qty: 1, unit: "pièce", tags: ["asian", "produce"], substitutes: ["radis rose"] },
      { name: "Coriandre fraîche", qty: 1, unit: "botte", tags: ["produce", "supermarket"] },
      { name: "Concombre", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Sauce soja", qty: 4, unit: "c.s.", tags: ["asian"] },
      { name: "Sucre de canne", qty: 60, unit: "g", tags: ["pantry"] },
      { name: "Sauce poisson", qty: 2, unit: "c.s.", tags: ["se-asian", "asian"] },
      { name: "Citronnelle (tige fraîche)", qty: 2, unit: "tige", tags: ["se-asian", "asian", "produce"], rare: true, substitutes: ["zeste de citron + gingembre"] },
      { name: "Ail", qty: 4, unit: "gousses", tags: ["produce", "supermarket"] },
      { name: "Pâté de campagne", qty: 100, unit: "g", tags: ["specialty", "supermarket"], substitutes: ["pâté de foie"] },
      { name: "Mayonnaise (Kewpie idéal)", qty: 80, unit: "g", tags: ["asian", "supermarket"] },
      { name: "Vinaigre de riz", qty: 100, unit: "ml", tags: ["asian"] }
    ],
    steps: [
      { title: "Mariner porc", instruction: "Mixer ail + citronnelle + soja + sauce poisson + sucre + huile. Tranches fines de porc, mariner 30 min.", time: 35 },
      { title: "Pickles do chua", instruction: "Julienne carotte + daikon. Saler 5 min, presser. Couvrir vinaigre + sucre + eau, 30 min.", time: 30 },
      { title: "Griller porc", instruction: "Plancha ou poêle bien chaude, 2 min par face : doit caraméliser.", time: 6 },
      { title: "Préparer baguettes", instruction: "Réchauffer 3 min four 200 °C. Trancher en deux, ne pas séparer.", time: 4 },
      { title: "Garnir", instruction: "Mayo, pâté, porc, pickles égouttés, concombre, coriandre. Pincée de poivre, trait sauce piment optionnel." }
    ]
  },

  {
    id: "bun-bo-hue",
    title: "Bún Bò Huế",
    origin: { country: "Vietnam", region: "Hué", flag: "🇻🇳" },
    auth: 92, duration: 240, servings: 6, difficulty: 3,
    budget: { perPerson: 5.5, level: "$$" },
    diets: ["dairy-free"], moods: ["spicy", "comfort", "wow"],
    gradient: "linear-gradient(135deg, #C85A3A 0%, #D9A441 100%)",
    summary: "Soupe de nouilles épaisse, bouillon citronnelle-piment, jarret + chair de crabe + boudin.",
    story: "Le pho de la cour impériale de Hué — plus complexe, plus piquant, plus parfumé. La pâte mam ruoc (crevettes fermentées) est non-négociable. Le boudin nature ou jambonneau cubique flotte dedans.",
    validator: { name: "Nguyễn Thi Mai", role: "Chef · Pho Bang", city: "Chinatown, NY" },
    category: "soupe", allergens: ["poisson", "crustacés"],
    ingredients: [
      { name: "Os à moelle de bœuf", qty: 1500, unit: "g", tags: ["butcher", "vietnamese", "asian"] },
      { name: "Jarret de bœuf", qty: 800, unit: "g", tags: ["butcher", "asian"] },
      { name: "Pieds de porc", qty: 500, unit: "g", tags: ["butcher", "asian"] },
      { name: "Nouilles de riz épaisses (bún bò)", qty: 600, unit: "g", tags: ["vietnamese", "asian"], rare: true },
      { name: "Citronnelle", qty: 5, unit: "tiges", tags: ["se-asian", "asian", "produce"], rare: true },
      { name: "Pâte de crevette fermentée (mam ruoc)", qty: 2, unit: "c.s.", tags: ["se-asian", "asian"], rare: true, substitutes: ["pâte d'anchois"] },
      { name: "Annatto huile (mau dieu)", qty: 3, unit: "c.s.", tags: ["se-asian", "asian"], rare: true },
      { name: "Échalotes", qty: 4, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Sauce poisson", qty: 80, unit: "ml", tags: ["se-asian", "asian"] },
      { name: "Sucre de palme", qty: 30, unit: "g", tags: ["se-asian", "asian"] },
      { name: "Boudin de porc", qty: 200, unit: "g", tags: ["butcher"] },
      { name: "Citron vert + herbes (basilic, perilla)", qty: 1, unit: "lot", tags: ["produce", "asian"] }
    ],
    steps: [
      { title: "Blanchir os", instruction: "5 min eau bouillante, jeter, rincer.", time: 12 },
      { title: "Bouillon", instruction: "Os + jarret + pieds + citronnelle écrasée + échalotes brûlées + 5L eau. Frémir 3h.", time: 180 },
      { title: "Pâte aromatique", instruction: "Mixer mam ruoc + annatto + sucre + sauce poisson. Verser dans le bouillon en fin.", time: 5 },
      { title: "Service", instruction: "Pocher nouilles 30 sec. Bols : nouilles, jarret tranché, boudin, bouillon brûlant. Herbes + citron à côté.", time: 8 }
    ]
  },

  {
    id: "goi-cuon",
    title: "Gỏi Cuốn (rouleaux d'été)",
    origin: { country: "Vietnam", region: "Sud", flag: "🇻🇳" },
    auth: 90, duration: 35, servings: 4, difficulty: 2,
    budget: { perPerson: 5.0, level: "$" },
    diets: ["dairy-free", "pescatarian"], moods: ["healthy", "quick"],
    gradient: "linear-gradient(135deg, #5C8A3A 0%, #F5F7EE 100%)",
    summary: "Rouleaux de papier de riz transparents : crevettes, vermicelles, herbes. Sauce cacahuète.",
    story: "Recette de Saigon. La signature : les rouleaux doivent être translucides, on doit voir le rose des crevettes à travers. La sauce cacahuète (tương đậu phộng) est l'accompagnement classique.",
    validator: { name: "Nguyễn Thi Mai", role: "Chef · Pho Bang", city: "Chinatown, NY" },
    category: "cru", allergens: ["crustacés", "arachides", "soja", "poisson"],
    ingredients: [
      { name: "Galettes de riz (16 cm)", qty: 12, unit: "pièce", tags: ["se-asian", "asian"], rare: true },
      { name: "Crevettes cuites décortiquées", qty: 24, unit: "pièce", tags: ["asian", "supermarket"] },
      { name: "Vermicelles de riz fines", qty: 200, unit: "g", tags: ["se-asian", "asian"] },
      { name: "Salade verte (laitue)", qty: 1, unit: "tête", tags: ["produce", "supermarket"] },
      { name: "Menthe + coriandre + basilic thaï", qty: 1, unit: "lot", tags: ["produce", "asian"] },
      { name: "Carotte julienne", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Beurre de cacahuète", qty: 100, unit: "g", tags: ["pantry", "asian"] },
      { name: "Sauce hoisin", qty: 80, unit: "ml", tags: ["asian"], rare: true },
      { name: "Lait de coco", qty: 60, unit: "ml", tags: ["se-asian", "asian"] },
      { name: "Citron vert", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] }
    ],
    steps: [
      { title: "Cuire vermicelles", instruction: "3 min eau bouillante, rincer froid, égoutter.", time: 5 },
      { title: "Mise en place", instruction: "Couper crevettes en deux longueur, herbes effeuillées, salade en lanières.", time: 8 },
      { title: "Sauce", instruction: "Mélanger cacahuète + hoisin + lait coco + citron + 60 ml eau jusqu'à crémeux.", time: 4 },
      { title: "Roulage", instruction: "Tremper galette 5 sec eau tiède. Étaler à plat. Garnir, replier les côtés, rouler serré. Servir avec la sauce.", time: 18 }
    ]
  },

  // ── THAÏLANDE ─────────────────────────────────────────
  {
    id: "pad-thai",
    title: "Pad Thai aux crevettes",
    origin: { country: "Thaïlande", region: "Bangkok", flag: "🇹🇭" },
    auth: 88, duration: 30, servings: 4, difficulty: 2,
    budget: { perPerson: 6.8, level: "$$" },
    diets: ["dairy-free", "pescatarian"], moods: ["quick", "street", "wow"],
    gradient: "linear-gradient(135deg, #D9A441 0%, #C85A3A 100%)",
    summary: "Nouilles de riz sautées, équilibre sucré-salé-acide-umami, crevettes et tofu.",
    story: "Inventé dans les années 40 dans le cadre d'une campagne nationaliste pour réduire la consommation de riz. La sauce honnête utilise du tamarin (pas du ketchup). Les nouilles sont sautées par petites portions au wok très chaud.",
    validator: { name: "Apinya Charoenpong", role: "Chef · Sripraphai", city: "Woodside, NY" },
    category: "nouilles", allergens: ["crustacés", "poisson", "soja", "œufs", "arachides"],
    ingredients: [
      { name: "Nouilles de riz sèches (largeur 5 mm)", qty: 400, unit: "g", tags: ["se-asian", "asian"] },
      { name: "Crevettes décortiquées 16/20", qty: 300, unit: "g", tags: ["asian", "supermarket"] },
      { name: "Tofu ferme pressé", qty: 200, unit: "g", tags: ["asian", "supermarket"] },
      { name: "Pulpe de tamarin", qty: 60, unit: "g", tags: ["se-asian", "asian"], rare: true, substitutes: ["concentré de tamarin (½ qté)"] },
      { name: "Sucre de palme", qty: 60, unit: "g", tags: ["se-asian", "asian"], rare: true, substitutes: ["sucre roux"] },
      { name: "Nuoc mam", qty: 60, unit: "ml", tags: ["se-asian", "asian"] },
      { name: "Œufs", qty: 2, unit: "pièce", tags: ["supermarket"] },
      { name: "Cacahuètes torréfiées", qty: 80, unit: "g", tags: ["pantry", "asian"] },
      { name: "Pousses de soja", qty: 200, unit: "g", tags: ["asian", "produce"] },
      { name: "Ciboule chinoise (gu chai)", qty: 100, unit: "g", tags: ["asian", "produce"], rare: true, substitutes: ["ciboulette + oignon vert"] },
      { name: "Échalotes", qty: 3, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Ail", qty: 4, unit: "gousses", tags: ["produce", "supermarket"] },
      { name: "Citron vert", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] }
    ],
    steps: [
      { title: "Sauce", instruction: "Faire fondre sucre de palme + tamarin + nuoc mam dans une casserole, 5 min. Goûter : doit être équilibré sucré-acide-salé.", time: 6 },
      { title: "Tremper nouilles", instruction: "Eau tiède 25 min, jusqu'à souples mais fermes. Égoutter.", time: 25 },
      { title: "Saisir tofu et crevettes", instruction: "Wok très chaud, huile, dorer tofu en cubes. Ajouter crevettes, 2 min. Réserver.", time: 5 },
      { title: "Sauter nouilles", instruction: "Échalotes + ail dans le wok 30 sec. Ajouter nouilles, sauce, sauter 2 min. Pousser sur le côté, casser œufs, brouiller, mélanger.", time: 5 },
      { title: "Finition", instruction: "Remettre tofu + crevettes, ciboule, pousses. 30 sec. Servir avec cacahuètes concassées et citron vert." }
    ]
  },

  {
    id: "khao-soi",
    title: "Khao Soi au poulet",
    origin: { country: "Thaïlande", region: "Chiang Mai", flag: "🇹🇭" },
    auth: 91, duration: 60, servings: 4, difficulty: 2,
    budget: { perPerson: 6.3, level: "$$" },
    diets: ["dairy-free"], moods: ["comfort", "spicy", "wow"],
    gradient: "linear-gradient(135deg, #D9A441 0%, #2D6940 100%)",
    summary: "Curry jaune crémeux du nord thaï, nouilles bouillies + nouilles frites en garniture.",
    story: "Influence birmane et yunnanaise — c'est le plat-signature de Chiang Mai. La pâte de curry maison a 12+ ingrédients. La double-texture nouilles (souples + croustillantes) est la signature. Servi avec moutarde marinée et échalote crue.",
    validator: { name: "Pailin Boonyarat", role: "Chef · Pailin's Kitchen", city: "Brooklyn, NY" },
    category: "soupe", allergens: ["gluten", "œufs", "poisson"],
    ingredients: [
      { name: "Cuisses de poulet", qty: 800, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Lait de coco entier", qty: 800, unit: "ml", tags: ["se-asian", "asian"] },
      { name: "Pâte de curry khao soi (ou rouge + curcuma)", qty: 80, unit: "g", tags: ["se-asian", "asian"], rare: true, substitutes: ["pâte curry rouge + 1 c.c. curcuma + 1 c.c. cardamome moulue"] },
      { name: "Nouilles aux œufs fraîches (style hokkien)", qty: 600, unit: "g", tags: ["asian"], substitutes: ["nouilles aux œufs sèches"] },
      { name: "Sauce poisson", qty: 60, unit: "ml", tags: ["se-asian", "asian"] },
      { name: "Sucre de palme", qty: 30, unit: "g", tags: ["se-asian", "asian"] },
      { name: "Bouillon de volaille", qty: 400, unit: "ml", tags: ["pantry", "supermarket"] },
      { name: "Échalotes", qty: 4, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Moutarde marinée chinoise", qty: 100, unit: "g", tags: ["asian"], rare: true, substitutes: ["choucroute (faute de mieux)"] },
      { name: "Citron vert", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Coriandre fraîche", qty: 1, unit: "botte", tags: ["produce", "supermarket"] },
      { name: "Huile végétale", qty: 200, unit: "ml", tags: ["pantry", "supermarket"] }
    ],
    steps: [
      { title: "Casser la coco", instruction: "Faire chauffer la crème de coco (le dessus de la boîte) jusqu'à séparation de l'huile, 5 min.", time: 6 },
      { title: "Curry", instruction: "Frire la pâte de curry dans l'huile de coco, 4 min. Ajouter poulet, dorer 3 min.", time: 8 },
      { title: "Mijoter", instruction: "Verser reste lait de coco + bouillon. Sauce poisson, sucre. Mijoter 30 min couvert.", time: 32 },
      { title: "Nouilles frites", instruction: "Frire 1/4 des nouilles en huile à 180 °C, 30 sec, doivent gonfler et brunir légèrement.", time: 5 },
      { title: "Cuire nouilles fraîches", instruction: "Bouillir 2 min, égoutter.", time: 3 },
      { title: "Dressage", instruction: "Bol : nouilles, curry au-dessus, garnir nouilles frites, échalote crue, citron vert, coriandre, moutarde marinée à côté." }
    ]
  },

  {
    id: "tom-yum-goong",
    title: "Tom Yum Goong",
    origin: { country: "Thaïlande", region: "Bangkok", flag: "🇹🇭" },
    auth: 93, duration: 35, servings: 4, difficulty: 2,
    budget: { perPerson: 7.2, level: "$$" },
    diets: ["dairy-free", "pescatarian"], moods: ["healthy", "spicy", "quick"],
    gradient: "linear-gradient(135deg, #C85A3A 0%, #5C8A3A 100%)",
    summary: "Soupe acide-épicée aux crevettes, citronnelle, galanga, kaffir et piments oiseaux.",
    story: "Soupe-emblème thaï. La trilogie aromatique citronnelle-galanga-kaffir est la signature. Version nam sai (claire) ou nam khon (avec lait de coco) selon la région.",
    validator: { name: "Apinya Charoenpong", role: "Chef · Sripraphai", city: "Woodside, NY" },
    category: "soupe", allergens: ["crustacés", "poisson"],
    ingredients: [
      { name: "Crevettes entières avec tête", qty: 16, unit: "pièce", tags: ["asian", "supermarket"] },
      { name: "Citronnelle", qty: 3, unit: "tiges", tags: ["se-asian", "asian", "produce"], rare: true },
      { name: "Galanga frais (en rondelles)", qty: 30, unit: "g", tags: ["se-asian", "asian", "produce"], rare: true, substitutes: ["gingembre (moins fleuri)"] },
      { name: "Feuilles de kaffir", qty: 6, unit: "pièce", tags: ["se-asian", "asian"], rare: true },
      { name: "Champignons de paille", qty: 200, unit: "g", tags: ["asian"], substitutes: ["champignons de Paris"] },
      { name: "Tomates cerises", qty: 12, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Pâte de chili thaï (nam prik pao)", qty: 2, unit: "c.s.", tags: ["se-asian", "asian"], rare: true },
      { name: "Sauce poisson", qty: 3, unit: "c.s.", tags: ["se-asian", "asian"] },
      { name: "Citron vert", qty: 3, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Piments oiseaux", qty: 3, unit: "pièce", tags: ["asian", "produce"] },
      { name: "Coriandre fraîche", qty: 1, unit: "botte", tags: ["produce", "supermarket"] }
    ],
    steps: [
      { title: "Bouillon", instruction: "1L d'eau + têtes de crevettes + citronnelle écrasée + galanga + kaffir, frémir 15 min. Filtrer.", time: 17 },
      { title: "Garniture", instruction: "Remettre bouillon. Champignons + tomates 3 min. Crevettes 90 sec : elles doivent rosir.", time: 5 },
      { title: "Assaisonnement", instruction: "Hors feu : nam prik pao, sauce poisson, jus de citron, piments écrasés. Goûter, équilibrer.", time: 3 },
      { title: "Service", instruction: "Verser brûlant dans bols. Coriandre. Riz blanc à part." }
    ]
  },

  {
    id: "som-tam",
    title: "Som Tam (papaye verte)",
    origin: { country: "Thaïlande", region: "Isan", flag: "🇹🇭" },
    auth: 91, duration: 20, servings: 4, difficulty: 1,
    budget: { perPerson: 4.5, level: "$" },
    diets: ["dairy-free", "pescatarian"], moods: ["healthy", "spicy", "quick"],
    gradient: "linear-gradient(135deg, #5C8A3A 0%, #D9A441 100%)",
    summary: "Salade pilonnée de papaye verte, citron vert, sauce poisson, piment, cacahuètes.",
    story: "Originaire du nord-est rural (Isan). Pilonée au mortier en bois — chaque coup libère le jus de la papaye. Doit être préparée juste avant service. Le krueng pao (mortier-pilon) est l'instrument-roi.",
    validator: { name: "Apinya Charoenpong", role: "Chef · Sripraphai", city: "Woodside, NY" },
    category: "cru", allergens: ["crustacés", "arachides", "poisson"],
    ingredients: [
      { name: "Papaye verte (râpée julienne)", qty: 400, unit: "g", tags: ["se-asian", "asian", "produce"], rare: true },
      { name: "Tomates cerises", qty: 8, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Haricots verts longs", qty: 100, unit: "g", tags: ["produce", "asian"] },
      { name: "Cacahuètes torréfiées", qty: 50, unit: "g", tags: ["pantry", "asian"] },
      { name: "Crevettes séchées", qty: 2, unit: "c.s.", tags: ["se-asian", "asian"], rare: true },
      { name: "Ail", qty: 2, unit: "gousses", tags: ["produce", "supermarket"] },
      { name: "Piments oiseaux", qty: 3, unit: "pièce", tags: ["asian", "produce"] },
      { name: "Sucre de palme", qty: 1, unit: "c.s.", tags: ["se-asian", "asian"] },
      { name: "Sauce poisson", qty: 3, unit: "c.s.", tags: ["se-asian", "asian"] },
      { name: "Citron vert", qty: 3, unit: "pièce", tags: ["produce", "supermarket"] }
    ],
    steps: [
      { title: "Au mortier", instruction: "Piler ail + piments + crevettes séchées en pâte grossière.", time: 3 },
      { title: "Légumes", instruction: "Ajouter haricots cassés, tomates fendues, sucre de palme. Piler doucement, écraser sans réduire.", time: 5 },
      { title: "Papaye + sauce", instruction: "Ajouter papaye + sauce poisson + jus de citron. Mélanger en pilant délicatement, le jus doit imprégner.", time: 5 },
      { title: "Service", instruction: "Servir immédiatement, garnir cacahuètes concassées." }
    ]
  },

  {
    id: "massaman-curry",
    title: "Massaman Curry",
    origin: { country: "Thaïlande", region: "Sud", flag: "🇹🇭" },
    auth: 89, duration: 90, servings: 4, difficulty: 2,
    budget: { perPerson: 7.0, level: "$$" },
    diets: ["dairy-free", "halal-friendly"], moods: ["comfort", "festive"],
    gradient: "linear-gradient(135deg, #D9A441 0%, #C85A3A 60%, #15211A 100%)",
    summary: "Curry doux d'influence persane-malaise, bœuf longtemps mijoté, cacahuètes, cardamome.",
    story: "Le seul curry thaï avec cardamome, cannelle, clou de girofle — héritage persan-malais via les marchands musulmans. Plus doux que les autres, plus parfumé. Souvent classé n°1 mondial dans les rankings food.",
    validator: { name: "Apinya Charoenpong", role: "Chef · Sripraphai", city: "Woodside, NY" },
    category: "curry", allergens: ["arachides", "poisson"],
    ingredients: [
      { name: "Joue ou paleron de bœuf", qty: 800, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Lait de coco entier", qty: 800, unit: "ml", tags: ["se-asian", "asian"] },
      { name: "Pâte de curry massaman", qty: 80, unit: "g", tags: ["se-asian", "asian"], rare: true },
      { name: "Pommes de terre nouvelles", qty: 400, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Cacahuètes torréfiées", qty: 100, unit: "g", tags: ["pantry", "asian"] },
      { name: "Cardamome verte", qty: 4, unit: "gousses", tags: ["south-asian", "spice"] },
      { name: "Cannelle bâton", qty: 1, unit: "pièce", tags: ["pantry"] },
      { name: "Anis étoilé", qty: 2, unit: "pièce", tags: ["asian", "spice"] },
      { name: "Sauce poisson", qty: 60, unit: "ml", tags: ["se-asian", "asian"] },
      { name: "Sucre de palme", qty: 40, unit: "g", tags: ["se-asian", "asian"] },
      { name: "Tamarin (concentré)", qty: 1, unit: "c.s.", tags: ["se-asian", "asian"] },
      { name: "Échalotes", qty: 6, unit: "pièce", tags: ["produce", "supermarket"] }
    ],
    steps: [
      { title: "Saisir bœuf", instruction: "Bœuf en cubes 4 cm, dorer 6 min dans la cocotte. Réserver.", time: 8 },
      { title: "Pâte curry", instruction: "Faire bouillir la crème de coco jusqu'à séparation. Y frire la pâte massaman 4 min.", time: 6 },
      { title: "Mijoter", instruction: "Reste lait coco + bœuf + épices entières + sauce poisson + sucre + tamarin. Couvrir, 1h15 feu doux.", time: 75 },
      { title: "Pommes de terre", instruction: "Ajouter pommes de terre + échalotes entières + cacahuètes 30 min avant la fin.", time: 30 },
      { title: "Service", instruction: "Goûter, équilibrer. Servir avec riz jasmin." }
    ]
  }
]);
