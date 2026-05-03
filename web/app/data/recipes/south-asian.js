/* eatrail · v1.4 — recipes / south-asian
 * Cuisines couvertes : Inde (nord et sud), avec un détour Sri Lanka.
 */

window.EATRAIL_RECIPES = (window.EATRAIL_RECIPES || []).concat([

  {
    id: "tikka-masala",
    title: "Chicken Tikka Masala",
    origin: { country: "Inde / UK", region: "Pendjab via Glasgow", flag: "🇮🇳" },
    auth: 78, duration: 70, servings: 4, difficulty: 2,
    budget: { perPerson: 5.7, level: "$$" },
    diets: ["halal-friendly"], moods: ["comfort", "wow"],
    gradient: "linear-gradient(135deg, #C85A3A 0%, #D9A441 100%)",
    summary: "Poulet mariné yaourt-épices grillé, sauce crémeuse tomate-cardamome.",
    story: "Probablement inventé à Glasgow dans les années 60-70 par des cuisiniers bengalis pour adapter le tikka aux palais britanniques. C'est aujourd'hui le plat préféré du Royaume-Uni. À NYC, Jackson Heights est le quartier de référence pour les bons épices et le ghee frais.",
    validator: { name: "Vikram Singh", role: "Chef · Adda Indian Canteen", city: "Long Island City, NY" },
    category: "curry", allergens: ["lait"],
    ingredients: [
      { name: "Filets de poulet", qty: 800, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Yaourt nature entier (whole milk)", qty: 200, unit: "g", tags: ["south-asian", "supermarket"] },
      { name: "Garam masala", qty: 2, unit: "c.s.", tags: ["south-asian", "specialty"], rare: true },
      { name: "Cumin moulu", qty: 1, unit: "c.s.", tags: ["pantry"] },
      { name: "Coriandre moulue", qty: 1, unit: "c.s.", tags: ["pantry"] },
      { name: "Curcuma", qty: 1, unit: "c.c.", tags: ["pantry", "south-asian"] },
      { name: "Paprika doux", qty: 2, unit: "c.s.", tags: ["pantry"] },
      { name: "Cayenne", qty: 0.5, unit: "c.c.", tags: ["pantry"] },
      { name: "Tomates concassées", qty: 800, unit: "g", tags: ["pantry", "supermarket"] },
      { name: "Crème épaisse 35%", qty: 200, unit: "ml", tags: ["supermarket"] },
      { name: "Beurre clarifié (ghee)", qty: 60, unit: "g", tags: ["south-asian", "specialty"], substitutes: ["beurre + huile (50/50)"] },
      { name: "Gingembre frais", qty: 30, unit: "g", tags: ["produce", "asian"] },
      { name: "Ail", qty: 6, unit: "gousses", tags: ["produce", "supermarket"] },
      { name: "Cardamome verte", qty: 6, unit: "gousses", tags: ["south-asian", "specialty"] },
      { name: "Coriandre fraîche", qty: 1, unit: "botte", tags: ["produce", "supermarket"] }
    ],
    steps: [
      { title: "Mariner poulet", instruction: "Yaourt + 1 c.s. garam masala + curcuma + ail-gingembre + sel. Cubes 3 cm, mariner 4h (idéal) ou 30 min.", time: 30 },
      { title: "Griller", instruction: "Brochettes au grill ou plancha très chaude, 8 min : doivent être un peu noircies sur les bords.", time: 9 },
      { title: "Sauce", instruction: "Ghee, cardamome ouvertes, ail-gingembre 1 min. Cumin, coriandre, paprika, cayenne, 30 sec. Tomates, mijoter 20 min.", time: 22 },
      { title: "Émulsion", instruction: "Crème, sel, garam masala restant. Mijoter 5 min. Ajouter poulet, 5 min.", time: 10 },
      { title: "Service", instruction: "Coriandre fraîche, riz basmati ou naan." }
    ]
  },

  {
    id: "butter-chicken",
    title: "Butter Chicken (Murgh Makhani)",
    origin: { country: "Inde / UK", region: "Delhi", flag: "🇮🇳" },
    auth: 91, duration: 75, servings: 4, difficulty: 2,
    budget: { perPerson: 6.5, level: "$$" },
    diets: ["halal-friendly"], moods: ["comfort", "wow"],
    gradient: "linear-gradient(135deg, #D9A441 0%, #C85A3A 100%)",
    summary: "L'original delhiois : poulet tandoori, sauce tomate au beurre fumée et fenugrec.",
    story: "Inventé en 1947 au restaurant Moti Mahal à Delhi pour recycler le poulet tandoori invendu. Plus authentique que le tikka masala : note fumée, fenugrec séché obligatoire (kasuri methi). Sauce plus rouge, moins crémeuse.",
    validator: { name: "Vikram Singh", role: "Chef · Adda Indian Canteen", city: "Long Island City, NY" },
    category: "curry", allergens: ["lait"],
    ingredients: [
      { name: "Cuisses de poulet désossées", qty: 800, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Yaourt grec", qty: 200, unit: "g", tags: ["south-asian", "supermarket"] },
      { name: "Pâte gingembre-ail", qty: 3, unit: "c.s.", tags: ["south-asian", "produce"] },
      { name: "Tomates concassées", qty: 800, unit: "g", tags: ["pantry", "supermarket"] },
      { name: "Beurre", qty: 120, unit: "g", tags: ["supermarket"] },
      { name: "Crème épaisse", qty: 150, unit: "ml", tags: ["supermarket"] },
      { name: "Garam masala", qty: 2, unit: "c.s.", tags: ["south-asian", "specialty"], rare: true },
      { name: "Kasuri methi (fenugrec séché)", qty: 1, unit: "c.s.", tags: ["south-asian"], rare: true, substitutes: ["fenugrec frais"] },
      { name: "Cardamome verte", qty: 6, unit: "gousses", tags: ["south-asian"] },
      { name: "Cayenne", qty: 1, unit: "c.c.", tags: ["pantry"] },
      { name: "Sucre", qty: 1, unit: "c.s.", tags: ["pantry"] },
      { name: "Charbon (pour fumage, optionnel)", qty: 1, unit: "morceau", tags: ["pantry"] }
    ],
    steps: [
      { title: "Marinade", instruction: "Yaourt + pâte ail-gingembre + cayenne + 1 c.s. garam masala. Poulet, 4h.", time: 240 },
      { title: "Tandoori maison", instruction: "Four max + grill, 15 min sur grille. Doit charbonner les bords.", time: 17 },
      { title: "Sauce makhani", instruction: "Beurre, cardamome 1 min. Tomates + sucre + sel, mijoter 25 min, mixer fin.", time: 30 },
      { title: "Réunion", instruction: "Sauce + poulet + crème + reste garam masala + kasuri methi écrasée à la main. 8 min.", time: 9 },
      { title: "Service", instruction: "Beurre supplémentaire fondu en surface. Naan ou basmati." }
    ]
  },

  {
    id: "biryani-mouton",
    title: "Biryani au mouton (style Hyderabad)",
    origin: { country: "Inde / UK", region: "Hyderabad", flag: "🇮🇳" },
    auth: 95, duration: 180, servings: 6, difficulty: 3,
    budget: { perPerson: 8.0, level: "$$" },
    diets: ["dairy-free", "halal-friendly"], moods: ["festive", "wow"],
    gradient: "linear-gradient(135deg, #D9A441 0%, #C85A3A 60%, #2D6940 100%)",
    summary: "Riz parfumé safran-rose, mouton mijoté, oignons frits — couches scellées et cuites au dum.",
    story: "Plat-roi des Nizams d'Hyderabad. La technique dum (cuisson scellée à la pâte de farine) garde tous les arômes. Chaque grain de riz doit rester séparé, parfumé safran. Compter une journée pour bien faire.",
    validator: { name: "Vikram Singh", role: "Chef · Adda Indian Canteen", city: "Long Island City, NY" },
    category: "bol", allergens: ["lait"],
    ingredients: [
      { name: "Épaule de mouton désossée", qty: 1000, unit: "g", tags: ["butcher", "south-asian"] },
      { name: "Riz basmati extra-long", qty: 600, unit: "g", tags: ["south-asian", "pantry"] },
      { name: "Yaourt nature", qty: 250, unit: "g", tags: ["south-asian", "supermarket"] },
      { name: "Oignons jaunes (en lamelles)", qty: 4, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Safran iranien", qty: 1, unit: "pincée", tags: ["south-asian", "middle-east", "spice"], rare: true },
      { name: "Lait tiède", qty: 100, unit: "ml", tags: ["supermarket"] },
      { name: "Eau de rose", qty: 1, unit: "c.s.", tags: ["south-asian", "middle-east"], rare: true },
      { name: "Pâte gingembre-ail", qty: 3, unit: "c.s.", tags: ["south-asian"] },
      { name: "Garam masala", qty: 2, unit: "c.s.", tags: ["south-asian", "specialty"], rare: true },
      { name: "Cardamome verte + noire + clous girofle + cannelle + laurier", qty: 1, unit: "lot", tags: ["spice"] },
      { name: "Menthe + coriandre fraîches", qty: 2, unit: "bottes", tags: ["produce"] },
      { name: "Ghee", qty: 100, unit: "g", tags: ["south-asian", "specialty"] },
      { name: "Citron vert", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] }
    ],
    steps: [
      { title: "Mariner mouton", instruction: "Yaourt + ail-gingembre + garam masala + sel + cayenne + menthe + coriandre + 1 oignon frit. Mouton, 4h+.", time: 240 },
      { title: "Oignons frits (birista)", instruction: "Frire les 3 oignons restants en lamelles très fines jusqu'à dorés-foncés. Égoutter.", time: 18 },
      { title: "Cuire mouton", instruction: "Mariné + ghee dans cocotte, mijoter 1h jusqu'à viande tendre.", time: 60 },
      { title: "Riz partiellement cuit", instruction: "Riz trempé 30 min. Bouillir avec épices entières + sel jusqu'à 70% cuit. Égoutter.", time: 12 },
      { title: "Stratification + dum", instruction: "Mouton au fond, riz en couche, parsemer birista + safran-lait + eau rose. Sceller couvercle (pâte). 25 min feu très doux.", time: 27 },
      { title: "Service", instruction: "Ouvrir devant les invités (effet wow). Mélanger doucement. Raita yaourt + concombre à côté." }
    ]
  },

  {
    id: "dal-makhani",
    title: "Dal Makhani",
    origin: { country: "Inde / UK", region: "Pendjab", flag: "🇮🇳" },
    auth: 92, duration: 240, servings: 6, difficulty: 1,
    budget: { perPerson: 3.2, level: "$" },
    diets: ["vegetarian", "halal-friendly"], moods: ["comfort"],
    gradient: "linear-gradient(135deg, #15211A 0%, #C85A3A 100%)",
    summary: "Lentilles noires et haricots rouges mijotés des heures, beurre, crème, fenugrec.",
    story: "Le veggie-roi du Pendjab. Vraie technique : 8h de mijotage doux, beaucoup de beurre. Plus c'est lent, plus c'est crémeux sans ajouter de crème excessive.",
    validator: { name: "Vikram Singh", role: "Chef · Adda Indian Canteen", city: "Long Island City, NY" },
    category: "ragoût", allergens: ["lait"],
    ingredients: [
      { name: "Urad dal entier (haricot mungo noir)", qty: 250, unit: "g", tags: ["south-asian"], rare: true },
      { name: "Haricots rouges (rajma)", qty: 80, unit: "g", tags: ["south-asian", "supermarket"] },
      { name: "Tomates fraîches", qty: 4, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Pâte gingembre-ail", qty: 2, unit: "c.s.", tags: ["south-asian"] },
      { name: "Beurre", qty: 80, unit: "g", tags: ["supermarket"] },
      { name: "Crème épaisse", qty: 120, unit: "ml", tags: ["supermarket"] },
      { name: "Garam masala", qty: 1, unit: "c.s.", tags: ["south-asian", "specialty"], rare: true },
      { name: "Kasuri methi", qty: 1, unit: "c.s.", tags: ["south-asian"], rare: true },
      { name: "Cumin entier", qty: 1, unit: "c.c.", tags: ["pantry"] },
      { name: "Cayenne", qty: 0.5, unit: "c.c.", tags: ["pantry"] }
    ],
    steps: [
      { title: "Tremper", instruction: "Urad + rajma trempés 8h dans 3x leur volume d'eau.", time: 480 },
      { title: "Cuisson lente", instruction: "Cuisson cocotte, eau couvrant + sel, 2h jusqu'à très tendres. Mixer 1/4 pour crémeux.", time: 120 },
      { title: "Tadka", instruction: "Beurre + cumin + ail-gingembre + tomates concassées + cayenne, 8 min.", time: 9 },
      { title: "Réunion", instruction: "Mélanger à la dal. Mijoter 30 min, remuer souvent. Crème + kasuri methi + garam masala fin de cuisson.", time: 35 }
    ]
  },

  {
    id: "saag-paneer",
    title: "Saag Paneer",
    origin: { country: "Inde / UK", region: "Pendjab", flag: "🇮🇳" },
    auth: 90, duration: 50, servings: 4, difficulty: 2,
    budget: { perPerson: 4.8, level: "$$" },
    diets: ["vegetarian"], moods: ["healthy", "comfort"],
    gradient: "linear-gradient(135deg, #2D6940 0%, #5C8A3A 100%)",
    summary: "Épinards et moutarde verte mixés au beurre, cubes de paneer dorés.",
    story: "Saag = mélange de feuilles vertes (épinards, moutarde, fenugrec selon saison). Le paneer maison se fait en 30 min avec lait + citron. Plat de cuisinière.",
    validator: { name: "Vikram Singh", role: "Chef · Adda Indian Canteen", city: "Long Island City, NY" },
    category: "ragoût", allergens: ["lait"],
    ingredients: [
      { name: "Épinards frais", qty: 800, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Moutarde verte (sarson)", qty: 200, unit: "g", tags: ["produce", "south-asian"], rare: true, substitutes: ["double épinards"] },
      { name: "Paneer", qty: 300, unit: "g", tags: ["south-asian"], rare: true, substitutes: ["paneer maison : 2L lait + 60ml citron"] },
      { name: "Oignon jaune", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Tomate", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Pâte gingembre-ail", qty: 2, unit: "c.s.", tags: ["south-asian"] },
      { name: "Cumin entier", qty: 1, unit: "c.c.", tags: ["pantry"] },
      { name: "Garam masala", qty: 1, unit: "c.c.", tags: ["south-asian", "specialty"], rare: true },
      { name: "Beurre clarifié (ghee)", qty: 60, unit: "g", tags: ["south-asian", "specialty"] },
      { name: "Crème épaisse", qty: 60, unit: "ml", tags: ["supermarket"] },
      { name: "Cayenne", qty: 0.5, unit: "c.c.", tags: ["pantry"] }
    ],
    steps: [
      { title: "Blanchir verts", instruction: "Plonger épinards + moutarde 90 sec eau bouillante salée. Glacer. Mixer en purée semi-fine.", time: 8 },
      { title: "Paneer doré", instruction: "Cubes 2 cm, dorer dans ghee 6 min. Réserver.", time: 8 },
      { title: "Base", instruction: "Cumin + oignon 5 min, ail-gingembre 1 min, tomate + cayenne 4 min.", time: 11 },
      { title: "Saag", instruction: "Verser purée verte, mijoter 12 min. Crème, garam masala. Glisser paneer 5 min.", time: 17 }
    ]
  },

  {
    id: "samosa",
    title: "Samosas pommes de terre-petits pois",
    origin: { country: "Inde / UK", region: "Pendjab", flag: "🇮🇳" },
    auth: 89, duration: 90, servings: 6, difficulty: 2,
    budget: { perPerson: 2.5, level: "$" },
    diets: ["vegan", "vegetarian", "dairy-free"], moods: ["street", "festive"],
    gradient: "linear-gradient(135deg, #D9A441 0%, #5C8A3A 100%)",
    summary: "Triangles frits croustillants, farce épicée pommes de terre, petits pois, gingembre.",
    story: "Origine perse, adopté par toute l'Asie. La pâte (maida + carom + ghee) doit être travaillée pour devenir feuilletée. Forme cone à fermer hermétiquement, sinon huile s'infiltre.",
    validator: { name: "Vikram Singh", role: "Chef · Adda Indian Canteen", city: "Long Island City, NY" },
    category: "ragoût", allergens: ["gluten"],
    ingredients: [
      { name: "Farine T55", qty: 250, unit: "g", tags: ["pantry"] },
      { name: "Graines de carom (ajwain)", qty: 1, unit: "c.c.", tags: ["south-asian", "spice"], rare: true },
      { name: "Ghee fondu", qty: 4, unit: "c.s.", tags: ["south-asian", "specialty"] },
      { name: "Pommes de terre", qty: 600, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Petits pois (frais ou surgelés)", qty: 200, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Gingembre frais", qty: 20, unit: "g", tags: ["produce", "asian"] },
      { name: "Piment vert", qty: 2, unit: "pièce", tags: ["produce"] },
      { name: "Cumin + coriandre + garam masala + amchur (mangue séchée)", qty: 1, unit: "lot", tags: ["south-asian", "spice"] },
      { name: "Coriandre fraîche", qty: 1, unit: "botte", tags: ["produce"] },
      { name: "Huile de friture", qty: 1, unit: "L", tags: ["pantry"] }
    ],
    steps: [
      { title: "Pâte", instruction: "Farine + ajwain + sel + ghee, sabler. Eau peu à peu, pétrir 5 min ferme. Repos 30 min.", time: 38 },
      { title: "Farce", instruction: "Cuire pommes de terre. Écraser grossier, mélanger avec petits pois cuits, gingembre, piment, épices, sel.", time: 25 },
      { title: "Façonnage", instruction: "Bouler la pâte, étaler en disques 12 cm. Couper en deux, former cône, sceller bord à l'eau. Garnir, fermer.", time: 25 },
      { title: "Friture", instruction: "Huile à 160 °C (pas plus chaud), 6 min en retournant : doivent être doré-bronze, croustillants, non gras.", time: 8 }
    ]
  },

  {
    id: "dosa-masala",
    title: "Dosa Masala (sud-Inde)",
    origin: { country: "Inde / UK", region: "Karnataka", flag: "🇮🇳" },
    auth: 92, duration: 1500, servings: 4, difficulty: 3,
    budget: { perPerson: 3.0, level: "$" },
    diets: ["vegan", "vegetarian", "dairy-free", "gluten-free"], moods: ["healthy", "comfort"],
    gradient: "linear-gradient(135deg, #D9A441 0%, #F5F7EE 100%)",
    summary: "Crêpe craquante de riz et lentilles fermentés, garniture de pommes de terre épicées.",
    story: "Petit-déjeuner du sud. La pâte fermente 24h — c'est ce qui donne les bulles, le craquant et le goût acide. Servi avec sambar (soupe de lentilles) et chutney de coco.",
    validator: { name: "Vikram Singh", role: "Chef · Adda Indian Canteen", city: "Long Island City, NY" },
    category: "pain", allergens: [],
    ingredients: [
      { name: "Riz idli (à grain court)", qty: 300, unit: "g", tags: ["south-asian", "pantry"] },
      { name: "Urad dal (lentilles noires sans peau)", qty: 100, unit: "g", tags: ["south-asian"], rare: true },
      { name: "Fenugrec graines", qty: 1, unit: "c.c.", tags: ["south-asian", "spice"] },
      { name: "Pommes de terre", qty: 500, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Oignon jaune", qty: 2, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Curcuma", qty: 1, unit: "c.c.", tags: ["pantry"] },
      { name: "Graines de moutarde noire", qty: 1, unit: "c.c.", tags: ["south-asian", "spice"] },
      { name: "Curry leaves fraîches", qty: 1, unit: "branche", tags: ["south-asian", "produce"], rare: true, substitutes: ["aucun substitut idéal"] },
      { name: "Piment vert", qty: 2, unit: "pièce", tags: ["produce"] },
      { name: "Gingembre", qty: 20, unit: "g", tags: ["produce", "asian"] },
      { name: "Huile de tournesol", qty: 6, unit: "c.s.", tags: ["pantry"] }
    ],
    steps: [
      { title: "Tremper", instruction: "Riz + fenugrec + dal séparément, 6h dans eau.", time: 360 },
      { title: "Mixer + fermenter", instruction: "Mixer chaque batch très lisse. Mélanger, sel, laisser fermenter 12 h en lieu chaud (25 °C+). Doit doubler de volume avec bulles.", time: 720 },
      { title: "Aloo masala", instruction: "Cuire pommes de terre, écraser grossier. Tadka : moutarde + curry leaves + oignon + piment + gingembre + curcuma. Mélanger.", time: 25 },
      { title: "Dosa", instruction: "Plaque très chaude légèrement huilée. Verser louche au centre, étaler en spirale fine avec dos de louche. Cuire 2 min jusqu'à doré-craquant.", time: 4 },
      { title: "Service", instruction: "Garnir d'aloo, plier en deux ou en cône. Servir avec sambar + chutney." }
    ]
  },

  {
    id: "kothu-roti",
    title: "Kothu Roti (Sri Lanka)",
    origin: { country: "Inde / UK", region: "Jaffna, Sri Lanka", flag: "🇱🇰" },
    auth: 87, duration: 35, servings: 4, difficulty: 2,
    budget: { perPerson: 5.5, level: "$" },
    diets: ["dairy-free"], moods: ["street", "spicy", "quick"],
    gradient: "linear-gradient(135deg, #C85A3A 0%, #2D6940 100%)",
    summary: "Pain godhamba haché à la spatule sur la plaque chaude, mélangé œufs, légumes, curry.",
    story: "Né dans les food streets du nord du Sri Lanka. Le kothu (= haché) se prépare au son rythmique de la plaque — tap-tap-tap caractéristique. Recette de l'usage des restes (godhamba roti rassis).",
    validator: { name: "Vikram Singh", role: "Chef · Adda Indian Canteen", city: "Long Island City, NY" },
    category: "nouilles", allergens: ["gluten", "œufs"],
    ingredients: [
      { name: "Pain plat (paratha ou godhamba roti)", qty: 4, unit: "pièce", tags: ["south-asian", "supermarket"] },
      { name: "Poulet cuit (restes)", qty: 250, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Œuf", qty: 3, unit: "pièce", tags: ["supermarket"] },
      { name: "Oignon jaune", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Poireau (partie verte)", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Carotte julienne", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Curry leaves", qty: 1, unit: "branche", tags: ["south-asian", "produce"], rare: true },
      { name: "Pâte de curry sri-lankais", qty: 2, unit: "c.s.", tags: ["south-asian"], rare: true, substitutes: ["pâte curry rouge thaï + cumin + cardamome"] },
      { name: "Sauce soja", qty: 2, unit: "c.s.", tags: ["asian"] },
      { name: "Huile de coco", qty: 3, unit: "c.s.", tags: ["se-asian"] },
      { name: "Citron vert", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] }
    ],
    steps: [
      { title: "Préparer roti", instruction: "Couper roti en lanières fines aux ciseaux.", time: 4 },
      { title: "Sauter base", instruction: "Wok très chaud, huile coco, oignon + poireau + carotte 4 min. Curry leaves + pâte curry 1 min.", time: 6 },
      { title: "Œufs + poulet", instruction: "Pousser sur le côté, casser œufs, brouiller. Ajouter poulet effiloché.", time: 4 },
      { title: "Hacher roti", instruction: "Ajouter roti coupés. Soja + sel. Hacher-mélanger à la spatule pendant 4 min : il faut entendre le tap-tap.", time: 5 },
      { title: "Service", instruction: "Citron vert pressé. Servir brûlant." }
    ]
  }
]);
