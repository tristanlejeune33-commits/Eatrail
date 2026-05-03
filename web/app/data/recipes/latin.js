/* eatrail · v1.4 — recipes / latin
 * Cuisines couvertes : Mexique, Pérou, Brésil, Cuba, Argentine.
 */

window.EATRAIL_RECIPES = (window.EATRAIL_RECIPES || []).concat([

  // ── MEXIQUE ───────────────────────────────────────────
  {
    id: "cochinita-pibil",
    title: "Cochinita Pibil",
    origin: { country: "Mexique", region: "Yucatán", flag: "🇲🇽" },
    auth: 96, duration: 240, servings: 6, difficulty: 2,
    budget: { perPerson: 5.8, level: "$$" },
    diets: ["dairy-free", "gluten-free"], moods: ["comfort", "festive", "wow"],
    gradient: "linear-gradient(135deg, #2D6940 0%, #7FB069 55%, #D9A441 100%)",
    summary: "Porc mariné à l'achiote et orange amère, cuit longtemps dans des feuilles de bananier.",
    story: "Recette pré-hispanique maya, cuite à l'origine dans un four enterré (le píib). À NYC, les feuilles de bananier sont le proxy parfait. Servir avec tortillas de maïs nixtamalisé et cebollas encurtidas.",
    validator: { name: "Lupita Ramírez", role: "Cocinera · Tulcingo Deli", city: "Hell's Kitchen, NY" },
    category: "ragoût", allergens: [],
    ingredients: [
      { name: "Épaule de porc désossée", qty: 1500, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Pâte d'achiote (recado rojo)", qty: 80, unit: "g", tags: ["mexican", "latin"], rare: true, substitutes: ["paprika doux + cumin + roucou (faute de mieux)"] },
      { name: "Jus d'orange amère (naranja agria)", qty: 200, unit: "ml", tags: ["mexican", "latin"], rare: true, substitutes: ["3 vol orange douce + 1 vol citron vert + 1 vol pamplemousse"] },
      { name: "Feuilles de bananier", qty: 4, unit: "feuilles", tags: ["mexican", "latin", "se-asian"], rare: true, substitutes: ["papier sulfurisé (texture moins authentique)"] },
      { name: "Ail frais", qty: 6, unit: "gousses", tags: ["produce", "supermarket"] },
      { name: "Oignons rouges", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Chiles habaneros", qty: 3, unit: "pièce", tags: ["mexican", "latin", "produce"] },
      { name: "Tortillas de maïs (nixtamal)", qty: 18, unit: "pièce", tags: ["mexican", "latin"] },
      { name: "Origan mexicain séché", qty: 1, unit: "c.s.", tags: ["mexican", "latin", "pantry"], substitutes: ["origan grec"] },
      { name: "Vinaigre blanc", qty: 100, unit: "ml", tags: ["pantry", "supermarket"] }
    ],
    steps: [
      { title: "Marinade", instruction: "Mixer achiote + orange amère + ail + origan + sel. Enrober le porc, laisser 8h (ou 30 min si pressé).", time: 480 },
      { title: "Préparation feuilles", instruction: "Passer les feuilles de bananier 5 sec à la flamme pour les assouplir.", time: 5 },
      { title: "Cuisson lente", instruction: "Tapisser une cocotte de feuilles, déposer le porc, replier, couvrir. Four 150 °C, 3h30. La viande doit s'effilocher à la fourchette.", time: 210 },
      { title: "Cebollas encurtidas", instruction: "Trancher fin oignons rouges + habaneros, couvrir vinaigre + sel + jus d'orange amère, 30 min.", time: 30 },
      { title: "Tacos", instruction: "Réchauffer tortillas. Garnir de porc effiloché, cebollas, jus de cuisson. Coriandre fraîche optionnelle." }
    ]
  },

  {
    id: "mole-poblano",
    title: "Mole Poblano",
    origin: { country: "Mexique", region: "Puebla", flag: "🇲🇽" },
    auth: 93, duration: 180, servings: 8, difficulty: 3,
    budget: { perPerson: 7.8, level: "$$" },
    diets: ["dairy-free", "halal-friendly"], moods: ["festive", "wow"],
    gradient: "linear-gradient(135deg, #15211A 0%, #C85A3A 100%)",
    summary: "Sauce complexe à 25+ ingrédients : chiles secs, chocolat, épices, fruits secs, sur dinde ou poulet.",
    story: "Selon la légende, créé par les sœurs dominicaines de Santa Rosa à Puebla pour un évêque. Sauce baroque, signature de la haute cuisine mexicaine. Une bonne maison met 3 jours. Version express : 3h, et le résultat reste impressionnant.",
    validator: { name: "Doña Esperanza Hernández", role: "Cocinera maestra", city: "Puebla / NYC visiting" },
    category: "ragoût", allergens: ["arachides", "sésame", "gluten", "fruits à coque"],
    ingredients: [
      { name: "Cuisses de poulet entières", qty: 2000, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Chiles ancho secs", qty: 6, unit: "pièce", tags: ["mexican", "latin"], rare: true },
      { name: "Chiles mulato secs", qty: 6, unit: "pièce", tags: ["mexican", "latin"], rare: true },
      { name: "Chiles pasilla secs", qty: 4, unit: "pièce", tags: ["mexican", "latin"], rare: true },
      { name: "Chocolat noir mexicain (Ibarra)", qty: 90, unit: "g", tags: ["mexican", "latin"], rare: true, substitutes: ["chocolat noir 70 % + cannelle + amande moulue"] },
      { name: "Tortillas rassies", qty: 2, unit: "pièce", tags: ["mexican", "latin"] },
      { name: "Pain (bolillo) rassis", qty: 1, unit: "pièce", tags: ["mexican", "latin"], substitutes: ["baguette dure"] },
      { name: "Amandes émondées", qty: 50, unit: "g", tags: ["pantry"] },
      { name: "Cacahuètes nature", qty: 50, unit: "g", tags: ["pantry"] },
      { name: "Graines de sésame", qty: 30, unit: "g", tags: ["pantry"] },
      { name: "Raisins secs", qty: 50, unit: "g", tags: ["pantry"] },
      { name: "Tomates Roma", qty: 4, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Tomatillos", qty: 4, unit: "pièce", tags: ["mexican", "latin", "produce"], rare: true },
      { name: "Cannelle bâton", qty: 1, unit: "bâton", tags: ["pantry"] },
      { name: "Clous de girofle", qty: 4, unit: "pièce", tags: ["pantry"] },
      { name: "Anis étoilé", qty: 1, unit: "étoile", tags: ["asian", "spice"] },
      { name: "Oignon blanc", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Ail", qty: 6, unit: "gousses", tags: ["produce", "supermarket"] }
    ],
    steps: [
      { title: "Pocher poulet", instruction: "Cuire poulet 30 min dans eau salée + oignon + ail. Réserver bouillon et viande.", time: 35 },
      { title: "Préparer chiles", instruction: "Épépiner, déchirer. Toaster à sec 30 sec par face (sans brûler !). Tremper 20 min eau chaude.", time: 25 },
      { title: "Tout torréfier", instruction: "Toaster séparément à sec : amandes, cacahuètes, sésame, épices. Frire séparément raisins, tortilla, pain.", time: 20 },
      { title: "Mixer en 3 fois", instruction: "Mixer chiles + un peu d'eau de trempage, puis fruits secs et pain, puis tomates + tomatillos + oignon + ail. Passer chaque batch au tamis.", time: 30 },
      { title: "Cuisson de la sauce", instruction: "Saindoux ou huile chaud, verser la sauce, remuer constamment 30 min. Ajouter chocolat, sel, pincée de sucre. Allonger avec bouillon.", time: 35 },
      { title: "Service", instruction: "Réchauffer poulet dans la sauce 15 min. Sésame en finition. Riz blanc à côté." }
    ]
  },

  {
    id: "tacos-al-pastor",
    title: "Tacos al Pastor",
    origin: { country: "Mexique", region: "Mexico City", flag: "🇲🇽" },
    auth: 91, duration: 120, servings: 6, difficulty: 2,
    budget: { perPerson: 5.5, level: "$" },
    diets: ["dairy-free", "halal-friendly"], moods: ["street", "festive"],
    gradient: "linear-gradient(135deg, #C85A3A 0%, #D9A441 60%, #5C8A3A 100%)",
    summary: "Porc mariné chiles + ananas, grillé en trompo, taco avec ananas, oignon, coriandre, citron vert.",
    story: "Adaptation mexicaine du shawarma syro-libanais (immigrants au début XXe). La signature : tranche d'ananas en haut du trompo qui caramélise et tombe dans la viande. Petits tacos main droite, ananas main gauche.",
    validator: { name: "Lupita Ramírez", role: "Cocinera · Tulcingo Deli", city: "Hell's Kitchen, NY" },
    category: "ragoût", allergens: [],
    ingredients: [
      { name: "Échine de porc en très fines tranches", qty: 1000, unit: "g", tags: ["butcher", "mexican"] },
      { name: "Chiles guajillo secs", qty: 4, unit: "pièce", tags: ["mexican", "latin"], rare: true },
      { name: "Chiles ancho", qty: 2, unit: "pièce", tags: ["mexican", "latin"], rare: true },
      { name: "Achiote", qty: 30, unit: "g", tags: ["mexican", "latin"], rare: true },
      { name: "Ananas frais", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Vinaigre blanc", qty: 100, unit: "ml", tags: ["pantry"] },
      { name: "Cumin + origan mexicain + cannelle", qty: 1, unit: "lot", tags: ["mexican", "spice"] },
      { name: "Ail", qty: 6, unit: "gousses", tags: ["produce", "supermarket"] },
      { name: "Tortillas de maïs petites", qty: 24, unit: "pièce", tags: ["mexican"] },
      { name: "Oignon blanc + coriandre + citron vert (service)", qty: 1, unit: "lot", tags: ["produce"] }
    ],
    steps: [
      { title: "Marinade", instruction: "Tremper chiles 15 min eau chaude. Mixer avec achiote, vinaigre, ail, épices, sel, jus d'1/4 d'ananas.", time: 20 },
      { title: "Mariner porc", instruction: "Recouvrir porc, 4 h frigo (8 h idéal).", time: 240 },
      { title: "Cuisson", instruction: "Plancha très chaude, saisir tranches 1 min par face. Hacher au couteau en petits dés.", time: 12 },
      { title: "Ananas", instruction: "Trancher 4 belles rondelles. Griller 2 min par face : doit caraméliser. Couper en dés.", time: 8 },
      { title: "Service", instruction: "Réchauffer tortillas. Garnir : porc, dés d'ananas, oignon, coriandre. Citron vert pressé." }
    ]
  },

  {
    id: "pozole-rojo",
    title: "Pozole Rojo",
    origin: { country: "Mexique", region: "Jalisco", flag: "🇲🇽" },
    auth: 92, duration: 180, servings: 6, difficulty: 2,
    budget: { perPerson: 6.0, level: "$$" },
    diets: ["dairy-free"], moods: ["comfort", "festive"],
    gradient: "linear-gradient(135deg, #C85A3A 0%, #2D6940 100%)",
    summary: "Soupe traditionnelle aux grains de maïs nixtamalisés, porc, bouillon rouge aux chiles, garnitures fraîches.",
    story: "Plat des fêtes nationales (16 septembre). Le maïs cacahuazintle nixtamalisé donne grains qui éclatent. Servi avec table de garnitures : laitue, radis, oignon, citron, origan, totopos. Chacun monte son bol.",
    validator: { name: "Lupita Ramírez", role: "Cocinera · Tulcingo Deli", city: "Hell's Kitchen, NY" },
    category: "soupe", allergens: [],
    ingredients: [
      { name: "Maïs cacahuazintle (hominy en boîte)", qty: 1000, unit: "g", tags: ["mexican", "latin"], rare: true, substitutes: ["maïs hominy en boîte"] },
      { name: "Épaule de porc en cubes", qty: 800, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Chiles guajillo secs", qty: 6, unit: "pièce", tags: ["mexican"], rare: true },
      { name: "Chiles ancho secs", qty: 3, unit: "pièce", tags: ["mexican"], rare: true },
      { name: "Oignon", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Ail", qty: 8, unit: "gousses", tags: ["produce", "supermarket"] },
      { name: "Cumin + origan mexicain", qty: 1, unit: "lot", tags: ["mexican", "spice"] },
      { name: "Laitue iceberg", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Radis", qty: 8, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Citron vert", qty: 4, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Tortillas frites (totopos)", qty: 1, unit: "lot", tags: ["mexican"] }
    ],
    steps: [
      { title: "Bouillon de porc", instruction: "Porc + 1 oignon + 4 ail + sel, eau couvrant + 5 cm, frémir 1h30.", time: 90 },
      { title: "Sauce chiles", instruction: "Tremper chiles 15 min eau chaude. Mixer avec ail + cumin + origan + un peu d'eau. Filtrer.", time: 18 },
      { title: "Réunion", instruction: "Verser sauce chiles dans le bouillon. Ajouter maïs égoutté. Mijoter 30 min.", time: 32 },
      { title: "Service", instruction: "Bols : pozole. Sur la table : laitue ciselée, radis tranchés, oignon, citron vert, origan, totopos. Chacun se sert." }
    ]
  },

  {
    id: "enchiladas-verdes",
    title: "Enchiladas Verdes",
    origin: { country: "Mexique", region: "Mexico", flag: "🇲🇽" },
    auth: 89, duration: 60, servings: 4, difficulty: 2,
    budget: { perPerson: 5.0, level: "$" },
    diets: [], moods: ["comfort"],
    gradient: "linear-gradient(135deg, #5C8A3A 0%, #F5F7EE 100%)",
    summary: "Tortillas roulées garnies de poulet, baignées dans une sauce verte tomatillos, crème, fromage.",
    story: "Plat domestique mexicain par excellence. La sauce verte (salsa verde) crue ou cuite est l'âme. Gratiner au four est une américanisation — au Mexique on monte directement chaud sur l'assiette.",
    validator: { name: "Lupita Ramírez", role: "Cocinera · Tulcingo Deli", city: "Hell's Kitchen, NY" },
    category: "ragoût", allergens: ["lait"],
    ingredients: [
      { name: "Tortillas de maïs", qty: 12, unit: "pièce", tags: ["mexican"] },
      { name: "Poulet effiloché cuit", qty: 500, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Tomatillos frais (avec husk)", qty: 600, unit: "g", tags: ["mexican", "produce"], rare: true },
      { name: "Piments serranos", qty: 3, unit: "pièce", tags: ["mexican", "produce"] },
      { name: "Oignon blanc", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Ail", qty: 3, unit: "gousses", tags: ["produce", "supermarket"] },
      { name: "Coriandre fraîche", qty: 1, unit: "botte", tags: ["produce", "supermarket"] },
      { name: "Crema mexicana (ou crème fraîche épaisse)", qty: 200, unit: "g", tags: ["mexican", "supermarket"] },
      { name: "Queso fresco (ou feta)", qty: 200, unit: "g", tags: ["mexican", "supermarket"] },
      { name: "Bouillon de volaille", qty: 200, unit: "ml", tags: ["pantry"] },
      { name: "Huile végétale", qty: 60, unit: "ml", tags: ["pantry"] }
    ],
    steps: [
      { title: "Salsa verde", instruction: "Pocher tomatillos + serranos 8 min eau bouillante. Mixer avec oignon + ail + coriandre + bouillon + sel.", time: 12 },
      { title: "Cuire sauce", instruction: "Poêler 2 c.s. huile, verser sauce, frémir 8 min : la couleur fonce.", time: 10 },
      { title: "Tortillas", instruction: "Réchauffer chaque tortilla 10 sec à l'huile chaude (les ramollit pour rouler).", time: 8 },
      { title: "Roulage", instruction: "Tremper rapidement dans la salsa. Garnir poulet, rouler, déposer sur assiette ouverte vers le bas.", time: 8 },
      { title: "Service", instruction: "Napper du reste de salsa, crema, queso fresco, oignon ciselé, coriandre. Servir IMMÉDIATEMENT." }
    ]
  },

  {
    id: "guacamole",
    title: "Guacamole authentique",
    origin: { country: "Mexique", region: "centre", flag: "🇲🇽" },
    auth: 95, duration: 15, servings: 6, difficulty: 1,
    budget: { perPerson: 2.8, level: "$" },
    diets: ["vegan", "vegetarian", "dairy-free", "gluten-free"], moods: ["quick", "healthy"],
    gradient: "linear-gradient(135deg, #5C8A3A 0%, #2D6940 100%)",
    summary: "Avocats écrasés au mortier (molcajete), oignon, coriandre, citron vert, piment serrano, sel.",
    story: "Recette aztèque originelle (mot nahuatl āhuacamolli = sauce d'avocat). Doit être préparée AU MORTIER — la lame de couteau noircit l'avocat. Aucun cumin, aucune crème : ces ajouts sont des tex-mex.",
    validator: { name: "Lupita Ramírez", role: "Cocinera · Tulcingo Deli", city: "Hell's Kitchen, NY" },
    category: "mezze", allergens: [],
    ingredients: [
      { name: "Avocats Hass mûrs", qty: 4, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Oignon blanc", qty: 0.5, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Coriandre fraîche", qty: 0.5, unit: "botte", tags: ["produce", "supermarket"] },
      { name: "Piment serrano (ou jalapeño)", qty: 1, unit: "pièce", tags: ["mexican", "produce"] },
      { name: "Tomate ferme", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Citron vert", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Sel marin", qty: 1, unit: "qsp", tags: ["pantry"] },
      { name: "Tortillas frites pour service", qty: 1, unit: "lot", tags: ["mexican"] }
    ],
    steps: [
      { title: "Pâte d'aromates", instruction: "Au molcajete (ou bol) : piment + oignon + sel + coriandre, écraser jusqu'à pâte humide.", time: 4 },
      { title: "Avocats", instruction: "Couper en deux, dénoyauter, gratter la chair à la cuiller dans le mortier. Écraser grossier — garder texture.", time: 5 },
      { title: "Finition", instruction: "Tomate en très petits dés, citron vert (les 2 jus), sel. Mélanger juste, goûter.", time: 4 },
      { title: "Service", instruction: "Servir IMMÉDIATEMENT avec totopos. Ne se garde pas." }
    ]
  },

  // ── PÉROU ─────────────────────────────────────────────
  {
    id: "ceviche-limeño",
    title: "Ceviche Limeño",
    origin: { country: "Pérou", region: "Lima", flag: "🇵🇪" },
    auth: 94, duration: 25, servings: 4, difficulty: 2,
    budget: { perPerson: 9.5, level: "$$" },
    diets: ["pescatarian", "dairy-free", "gluten-free"], moods: ["healthy", "wow", "festive"],
    gradient: "linear-gradient(135deg, #5C8A3A 0%, #F5F7EE 100%)",
    summary: "Cubes de poisson cru cuits par le citron vert, oignon rouge, piment ají, leche de tigre.",
    story: "Plat-totem péruvien, classé patrimoine national. Le secret : poisson ultra-frais (le marché de Belén, ou Greenmarket à NYC), citrons verts pressés à la main JUSTE avant, jamais d'avance. La leche de tigre se boit à part en shooter.",
    validator: { name: "Gastón Vera", role: "Chef · Llama Inn", city: "Williamsburg, Brooklyn" },
    category: "cru", allergens: ["poisson"],
    ingredients: [
      { name: "Filet de bar / loup ultra-frais", qty: 600, unit: "g", tags: ["fish", "specialty"] },
      { name: "Citrons verts (key limes idéal)", qty: 12, unit: "pièce", tags: ["produce", "latin"] },
      { name: "Oignon rouge", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Ají amarillo (pâte)", qty: 1, unit: "c.s.", tags: ["latin", "south-american"], rare: true, substitutes: ["piment jaune frais + curcuma"] },
      { name: "Coriandre fraîche", qty: 1, unit: "botte", tags: ["produce", "supermarket"] },
      { name: "Patate douce orange", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Maïs cancha (ou pop-corn épicé)", qty: 80, unit: "g", tags: ["latin", "south-american"], rare: true, substitutes: ["maïs grillé"] },
      { name: "Maïs choclo (gros grain andin)", qty: 1, unit: "épi", tags: ["latin", "south-american"], rare: true, substitutes: ["maïs frais classique"] },
      { name: "Gingembre frais", qty: 10, unit: "g", tags: ["produce", "asian"] },
      { name: "Ail", qty: 2, unit: "gousses", tags: ["produce", "supermarket"] },
      { name: "Sel fin", qty: 1, unit: "qsp", tags: ["pantry"] }
    ],
    steps: [
      { title: "Préparer poisson", instruction: "Cubes de 1,5 cm. Tenir au frais.", time: 5 },
      { title: "Leche de tigre", instruction: "Mixer un peu de poisson + jus de 8 citrons verts + ají + ail + gingembre + un brin coriandre + sel + 1 cube de glace. Filtrer.", time: 5 },
      { title: "Marinade éclair", instruction: "Sur le poisson : sel, oignon rouge ciselé, leche de tigre. Touiller 90 secondes : poisson devient opaque.", time: 2 },
      { title: "Garnitures", instruction: "Cuire patate douce 15 min eau bouillante. Faire éclater le maïs cancha à sec.", time: 15 },
      { title: "Service", instruction: "Assiette froide : ceviche, rondelles de patate douce tiède, choclo, cancha. Coriandre. Verre de leche de tigre à part." }
    ]
  },

  {
    id: "lomo-saltado",
    title: "Lomo Saltado",
    origin: { country: "Pérou", region: "Lima", flag: "🇵🇪" },
    auth: 92, duration: 35, servings: 4, difficulty: 2,
    budget: { perPerson: 8.0, level: "$$" },
    diets: ["dairy-free"], moods: ["quick", "wow", "comfort"],
    gradient: "linear-gradient(135deg, #C85A3A 0%, #15211A 100%)",
    summary: "Bœuf sauté wok péruvien-chinois (chifa), tomates, oignons, frites, sauce soja-vinaigre.",
    story: "Né au XIXe avec les immigrés cantonais qui ont apporté le wok au Pérou (cuisine chifa). Le combo improbable bœuf wok + frites + riz est devenu l'âme limeñienne. Servi avec frites ET riz blanc, oui les deux.",
    validator: { name: "Gastón Vera", role: "Chef · Llama Inn", city: "Williamsburg, Brooklyn" },
    category: "ragoût", allergens: ["soja"],
    ingredients: [
      { name: "Faux-filet de bœuf en lanières", qty: 600, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Oignon rouge", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Tomates fermes", qty: 3, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Ají amarillo (pâte)", qty: 1, unit: "c.s.", tags: ["latin", "south-american"], rare: true },
      { name: "Sauce soja", qty: 4, unit: "c.s.", tags: ["asian"] },
      { name: "Vinaigre rouge", qty: 2, unit: "c.s.", tags: ["pantry"] },
      { name: "Ail", qty: 4, unit: "gousses", tags: ["produce", "supermarket"] },
      { name: "Coriandre + persil", qty: 1, unit: "lot", tags: ["produce"] },
      { name: "Pommes de terre frites", qty: 600, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Riz blanc", qty: 400, unit: "g", tags: ["pantry"] },
      { name: "Huile végétale", qty: 4, unit: "c.s.", tags: ["pantry"] }
    ],
    steps: [
      { title: "Frites", instruction: "Couper en bâtonnets, frire 8 min en deux bains (170 puis 190 °C).", time: 18 },
      { title: "Saisir bœuf", instruction: "Wok très chaud, huile fumante, bœuf 90 sec à vif. Réserver.", time: 4 },
      { title: "Légumes", instruction: "Oignon en lamelles + ail râpé + ají, 2 min. Tomates en quartiers, 1 min : doivent juste tiédir, garder croquant.", time: 4 },
      { title: "Réunion", instruction: "Remettre bœuf, soja + vinaigre, 30 sec. Glisser frites, mélanger juste.", time: 2 },
      { title: "Service", instruction: "Coriandre. Servir avec riz blanc à part, et oui les frites en plus dans le wok." }
    ]
  },

  // ── BRÉSIL ─────────────────────────────────────────────
  {
    id: "feijoada",
    title: "Feijoada",
    origin: { country: "Brésil", region: "Rio de Janeiro, Brésil", flag: "🇧🇷" },
    auth: 93, duration: 240, servings: 8, difficulty: 2,
    budget: { perPerson: 6.5, level: "$$" },
    diets: ["dairy-free"], moods: ["comfort", "festive", "wow"],
    gradient: "linear-gradient(135deg, #15211A 0%, #5C8A3A 100%)",
    summary: "Plat national brésilien : haricots noirs mijotés des heures avec porcs salés-fumés-frais, à servir avec riz, farofa, orange.",
    story: "Plat dominical du Brésil. Origine débattue (esclaves ou aristocrates ?), mais aujourd'hui c'est le repas long du dimanche. Doit avoir 4 variétés de viandes minimum. Le riz blanc + farofa (manioc) absorbent le bouillon.",
    validator: { name: "Gastón Vera", role: "Chef · Llama Inn", city: "Williamsburg, Brooklyn" },
    category: "ragoût", allergens: [],
    ingredients: [
      { name: "Haricots noirs secs", qty: 500, unit: "g", tags: ["pantry", "latin"] },
      { name: "Échine de porc fraîche", qty: 400, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Lard fumé en cubes", qty: 200, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Saucisse paio (ou chorizo doux)", qty: 200, unit: "g", tags: ["butcher", "european"] },
      { name: "Linguiça (saucisse fumée brésilienne)", qty: 200, unit: "g", tags: ["latin", "butcher"], rare: true, substitutes: ["chorizo fumé portugais"] },
      { name: "Côtes de porc fumées", qty: 300, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Oignons", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Ail", qty: 8, unit: "gousses", tags: ["produce", "supermarket"] },
      { name: "Laurier", qty: 4, unit: "pièce", tags: ["pantry"] },
      { name: "Cumin moulu", qty: 1, unit: "c.c.", tags: ["pantry"] },
      { name: "Riz blanc", qty: 500, unit: "g", tags: ["pantry"] },
      { name: "Farinha de mandioca (farofa)", qty: 200, unit: "g", tags: ["latin"], rare: true, substitutes: ["chapelure grossière toastée"] },
      { name: "Oranges (service)", qty: 4, unit: "pièce", tags: ["produce", "supermarket"] }
    ],
    steps: [
      { title: "Tremper haricots", instruction: "8 h ou la veille.", time: 480 },
      { title: "Cuire haricots", instruction: "Eau couvrant + 5 cm + laurier, frémir 1 h jusqu'à tendres.", time: 65 },
      { title: "Saisir viandes", instruction: "Toutes les viandes en gros cubes, dorer dans cocotte, 15 min. Réserver.", time: 17 },
      { title: "Base aromatique", instruction: "Oignons + ail dans la même cocotte, 8 min. Cumin.", time: 10 },
      { title: "Réunion", instruction: "Haricots + leur eau + viandes, mijoter 1 h 30 doux. Sauce doit s'épaissir naturellement.", time: 95 },
      { title: "Farofa", instruction: "Faire revenir 4 c.s. beurre + 1 oignon, ajouter farinha, toaster jusqu'à doré, 8 min.", time: 10 },
      { title: "Service", instruction: "Riz, feijoada, farofa, quartiers d'orange. Caïpirinha à côté." }
    ]
  },

  {
    id: "moqueca",
    title: "Moqueca de Peixe",
    origin: { country: "Brésil", region: "Bahia, Brésil", flag: "🇧🇷" },
    auth: 91, duration: 50, servings: 4, difficulty: 2,
    budget: { perPerson: 9.0, level: "$$" },
    diets: ["dairy-free", "pescatarian"], moods: ["comfort", "festive"],
    gradient: "linear-gradient(135deg, #D9A441 0%, #C85A3A 100%)",
    summary: "Ragoût bahianais de poisson au lait de coco, huile de palme rouge, poivrons, coriandre.",
    story: "Plat de la culture afro-brésilienne. La signature : huile de dendê (palme rouge) qui colore le bouillon orange-feu. Cuisson en cocotte d'argile (panela de barro) traditionnelle. Servi avec riz blanc et farofa.",
    validator: { name: "Gastón Vera", role: "Chef · Llama Inn", city: "Williamsburg, Brooklyn" },
    category: "soupe", allergens: ["poisson"],
    ingredients: [
      { name: "Filet de cabillaud ou bar", qty: 700, unit: "g", tags: ["fish", "specialty"] },
      { name: "Lait de coco entier", qty: 400, unit: "ml", tags: ["se-asian", "asian"] },
      { name: "Huile de palme rouge (dendê)", qty: 60, unit: "ml", tags: ["african", "latin"], rare: true, substitutes: ["huile végétale + paprika fumé"] },
      { name: "Poivron rouge", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Poivron jaune", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Tomates", qty: 3, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Oignon", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Ail", qty: 4, unit: "gousses", tags: ["produce", "supermarket"] },
      { name: "Citron vert", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Coriandre fraîche", qty: 1, unit: "botte", tags: ["produce", "supermarket"] },
      { name: "Riz blanc + farofa", qty: 1, unit: "lot", tags: ["pantry", "latin"] }
    ],
    steps: [
      { title: "Mariner poisson", instruction: "Citron vert + sel + ail râpé sur le poisson en gros morceaux, 15 min.", time: 17 },
      { title: "Couches", instruction: "Cocotte (argile idéal) : huile dendê au fond, lit d'oignons + poivrons + tomates en rondelles, poisson dessus, encore légumes.", time: 8 },
      { title: "Lait de coco", instruction: "Verser le lait de coco. Couvrir, frémissement doux 20 min. Ne pas remuer (poisson casserait).", time: 22 },
      { title: "Service", instruction: "Coriandre généreuse. Servir directement dans la cocotte, riz et farofa à côté." }
    ]
  },

  {
    id: "pao-de-queijo",
    title: "Pão de Queijo",
    origin: { country: "Brésil", region: "Minas Gerais, Brésil", flag: "🇧🇷" },
    auth: 90, duration: 50, servings: 8, difficulty: 1,
    budget: { perPerson: 1.5, level: "$" },
    diets: ["vegetarian", "gluten-free"], moods: ["quick", "comfort"],
    gradient: "linear-gradient(135deg, #D9A441 0%, #F5F7EE 100%)",
    summary: "Petits pains brésiliens à la fécule de manioc et fromage, sans gluten, mie élastique-aérienne.",
    story: "Spécialité du Minas Gerais. La fécule de manioc (polvilho azedo + doce) donne la texture unique : crouton extérieur, mie élastique presque fromagère. Le queijo Minas est l'idéal — feta sec se substitue.",
    validator: { name: "Gastón Vera", role: "Chef · Llama Inn", city: "Williamsburg, Brooklyn" },
    category: "pain", allergens: ["lait", "œufs"],
    ingredients: [
      { name: "Polvilho azedo (manioc fermenté)", qty: 250, unit: "g", tags: ["latin"], rare: true, substitutes: ["tapioca starch (texture proche)"] },
      { name: "Polvilho doce (manioc doux)", qty: 250, unit: "g", tags: ["latin"], rare: true, substitutes: ["tapioca starch"] },
      { name: "Lait", qty: 250, unit: "ml", tags: ["supermarket"] },
      { name: "Huile végétale", qty: 100, unit: "ml", tags: ["pantry"] },
      { name: "Sel", qty: 1, unit: "c.c.", tags: ["pantry"] },
      { name: "Œufs", qty: 2, unit: "pièce", tags: ["supermarket"] },
      { name: "Queijo Minas (ou feta sec râpé)", qty: 200, unit: "g", tags: ["latin", "supermarket"] }
    ],
    steps: [
      { title: "Ébouillanter manioc", instruction: "Casserole : lait + huile + sel à ébullition. Verser sur le manioc dans un grand bol. Bien mélanger : devient pâte épaisse-collante.", time: 8 },
      { title: "Refroidir", instruction: "15 min jusqu'à tiède.", time: 15 },
      { title: "Pétrir", instruction: "Ajouter œufs un à un, fromage râpé. Pétrir au robot 5 min : pâte lisse-élastique.", time: 7 },
      { title: "Bouler + cuire", instruction: "Bouler en boules de noix (50 g) sur plaque. Four 200 °C, 20 min jusqu'à dorées-gonflées-craquantes.", time: 22 }
    ]
  },

  // ── CUBA ───────────────────────────────────────────────
  {
    id: "ropa-vieja",
    title: "Ropa Vieja",
    origin: { country: "Cuba", region: "La Havane, Cuba", flag: "🇨🇺" },
    auth: 92, duration: 240, servings: 6, difficulty: 1,
    budget: { perPerson: 6.0, level: "$$" },
    diets: ["dairy-free"], moods: ["comfort", "festive"],
    gradient: "linear-gradient(135deg, #C85A3A 0%, #5C8A3A 100%)",
    summary: "Bœuf effiloché (« vieux vêtements ») mijoté avec poivrons, tomates, vin blanc, olives, câpres.",
    story: "Plat national cubain (origine canarienne). Le bœuf doit s'effilocher en filaments à la fourchette — d'où le nom. Servi avec riz blanc et bananes plantains frites (maduros). Sauce = trésor.",
    validator: { name: "Gastón Vera", role: "Chef · Llama Inn", city: "Williamsburg, Brooklyn" },
    category: "ragoût", allergens: [],
    ingredients: [
      { name: "Bavette ou flank steak", qty: 1200, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Poivron rouge", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Poivron vert", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Oignons jaunes", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Tomates concassées", qty: 800, unit: "g", tags: ["pantry"] },
      { name: "Vin blanc sec", qty: 200, unit: "ml", tags: ["specialty", "supermarket"] },
      { name: "Olives vertes (manzanilla)", qty: 100, unit: "g", tags: ["middle-east", "european"] },
      { name: "Câpres", qty: 2, unit: "c.s.", tags: ["pantry"] },
      { name: "Ail", qty: 6, unit: "gousses", tags: ["produce", "supermarket"] },
      { name: "Cumin + origan + paprika fumé + laurier", qty: 1, unit: "lot", tags: ["pantry", "latin"] },
      { name: "Riz blanc + bananes plantains (maduros)", qty: 1, unit: "lot", tags: ["pantry", "produce"] }
    ],
    steps: [
      { title: "Pocher bœuf", instruction: "Bœuf entier + 1 oignon + ail + laurier + sel, eau couvrant, frémir 2h jusqu'à très tendre. Réserver bouillon.", time: 122 },
      { title: "Effilocher", instruction: "Aux mains ou fourchettes, en filaments épais.", time: 8 },
      { title: "Sofrito", instruction: "Cocotte : huile + oignons + poivrons en lanières + ail, suer 12 min. Tomate + épices + vin, réduire 5 min.", time: 17 },
      { title: "Mijoter", instruction: "Bœuf + 300 ml bouillon, frémir 30 min. Olives + câpres 10 min avant la fin.", time: 32 },
      { title: "Service", instruction: "Riz blanc, ropa vieja, plantains frits dorés. Bière froide en option." }
    ]
  },

  // ── ARGENTINE ──────────────────────────────────────────
  {
    id: "empanadas-saltenas",
    title: "Empanadas Salteñas",
    origin: { country: "Argentine", region: "Salta, Argentine", flag: "🇦🇷" },
    auth: 91, duration: 90, servings: 6, difficulty: 2,
    budget: { perPerson: 4.0, level: "$" },
    diets: [], moods: ["street", "festive"],
    gradient: "linear-gradient(135deg, #D9A441 0%, #C85A3A 100%)",
    summary: "Chaussons farcis bœuf-oignon-cumin-paprika, pâte au saindoux, cuits au four ou frits.",
    story: "Argentine du nord (Salta) : la version originelle, juteuse au cumin et paprika. Le repulgue (bordure tressée) est un art — chaque province a son code de fermeture. Servir avec chimichurri et vin Malbec.",
    validator: { name: "Gastón Vera", role: "Chef · Llama Inn", city: "Williamsburg, Brooklyn" },
    category: "ragoût", allergens: ["gluten", "œufs"],
    ingredients: [
      { name: "Farine T55", qty: 500, unit: "g", tags: ["pantry"] },
      { name: "Saindoux fondu", qty: 100, unit: "g", tags: ["butcher", "supermarket"], substitutes: ["beurre"] },
      { name: "Eau tiède + sel", qty: 200, unit: "ml", tags: ["pantry"] },
      { name: "Bœuf en très petits dés (couteau)", qty: 600, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Oignons jaunes", qty: 3, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Cumin moulu", qty: 1, unit: "c.s.", tags: ["pantry"] },
      { name: "Paprika doux + fumé", qty: 1, unit: "c.s.", tags: ["pantry"] },
      { name: "Œufs durs", qty: 3, unit: "pièce", tags: ["supermarket"] },
      { name: "Olives vertes", qty: 12, unit: "pièce", tags: ["middle-east", "european"] },
      { name: "Oignons verts", qty: 4, unit: "pièce", tags: ["produce"] }
    ],
    steps: [
      { title: "Pâte", instruction: "Mélanger farine + saindoux fondu + eau salée + 1 œuf. Pétrir 5 min, repos filmé 30 min.", time: 38 },
      { title: "Farce", instruction: "Cocotte : oignons hachés 10 min jusqu'à fondants. Bœuf, cumin, paprika, sel, 8 min. Refroidir.", time: 22 },
      { title: "Garnir", instruction: "Étaler pâte 3 mm, découper disques 14 cm. 1 c.s. farce + 1/4 œuf + 1 olive + brins oignons verts.", time: 18 },
      { title: "Repulgue", instruction: "Mouiller bords, fermer en demi-lune. Pincer le bord en torsade serrée tous les 5 mm.", time: 12 },
      { title: "Cuisson", instruction: "Dorure jaune d'œuf. Four 200 °C, 18 min jusqu'à dorées.", time: 20 }
    ]
  },

  {
    id: "asado-de-tira",
    title: "Asado de Tira (côtes argentines)",
    origin: { country: "Argentine", region: "Pampas, Argentine", flag: "🇦🇷" },
    auth: 90, duration: 90, servings: 6, difficulty: 2,
    budget: { perPerson: 12.0, level: "$$$" },
    diets: ["dairy-free", "halal-friendly"], moods: ["festive", "wow"],
    gradient: "linear-gradient(135deg, #15211A 0%, #C85A3A 100%)",
    summary: "Côtes de bœuf coupées au travers, cuites à la flamme directe, chimichurri à part.",
    story: "Le rituel de l'asado argentin : viande SEULE assaisonnée gros sel, cuisson lente à la braise (charbon ou bois). Pas de marinade, pas de fioritures. Le chimichurri (persil-ail-vinaigre-piment) accompagne TOUT.",
    validator: { name: "Gastón Vera", role: "Chef · Llama Inn", city: "Williamsburg, Brooklyn" },
    category: "ragoût", allergens: [],
    ingredients: [
      { name: "Côtes de bœuf coupées en travers", qty: 1800, unit: "g", tags: ["butcher", "specialty"] },
      { name: "Gros sel", qty: 30, unit: "g", tags: ["pantry"] },
      { name: "Persil plat (chimichurri)", qty: 1, unit: "botte", tags: ["produce", "supermarket"] },
      { name: "Origan séché", qty: 2, unit: "c.s.", tags: ["pantry"] },
      { name: "Ail (chimichurri)", qty: 6, unit: "gousses", tags: ["produce", "supermarket"] },
      { name: "Piment rouge sec en flocons", qty: 1, unit: "c.s.", tags: ["pantry"] },
      { name: "Vinaigre de vin rouge", qty: 80, unit: "ml", tags: ["pantry"] },
      { name: "Huile d'olive vierge", qty: 200, unit: "ml", tags: ["pantry"] },
      { name: "Pain de campagne (service)", qty: 1, unit: "pièce", tags: ["supermarket"] }
    ],
    steps: [
      { title: "Chimichurri", instruction: "Hacher persil + ail très fin. Mélanger avec origan, flocons piment, sel, vinaigre, huile. Reposer 30 min minimum (1 jour idéal).", time: 32 },
      { title: "Préparer braises", instruction: "Allumer le charbon, attendre que les flammes tombent : doit être braise rouge sans flamme.", time: 30 },
      { title: "Saler viande", instruction: "Gros sel généreusement sur les deux côtés, 15 min avant cuisson.", time: 15 },
      { title: "Cuisson", instruction: "Côtes côté os vers le bas 30 min. Retourner, 15 min côté chair. Doit être saignante-rose à cœur.", time: 47 },
      { title: "Repos + service", instruction: "Repos 5 min sous papier. Trancher entre les os. Pain de campagne, chimichurri, vin Malbec." }
    ]
  }
]);
