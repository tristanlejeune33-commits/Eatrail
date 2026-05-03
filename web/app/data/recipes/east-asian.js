/* eatrail · v1.4 — recipes / east-asian
 * Cuisines couvertes : Corée, Japon, Chine.
 * Chaque fichier s'auto-insère dans window.EATRAIL_RECIPES.
 */

window.EATRAIL_RECIPES = (window.EATRAIL_RECIPES || []).concat([

  // ── KOREA ─────────────────────────────────────────────
  {
    id: "bibimbap",
    title: "Bibimbap",
    origin: { country: "Corée", region: "Séoul", flag: "🇰🇷" },
    auth: 92, duration: 35, servings: 4, difficulty: 2,
    budget: { perPerson: 6.5, level: "$$" },
    diets: ["dairy-free"], moods: ["comfort", "healthy", "wow"],
    gradient: "linear-gradient(135deg, #3F8B54 0%, #D9A441 100%)",
    summary: "Le bol coréen iconique : riz chaud, légumes sautés, bœuf mariné, œuf, gochujang.",
    story: "Né dans les cuisines royales de Joseon, le bibimbap est devenu le repas familial par excellence. À NYC, la version Jeonju (avec œuf cru et bœuf cru) reste le marqueur d'authenticité — sinon on glisse vers la version touristique.",
    validator: { name: "Soo-jin Park", role: "Chef · Han Joo Chik Naengmyun", city: "Flushing, NY" },
    category: "bol", allergens: ["gluten", "soja", "œufs", "sésame"],
    ingredients: [
      { name: "Riz à grain court japonica", qty: 320, unit: "g", tags: ["asian", "korean", "japanese", "pantry"] },
      { name: "Bœuf haché 15% (bulgogi cut idéal)", qty: 250, unit: "g", tags: ["butcher", "korean"] },
      { name: "Pâte de gochujang", qty: 3, unit: "c.s.", tags: ["korean", "asian"], rare: true, substitutes: ["sambal oelek + miso (1:1)"] },
      { name: "Huile de sésame grillé", qty: 2, unit: "c.s.", tags: ["asian", "korean", "japanese"] },
      { name: "Épinards frais", qty: 200, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Carotte (julienne)", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Courgette", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Pousses de soja", qty: 150, unit: "g", tags: ["asian", "korean", "produce"] },
      { name: "Œufs de poule", qty: 4, unit: "pièce", tags: ["supermarket", "produce"] },
      { name: "Graines de sésame", qty: 1, unit: "c.s.", tags: ["asian", "pantry"] },
      { name: "Sauce soja coréenne (ganjang)", qty: 2, unit: "c.s.", tags: ["korean", "asian"], rare: true, substitutes: ["sauce soja japonaise"] }
    ],
    steps: [
      { title: "Riz", instruction: "Rincer le riz 3 fois. Cuisson absorption : 1 vol riz / 1,2 vol eau, 18 min couvert + 10 min repos.", time: 30 },
      { title: "Bulgogi express", instruction: "Mariner le bœuf 10 min : sauce soja, sucre roux pincée, ail râpé, sésame, poivre. Saisir 3 min à feu vif.", time: 13 },
      { title: "Légumes namul", instruction: "Blanchir épinards 30 sec, presser, assaisonner sésame + soja. Sauter carotte, courgette, soja séparément 2 min chacun.", time: 12 },
      { title: "Œuf miroir", instruction: "Cuire à la poêle, blanc pris, jaune coulant.", time: 4 },
      { title: "Dressage", instruction: "Riz au fond du bol, légumes en couronne, bœuf au centre, œuf dessus, gochujang à part. Mélanger à table." }
    ]
  },

  {
    id: "bulgogi",
    title: "Bulgogi",
    origin: { country: "Corée", region: "Séoul", flag: "🇰🇷" },
    auth: 94, duration: 40, servings: 4, difficulty: 1,
    budget: { perPerson: 9.0, level: "$$" },
    diets: ["dairy-free"], moods: ["festive", "comfort"],
    gradient: "linear-gradient(135deg, #C85A3A 0%, #3F8B54 100%)",
    summary: "Lamelles de bœuf marinées poire-soja-sésame, grillées vif, à enrouler dans une feuille de laitue.",
    story: "Plat des palais devenu rituel familial. La poire coréenne attendrit la viande sans sucre ajouté. À NYC, le quartier de K-Town (32nd St) est la maison-mère.",
    validator: { name: "Soo-jin Park", role: "Chef · Han Joo Chik Naengmyun", city: "Flushing, NY" },
    category: "bol", allergens: ["soja", "sésame"],
    ingredients: [
      { name: "Faux-filet en très fines lamelles", qty: 600, unit: "g", tags: ["butcher", "korean"] },
      { name: "Poire asiatique (râpée)", qty: 1, unit: "pièce", tags: ["asian", "produce"], rare: true, substitutes: ["pomme + 1 c.c. sucre"] },
      { name: "Sauce soja coréenne", qty: 80, unit: "ml", tags: ["korean", "asian"], rare: true },
      { name: "Sucre roux", qty: 2, unit: "c.s.", tags: ["pantry"] },
      { name: "Huile de sésame grillé", qty: 2, unit: "c.s.", tags: ["asian", "korean"] },
      { name: "Ail (gousses)", qty: 6, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Gingembre frais", qty: 20, unit: "g", tags: ["produce", "asian"] },
      { name: "Oignons verts", qty: 4, unit: "pièce", tags: ["produce", "asian"] },
      { name: "Graines de sésame", qty: 2, unit: "c.s.", tags: ["asian", "pantry"] },
      { name: "Laitue iceberg ou périlla", qty: 1, unit: "pièce", tags: ["produce", "asian"] },
      { name: "Riz blanc cuit", qty: 600, unit: "g", tags: ["pantry", "asian"] }
    ],
    steps: [
      { title: "Marinade", instruction: "Mixer poire, soja, sucre, ail, gingembre, sésame. Recouvrir le bœuf, 30 min à 4 h au frais.", time: 30 },
      { title: "Saisir", instruction: "Plancha ou poêle fonte très chaude. Saisir le bœuf en petites portions, 90 sec par face : il doit caraméliser.", time: 8 },
      { title: "Service", instruction: "Sur table : feuilles de laitue, riz, ssamjang. Chacun monte sa wrap : laitue, bœuf, riz, sauce, on plie en bouchée." }
    ]
  },

  {
    id: "japchae",
    title: "Japchae",
    origin: { country: "Corée", region: "Joseon", flag: "🇰🇷" },
    auth: 90, duration: 50, servings: 4, difficulty: 2,
    budget: { perPerson: 5.4, level: "$" },
    diets: ["dairy-free", "vegetarian"], moods: ["festive", "comfort"],
    gradient: "linear-gradient(135deg, #2D6940 0%, #D9A441 100%)",
    summary: "Vermicelles de patate douce sautés au sésame, légumes croquants — plat de fête.",
    story: "Inventé au XVIIe siècle pour un roi végétarien. Les nouilles dangmyeon (patate douce) sont l'âme du plat — elles restent translucides et al dente.",
    validator: { name: "Soo-jin Park", role: "Chef · Han Joo Chik Naengmyun", city: "Flushing, NY" },
    category: "nouilles", allergens: ["soja", "sésame", "œufs"],
    ingredients: [
      { name: "Vermicelles de patate douce (dangmyeon)", qty: 300, unit: "g", tags: ["korean", "asian"], rare: true },
      { name: "Champignons shiitake frais", qty: 150, unit: "g", tags: ["asian", "produce"] },
      { name: "Épinards frais", qty: 200, unit: "g", tags: ["produce", "supermarket"] },
      { name: "Carotte julienne", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Poivron rouge", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Oignon jaune", qty: 1, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Œuf", qty: 2, unit: "pièce", tags: ["supermarket"] },
      { name: "Sauce soja coréenne", qty: 60, unit: "ml", tags: ["korean", "asian"] },
      { name: "Huile de sésame", qty: 3, unit: "c.s.", tags: ["asian"] },
      { name: "Sucre roux", qty: 1, unit: "c.s.", tags: ["pantry"] },
      { name: "Graines de sésame", qty: 2, unit: "c.s.", tags: ["asian", "pantry"] }
    ],
    steps: [
      { title: "Cuire vermicelles", instruction: "8 min eau bouillante, rincer froid, couper grossièrement aux ciseaux.", time: 10 },
      { title: "Sauter légumes", instruction: "Cuire séparément : épinards blanchis + sésame, oignons, carotte, poivron, shiitake — chaque légume garde sa texture.", time: 15 },
      { title: "Crêpes d'œuf", instruction: "Battre œufs, cuire en fines crêpes, rouler et trancher en lanières.", time: 5 },
      { title: "Mélange final", instruction: "Tout réunir dans un grand bol, sauce soja + sucre + sésame, mélanger doucement à la main.", time: 5 }
    ]
  },

  {
    id: "kimchi-jjigae",
    title: "Kimchi Jjigae",
    origin: { country: "Corée", region: "partout", flag: "🇰🇷" },
    auth: 95, duration: 40, servings: 4, difficulty: 1,
    budget: { perPerson: 5.0, level: "$" },
    diets: ["dairy-free"], moods: ["comfort", "spicy"],
    gradient: "linear-gradient(135deg, #C85A3A 0%, #15211A 100%)",
    summary: "Ragoût bouillonnant de kimchi mûri, porc, tofu — l'âme du quotidien coréen.",
    story: "Le plat-utilitaire qui transforme le kimchi devenu trop fermenté en or. Plus le kimchi est vieux (3 mois+), meilleur le jjigae. Sert d'amorce de tout repas familial.",
    validator: { name: "Soo-jin Park", role: "Chef · Han Joo Chik Naengmyun", city: "Flushing, NY" },
    category: "soupe", allergens: ["soja"],
    ingredients: [
      { name: "Kimchi mûri (3 mois+)", qty: 400, unit: "g", tags: ["korean", "asian"], rare: true, substitutes: ["kimchi standard + 1 c.s. vinaigre"] },
      { name: "Poitrine de porc en lamelles", qty: 250, unit: "g", tags: ["butcher", "korean"] },
      { name: "Tofu ferme", qty: 250, unit: "g", tags: ["asian", "supermarket"] },
      { name: "Pâte de gochujang", qty: 1, unit: "c.s.", tags: ["korean", "asian"], rare: true },
      { name: "Poudre de chili coréenne (gochugaru)", qty: 2, unit: "c.s.", tags: ["korean", "asian"], rare: true, substitutes: ["paprika fumé + cayenne"] },
      { name: "Oignons verts", qty: 4, unit: "pièce", tags: ["produce", "asian"] },
      { name: "Ail (gousses)", qty: 4, unit: "pièce", tags: ["produce", "supermarket"] },
      { name: "Bouillon dashi ou eau", qty: 700, unit: "ml", tags: ["pantry"] },
      { name: "Huile de sésame", qty: 1, unit: "c.s.", tags: ["asian"] }
    ],
    steps: [
      { title: "Saisir porc", instruction: "Dans la casserole, faire sauter porc 4 min avec gochugaru et ail, jusqu'à ce que le gras rende.", time: 5 },
      { title: "Kimchi", instruction: "Ajouter kimchi grossièrement coupé + son jus, sauter 5 min : il doit légèrement caraméliser.", time: 6 },
      { title: "Mijoter", instruction: "Verser bouillon, gochujang. Frémissement 20 min. Goûter, ajuster sel.", time: 22 },
      { title: "Tofu + oignons verts", instruction: "Ajouter tofu en cubes 5 min avant la fin. Garnir oignons verts, sésame. Servir avec riz blanc et banchans.", time: 5 }
    ]
  },

  // ── JAPAN ──────────────────────────────────────────────
  {
    id: "ramen-tonkotsu",
    title: "Ramen Tonkotsu",
    origin: { country: "Japon", region: "Hakata, Fukuoka", flag: "🇯🇵" },
    auth: 91, duration: 720, servings: 4, difficulty: 3,
    budget: { perPerson: 9.4, level: "$$" },
    diets: [], moods: ["comfort", "wow"],
    gradient: "linear-gradient(135deg, #F5F7EE 0%, #D9A441 60%, #15211A 100%)",
    summary: "Bouillon de porc émulsionné jusqu'à la blancheur, nouilles fines, chashu, œuf mariné.",
    story: "Inventé à Fukuoka dans les années 40 dans les yatai. La signature : le bouillon laiteux obtenu par 12h d'ébullition franche qui émulsionne la moelle. À NYC, Sun Noodle (NJ) fournit les vraies nouilles fraîches que tous les ramen-ya utilisent.",
    validator: { name: "Hiroshi Tanaka", role: "Ramen-ya owner · Nakamura", city: "Lower East Side, NY" },
    category: "soupe", allergens: ["gluten", "œufs", "soja", "poisson"],
    ingredients: [
      { name: "Pieds et os de porc", qty: 2500, unit: "g", tags: ["butcher", "asian", "japanese"] },
      { name: "Poitrine de porc (chashu)", qty: 600, unit: "g", tags: ["butcher", "asian"] },
      { name: "Nouilles ramen fraîches Sun Noodle", qty: 600, unit: "g", tags: ["japanese", "asian"], rare: true },
      { name: "Œufs", qty: 4, unit: "pièce", tags: ["supermarket"] },
      { name: "Sauce soja japonaise", qty: 150, unit: "ml", tags: ["japanese", "asian"] },
      { name: "Mirin", qty: 100, unit: "ml", tags: ["japanese", "asian"] },
      { name: "Saké de cuisine", qty: 100, unit: "ml", tags: ["japanese", "asian"] },
      { name: "Pâte miso blanc (shiro)", qty: 60, unit: "g", tags: ["japanese", "asian"] },
      { name: "Algue kombu", qty: 20, unit: "g", tags: ["japanese", "asian"], rare: true },
      { name: "Champignons shiitake séchés", qty: 30, unit: "g", tags: ["japanese", "asian"] },
      { name: "Oignons verts", qty: 6, unit: "pièce", tags: ["produce", "asian"] },
      { name: "Ail (tête)", qty: 1, unit: "tête", tags: ["produce", "supermarket"] },
      { name: "Pousses de bambou (menma)", qty: 100, unit: "g", tags: ["japanese", "asian"], rare: true, substitutes: ["bambou en conserve drainé"] },
      { name: "Algue nori", qty: 4, unit: "feuilles", tags: ["japanese", "asian"] }
    ],
    steps: [
      { title: "Blanchir os", instruction: "Couvrir d'eau, bouillir 10 min vif, jeter, rincer.", time: 15 },
      { title: "Bouillon 10h", instruction: "Os + ail + 5L eau, ÉBULLITION franche (jamais frémissement), 10 à 12h. Remettre eau régulièrement. La graisse doit émulsionner — bouillon laiteux.", time: 600 },
      { title: "Chashu", instruction: "Rouler la poitrine, ficeler. Braiser 2h dans soja + mirin + saké + sucre + ail + gingembre. Réserver dans son jus.", time: 120 },
      { title: "Ajitsuke tamago", instruction: "Œufs 6 min 30 dans eau bouillante. Glacer. Mariner 4h dans le jus de chashu dilué moitié eau.", time: 240 },
      { title: "Tare miso", instruction: "Mélanger miso + soja + un peu de bouillon dans chaque bol.", time: 2 },
      { title: "Dressage", instruction: "Pocher nouilles 90 sec. Verser bouillon brûlant sur le tare. Ajouter nouilles, chashu, demi-œuf, menma, oignons verts, nori." }
    ]
  },

  {
    id: "tonkatsu",
    title: "Tonkatsu",
    origin: { country: "Japon", region: "Tokyo", flag: "🇯🇵" },
    auth: 90, duration: 35, servings: 4, difficulty: 2,
    budget: { perPerson: 7.5, level: "$$" },
    diets: [], moods: ["comfort", "quick", "wow"],
    gradient: "linear-gradient(135deg, #D9A441 0%, #C85A3A 100%)",
    summary: "Côtelette de porc panée au panko, frite légère, sauce tonkatsu, chou en julienne fine.",
    story: "Yōshoku (cuisine occidentale adaptée) du début XXe à Tokyo. Le panko gros grains donne le crunch léger qu'aucune chapelure occidentale ne réplique. Le chou cru à côté allège — non négociable.",
    validator: { name: "Hiroshi Tanaka", role: "Ramen-ya owner · Nakamura", city: "Lower East Side, NY" },
    category: "ragoût", allergens: ["gluten", "œufs", "soja"],
    ingredients: [
      { name: "Côtelettes de porc (3 cm épaisseur)", qty: 4, unit: "pièce", tags: ["butcher", "supermarket"] },
      { name: "Panko japonais", qty: 200, unit: "g", tags: ["japanese", "asian"], rare: true, substitutes: ["chapelure très grossière"] },
      { name: "Farine T55", qty: 80, unit: "g", tags: ["pantry"] },
      { name: "Œuf", qty: 2, unit: "pièce", tags: ["supermarket"] },
      { name: "Huile de friture neutre", qty: 800, unit: "ml", tags: ["pantry"] },
      { name: "Sauce tonkatsu (Bull-Dog)", qty: 100, unit: "ml", tags: ["japanese", "asian"], rare: true, substitutes: ["worcestershire + ketchup + miel (2:2:1)"] },
      { name: "Chou pointu", qty: 0.5, unit: "tête", tags: ["produce", "supermarket"] },
      { name: "Riz japonica cuit", qty: 600, unit: "g", tags: ["pantry", "asian"] }
    ],
    steps: [
      { title: "Préparer porc", instruction: "Inciser le gras, attendrir au dos d'un couteau. Saler, poivrer.", time: 4 },
      { title: "Panure", instruction: "Tremper farine → œuf battu → panko. Bien presser le panko.", time: 4 },
      { title: "Friture", instruction: "Huile à 170 °C, 6 min en retournant à mi-cuisson. Égoutter sur grille (pas papier).", time: 8 },
      { title: "Service", instruction: "Trancher en bandes 2 cm. Servir avec chou en julienne très fine, sauce tonkatsu et riz blanc." }
    ]
  },

  {
    id: "yakitori",
    title: "Yakitori (3 brochettes maison)",
    origin: { country: "Japon", region: "Tokyo", flag: "🇯🇵" },
    auth: 88, duration: 45, servings: 4, difficulty: 2,
    budget: { perPerson: 6.8, level: "$$" },
    diets: ["dairy-free"], moods: ["street", "festive"],
    gradient: "linear-gradient(135deg, #15211A 0%, #C85A3A 100%)",
    summary: "Brochettes de poulet (cuisse, peau, négima) glacées à la sauce tare, grillées vif.",
    story: "Spécialité des izakayas japonaises. Trois brochettes signatures : momo (cuisse), kawa (peau croustillante), negima (cuisse + poireau japonais). La sauce tare se réutilise des années dans un bon yakitoriya.",
    validator: { name: "Hiroshi Tanaka", role: "Ramen-ya owner · Nakamura", city: "Lower East Side, NY" },
    category: "ragoût", allergens: ["soja"],
    ingredients: [
      { name: "Cuisses de poulet désossées avec peau", qty: 800, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Poireau japonais (negi)", qty: 2, unit: "pièce", tags: ["japanese", "asian", "produce"], rare: true, substitutes: ["partie blanche de poireau"] },
      { name: "Sauce soja japonaise", qty: 150, unit: "ml", tags: ["japanese", "asian"] },
      { name: "Mirin", qty: 100, unit: "ml", tags: ["japanese", "asian"] },
      { name: "Saké", qty: 80, unit: "ml", tags: ["japanese", "asian"] },
      { name: "Sucre roux", qty: 40, unit: "g", tags: ["pantry"] },
      { name: "Gingembre", qty: 1, unit: "morceau", tags: ["produce", "asian"] },
      { name: "Pics en bambou", qty: 12, unit: "pièce", tags: ["pantry"] }
    ],
    steps: [
      { title: "Tare", instruction: "Réduire soja + mirin + saké + sucre + gingembre 15 min jusqu'à sirupeux nappant.", time: 17 },
      { title: "Brochettes", instruction: "Cuisse en cubes 3 cm. Monter alternance cuisse + tronçons de negi sur les pics trempés.", time: 8 },
      { title: "Grill", instruction: "Plancha très chaude ou grill, 3 min par face. Laquer 2 fois avec la tare en fin de cuisson.", time: 8 }
    ]
  },

  {
    id: "onigiri-saumon",
    title: "Onigiri saumon-umeboshi",
    origin: { country: "Japon", region: "partout", flag: "🇯🇵" },
    auth: 87, duration: 35, servings: 4, difficulty: 1,
    budget: { perPerson: 4.3, level: "$" },
    diets: ["dairy-free", "pescatarian"], moods: ["quick", "street"],
    gradient: "linear-gradient(135deg, #F5F7EE 0%, #C85A3A 100%)",
    summary: "Boules de riz triangulaires, garniture saumon grillé ou prune marinée, ceinture de nori.",
    story: "L'aliment-bento universel. Forme triangulaire pour la prise en main. Saumon ou umeboshi sont les garnitures de base — chaque famille a sa préférée.",
    validator: { name: "Hiroshi Tanaka", role: "Ramen-ya owner · Nakamura", city: "Lower East Side, NY" },
    category: "bol", allergens: ["poisson"],
    ingredients: [
      { name: "Riz japonica", qty: 400, unit: "g", tags: ["pantry", "asian"] },
      { name: "Filet de saumon frais", qty: 250, unit: "g", tags: ["fish", "supermarket"] },
      { name: "Umeboshi (prune marinée)", qty: 6, unit: "pièce", tags: ["japanese", "asian"], rare: true },
      { name: "Feuilles de nori", qty: 4, unit: "pièce", tags: ["japanese", "asian"] },
      { name: "Sel marin", qty: 1, unit: "c.c.", tags: ["pantry"] },
      { name: "Graines de sésame noir", qty: 1, unit: "c.s.", tags: ["asian", "pantry"] }
    ],
    steps: [
      { title: "Riz", instruction: "Rincer 3 fois, cuisson absorption (1:1.1), 18 min couvert + 10 min repos.", time: 30 },
      { title: "Saumon", instruction: "Saler, griller 4 min par face. Effilocher à la fourchette.", time: 9 },
      { title: "Façonner", instruction: "Mains humides + sel. 1 boule = 1/2 tasse de riz, creuser, déposer garniture, refermer en triangle. Ceinturer de nori." }
    ]
  },

  // ── CHINA ──────────────────────────────────────────────
  {
    id: "dan-dan-mian",
    title: "Dan Dan Mian",
    origin: { country: "Chine", region: "Sichuan, Chengdu", flag: "🇨🇳" },
    auth: 90, duration: 30, servings: 4, difficulty: 2,
    budget: { perPerson: 4.8, level: "$" },
    diets: ["dairy-free"], moods: ["quick", "spicy", "street"],
    gradient: "linear-gradient(135deg, #C85A3A 0%, #15211A 100%)",
    summary: "Nouilles sichuanaises au porc émincé, sauce sésame-piment, poivre sichuan, douleur-engourdissement.",
    story: "Vendu dans les rues de Chengdu par des marchands ambulants qui portaient une palanche (« dan »). La signature ma-la (engourdissant + brûlant) vient du poivre du Sichuan ET du chili. Il faut bien mélanger AU MOMENT de manger pour que la sauce nappe les nouilles.",
    validator: { name: "Liu Wei", role: "Chef · Szechuan Mountain House", city: "Flushing, Queens" },
    category: "nouilles", allergens: ["gluten", "arachides", "sésame", "soja"],
    ingredients: [
      { name: "Nouilles aux œufs sèches (style chinois)", qty: 400, unit: "g", tags: ["asian"] },
      { name: "Porc haché", qty: 250, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Légume conservé sichuan (ya cai)", qty: 80, unit: "g", tags: ["asian"], rare: true, substitutes: ["choucroute pressée"] },
      { name: "Pâte de sésame chinoise (zhi ma jiang)", qty: 4, unit: "c.s.", tags: ["asian"], rare: true, substitutes: ["tahini + 1 c.c. huile sésame"] },
      { name: "Huile au piment sichuan (lao gan ma)", qty: 4, unit: "c.s.", tags: ["asian"], rare: true },
      { name: "Sauce soja noire", qty: 2, unit: "c.s.", tags: ["asian"] },
      { name: "Vinaigre noir Chinkiang", qty: 1, unit: "c.s.", tags: ["asian"], rare: true },
      { name: "Poivre du Sichuan (toasté + moulu)", qty: 1, unit: "c.c.", tags: ["asian", "spice"], rare: true },
      { name: "Sucre blanc", qty: 1, unit: "c.c.", tags: ["pantry"] },
      { name: "Ail", qty: 3, unit: "gousses", tags: ["produce", "supermarket"] },
      { name: "Oignons verts", qty: 4, unit: "pièce", tags: ["produce", "asian"] },
      { name: "Cacahuètes torréfiées", qty: 60, unit: "g", tags: ["pantry", "asian"] }
    ],
    steps: [
      { title: "Sauce", instruction: "Au fond de chaque bol : ail râpé, soja, vinaigre, sucre, pâte sésame, huile piment, poivre sichuan. Ne pas mélanger.", time: 5 },
      { title: "Topping porc", instruction: "Saisir porc à sec dans wok jusqu'à brun-croquant, 8 min. Ajouter ya cai, sauter 2 min.", time: 11 },
      { title: "Nouilles", instruction: "Cuire al dente, 4 min eau bouillante.", time: 5 },
      { title: "Dressage", instruction: "Égoutter nouilles, déposer sur la sauce. Topping porc, oignons verts, cacahuètes concassées. Mélanger AU MOMENT de manger." }
    ]
  },

  {
    id: "mapo-tofu",
    title: "Mapo Tofu",
    origin: { country: "Chine", region: "Sichuan, Chengdu", flag: "🇨🇳" },
    auth: 93, duration: 30, servings: 4, difficulty: 2,
    budget: { perPerson: 4.2, level: "$" },
    diets: ["dairy-free"], moods: ["quick", "spicy", "comfort"],
    gradient: "linear-gradient(135deg, #2D6940 0%, #C85A3A 100%)",
    summary: "Tofu soyeux nappé d'une sauce ma-la au bœuf, douban et poivre sichuan. La signature de Chengdu.",
    story: "Inventé au XIXe par une vieille dame (Ma Po = mamie au visage marqué) qui tenait un boui-boui à Chengdu. La signature : pâte de fève fermentée Pixian (douban), poivre sichuan torréfié frais, et le tofu soyeux qui doit rester intact.",
    validator: { name: "Liu Wei", role: "Chef · Szechuan Mountain House", city: "Flushing, Queens" },
    category: "ragoût", allergens: ["soja"],
    ingredients: [
      { name: "Tofu soyeux", qty: 500, unit: "g", tags: ["asian", "supermarket"] },
      { name: "Bœuf haché", qty: 200, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Pâte de douban Pixian", qty: 2, unit: "c.s.", tags: ["asian"], rare: true, substitutes: ["pâte de fève noire fermentée"] },
      { name: "Pâte de haricots noirs fermentés (douchi)", qty: 1, unit: "c.s.", tags: ["asian"], rare: true },
      { name: "Poivre du Sichuan (toasté + moulu)", qty: 1, unit: "c.c.", tags: ["asian", "spice"], rare: true },
      { name: "Sauce soja claire", qty: 2, unit: "c.s.", tags: ["asian"] },
      { name: "Bouillon de bœuf", qty: 250, unit: "ml", tags: ["pantry", "supermarket"] },
      { name: "Ail", qty: 4, unit: "gousses", tags: ["produce", "supermarket"] },
      { name: "Gingembre frais", qty: 20, unit: "g", tags: ["produce", "asian"] },
      { name: "Oignons verts", qty: 3, unit: "pièce", tags: ["produce", "asian"] },
      { name: "Fécule de maïs", qty: 1, unit: "c.s.", tags: ["pantry"] }
    ],
    steps: [
      { title: "Préparer tofu", instruction: "Cubes 2 cm, blanchir 1 min eau salée tiède. Réserver.", time: 4 },
      { title: "Saisir bœuf", instruction: "Wok bien chaud, bœuf à sec jusqu'à brun-croquant, 6 min. Réserver hors gras.", time: 7 },
      { title: "Sauce", instruction: "Dans le gras, frire douban + douchi + ail + gingembre 1 min. Bouillon, soja, sucre. Frémir 5 min.", time: 7 },
      { title: "Tofu + finition", instruction: "Glisser le tofu, mijoter 4 min. Lier avec fécule diluée. Hors feu : poivre sichuan, oignons verts. Servir riz blanc.", time: 6 }
    ]
  },

  {
    id: "char-siu",
    title: "Char Siu (porc laqué cantonais)",
    origin: { country: "Chine", region: "Canton, Hong Kong", flag: "🇨🇳" },
    auth: 91, duration: 180, servings: 6, difficulty: 2,
    budget: { perPerson: 6.0, level: "$$" },
    diets: ["dairy-free"], moods: ["festive", "wow"],
    gradient: "linear-gradient(135deg, #C85A3A 0%, #D9A441 100%)",
    summary: "Échine de porc marinée au miel, hoisin, cinq-épices, rôtie longuement avec laquage répété.",
    story: "Star des vitrines de Chinatown : la viande pendue, brillante, rouge-laquée. Originellement cuit suspendu dans des fours de boulanger en argile. Servir avec riz blanc et sauce piment fait fondre les bols.",
    validator: { name: "Liu Wei", role: "Chef · Szechuan Mountain House", city: "Flushing, Queens" },
    category: "ragoût", allergens: ["soja", "gluten"],
    ingredients: [
      { name: "Échine de porc en bandes 5 cm", qty: 1500, unit: "g", tags: ["butcher", "asian"] },
      { name: "Sauce hoisin", qty: 100, unit: "ml", tags: ["asian"], rare: true },
      { name: "Sauce soja noire", qty: 60, unit: "ml", tags: ["asian"] },
      { name: "Miel liquide", qty: 80, unit: "g", tags: ["pantry"] },
      { name: "Vin de cuisson chinois (Shaoxing)", qty: 60, unit: "ml", tags: ["asian"], rare: true, substitutes: ["xérès sec"] },
      { name: "Cinq-épices chinois", qty: 1, unit: "c.s.", tags: ["asian", "spice"] },
      { name: "Sauce huître", qty: 2, unit: "c.s.", tags: ["asian"] },
      { name: "Ail", qty: 4, unit: "gousses", tags: ["produce", "supermarket"] },
      { name: "Pâte de fermenté rouge (optionnel)", qty: 1, unit: "c.s.", tags: ["asian"], rare: true }
    ],
    steps: [
      { title: "Marinade", instruction: "Mélanger tous les ingrédients sauce. Recouvrir le porc, 8 h à 24 h au frais.", time: 480 },
      { title: "Cuisson", instruction: "Four 200 °C avec lèchefrite remplie d'eau. Suspendre ou poser sur grille. 35 min côté gras, retourner.", time: 40 },
      { title: "Laquage", instruction: "Mélanger 2 c.s. miel + 2 c.s. marinade. Laquer 3 fois toutes les 5 min en finale, four à 230 °C.", time: 15 },
      { title: "Repos + service", instruction: "Repos 10 min hors feu. Trancher fin. Servir riz blanc, oignons verts, sauce piment.", time: 10 }
    ]
  },

  {
    id: "kung-pao",
    title: "Kung Pao Chicken",
    origin: { country: "Chine", region: "Sichuan", flag: "🇨🇳" },
    auth: 88, duration: 25, servings: 4, difficulty: 2,
    budget: { perPerson: 5.4, level: "$$" },
    diets: ["dairy-free"], moods: ["quick", "spicy"],
    gradient: "linear-gradient(135deg, #D9A441 0%, #C85A3A 100%)",
    summary: "Cubes de poulet sautés vifs, cacahuètes, piments séchés, sauce aigre-douce-piquante.",
    story: "Plat-officier de la cour Qing au XIXe nommé d'après un gouverneur sichuanais. Aux US il est devenu sucré et lourd ; la version Chengdu est sèche, équilibrée, avec le ma-la qui pique.",
    validator: { name: "Liu Wei", role: "Chef · Szechuan Mountain House", city: "Flushing, Queens" },
    category: "nouilles", allergens: ["gluten", "soja", "arachides"],
    ingredients: [
      { name: "Filets de poulet en cubes 1,5 cm", qty: 500, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Cacahuètes torréfiées non salées", qty: 100, unit: "g", tags: ["pantry", "asian"] },
      { name: "Piments séchés chinois entiers", qty: 8, unit: "pièce", tags: ["asian", "spice"], rare: true },
      { name: "Poivre du Sichuan", qty: 1, unit: "c.c.", tags: ["asian", "spice"], rare: true },
      { name: "Sauce soja claire", qty: 3, unit: "c.s.", tags: ["asian"] },
      { name: "Vinaigre Chinkiang", qty: 2, unit: "c.s.", tags: ["asian"], rare: true },
      { name: "Sucre roux", qty: 2, unit: "c.s.", tags: ["pantry"] },
      { name: "Vin de Shaoxing", qty: 2, unit: "c.s.", tags: ["asian"], rare: true },
      { name: "Fécule de maïs", qty: 1, unit: "c.s.", tags: ["pantry"] },
      { name: "Ail", qty: 3, unit: "gousses", tags: ["produce", "supermarket"] },
      { name: "Gingembre", qty: 15, unit: "g", tags: ["produce", "asian"] },
      { name: "Oignons verts", qty: 4, unit: "pièce", tags: ["produce", "asian"] }
    ],
    steps: [
      { title: "Mariner poulet", instruction: "Soja + Shaoxing + fécule + sel sur le poulet, 10 min.", time: 10 },
      { title: "Sauce", instruction: "Mélanger soja + vinaigre + sucre + 60 ml d'eau + reste fécule.", time: 3 },
      { title: "Wok", instruction: "Huile fumante, frire piments + poivre sichuan 30 sec (sans brûler). Ajouter poulet, sauter 4 min jusqu'à doré.", time: 5 },
      { title: "Finition", instruction: "Ail + gingembre 30 sec, verser sauce, 1 min. Cacahuètes + oignons verts. Servir riz blanc.", time: 3 }
    ]
  },

  {
    id: "xiaolongbao",
    title: "Xiao Long Bao (raviolis-soupe de Shanghai)",
    origin: { country: "Chine", region: "Shanghai", flag: "🇨🇳" },
    auth: 95, duration: 180, servings: 4, difficulty: 3,
    budget: { perPerson: 5.8, level: "$$" },
    diets: ["dairy-free"], moods: ["wow", "festive"],
    gradient: "linear-gradient(135deg, #F5F7EE 0%, #15211A 100%)",
    summary: "Bouchées vapeur de porc dans une fine pâte, contenant un bouillon en gelée qui fond à la cuisson.",
    story: "Inventé à Nanxiang (banlieue de Shanghai) en 1875. Le secret : ajouter à la farce de la gelée d'agar (pieds de porc réduits) qui fond à la vapeur et crée le bouillon. Un xiao long bao bien fait a 18 plis sur le dessus.",
    validator: { name: "Liu Wei", role: "Chef · Szechuan Mountain House", city: "Flushing, Queens" },
    category: "raviolis", allergens: ["gluten", "soja"],
    ingredients: [
      { name: "Farine T55", qty: 300, unit: "g", tags: ["pantry"] },
      { name: "Eau bouillante", qty: 150, unit: "ml", tags: ["pantry"] },
      { name: "Porc haché 30%", qty: 350, unit: "g", tags: ["butcher", "supermarket"] },
      { name: "Pieds de porc", qty: 500, unit: "g", tags: ["butcher", "asian"] },
      { name: "Vin de Shaoxing", qty: 2, unit: "c.s.", tags: ["asian"], rare: true },
      { name: "Sauce soja claire", qty: 2, unit: "c.s.", tags: ["asian"] },
      { name: "Gingembre", qty: 20, unit: "g", tags: ["produce", "asian"] },
      { name: "Oignons verts", qty: 3, unit: "pièce", tags: ["produce", "asian"] },
      { name: "Vinaigre noir Chinkiang (service)", qty: 100, unit: "ml", tags: ["asian"], rare: true }
    ],
    steps: [
      { title: "Gelée bouillon", instruction: "Cuire pieds de porc 3h dans eau couvrant. Filtrer, réduire à 200 ml, refroidir au frigo : doit prendre en gelée. Découper en cubes.", time: 200 },
      { title: "Pâte", instruction: "Verser eau bouillante sur la farine, pétrir 10 min jusqu'à lisse. Repos filmé 30 min.", time: 40 },
      { title: "Farce", instruction: "Mélanger porc + soja + Shaoxing + gingembre râpé + oignons + sel. Incorporer cubes de gelée délicatement.", time: 8 },
      { title: "Façonner", instruction: "Boules 12 g de pâte, étaler en disque 7 cm (centre épais, bord fin). 1 c.c. farce, plisser 18 fois en pinçant le sommet.", time: 40 },
      { title: "Vapeur", instruction: "Vapeur 8 min sur papier ou feuille de chou. Servir avec gingembre julienne dans vinaigre Chinkiang.", time: 8 }
    ]
  }
]);
