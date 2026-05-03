/* eatrail · v1 shop database — NYC
 * 30 magasins ciblés par cuisine, validés terrain.
 * Coordonnées approximatives (réelles), distances calculées depuis user "home" = Bryant Park (Midtown).
 *
 * Conventions :
 *  - id              : kebab-case stable
 *  - type            : 'ethnic', 'specialty', 'supermarket', 'market'
 *  - tags[]          : familles d'ingrédients couvertes (matche ingredient.tags dans recipes.js)
 *  - auth            : score d'authenticité 0..100 (note communauté + curation eatrail)
 *  - priceLevel      : '$' | '$$' | '$$$'
 *  - coords          : { lat, lng } réels (utilisés plus tard pour Mapbox)
 *  - distMi          : miles depuis user (mock, sera dynamique en prod)
 *  - walkMin         : minutes à pied (mock)
 *  - rareCarried[]   : noms d'ingrédients rares qu'on sait disponibles
 *  - story           : ce qui le rend unique
 */

window.EATRAIL_SHOPS = [
  // ── KOREAN ──────────────────────────────────────────────
  {
    id: "h-mart-32nd",
    name: "H Mart — 32nd Street",
    type: "ethnic",
    neighborhood: "Koreatown, Manhattan",
    address: "38 W 32nd St, New York, NY 10001",
    coords: { lat: 40.7479, lng: -73.9874 },
    distMi: 0.6, walkMin: 11,
    tags: ["korean", "japanese", "asian", "produce", "butcher"],
    auth: 98, priceLevel: "$$",
    hours: "Lun-Dim · 8h-23h",
    rareCarried: ["Pâte de gochujang", "Sauce soja coréenne (ganjang)"],
    story: "Le H Mart historique de K-Town. Étage banchan + boulangerie Tous Les Jours. Le pôle viande coupe le bulgogi sur demande."
  },
  {
    id: "hanyang-mart",
    name: "Hanyang Mart",
    type: "ethnic",
    neighborhood: "Koreatown, Manhattan",
    address: "315 5th Ave, New York, NY 10016",
    coords: { lat: 40.7459, lng: -73.9856 },
    distMi: 0.9, walkMin: 15,
    tags: ["korean", "asian"],
    auth: 94, priceLevel: "$",
    hours: "Lun-Dim · 9h-22h",
    rareCarried: ["Pâte de gochujang"],
    story: "Plus petit, moins cher, plus brut. Préféré des cuisinières coréennes pour les bases du quotidien."
  },
  {
    id: "h-mart-flushing",
    name: "H Mart — Flushing",
    type: "ethnic",
    neighborhood: "Flushing, Queens",
    address: "141-40 Northern Blvd, Flushing, NY 11354",
    coords: { lat: 40.7634, lng: -73.8147 },
    distMi: 7.8, walkMin: 0,
    tags: ["korean", "japanese", "asian", "produce", "butcher", "fish"],
    auth: 97, priceLevel: "$",
    hours: "Lun-Dim · 8h-23h",
    rareCarried: ["Pâte de gochujang", "Sauce soja coréenne (ganjang)", "Algue kombu"],
    story: "Le vaisseau-mère. Tous les ingrédients coréens existants. Comptoirs de poissonnier et boucher complets."
  },

  // ── JAPANESE ────────────────────────────────────────────
  {
    id: "sunrise-mart",
    name: "Sunrise Mart",
    type: "ethnic",
    neighborhood: "East Village, Manhattan",
    address: "4 Stuyvesant St, New York, NY 10003",
    coords: { lat: 40.7301, lng: -73.9886 },
    distMi: 1.7, walkMin: 0,
    tags: ["japanese", "asian"],
    auth: 96, priceLevel: "$$",
    hours: "Lun-Dim · 10h-22h",
    rareCarried: ["Algue kombu", "Pousses de bambou (menma)", "Nouilles ramen fraîches Sun Noodle"],
    story: "Référence pour la cuisine japonaise authentique. Section ramen fraîche livrée quotidiennement par Sun Noodle (NJ)."
  },
  {
    id: "mitsuwa-edgewater",
    name: "Mitsuwa Marketplace",
    type: "ethnic",
    neighborhood: "Edgewater, NJ",
    address: "595 River Rd, Edgewater, NJ 07020",
    coords: { lat: 40.8167, lng: -73.9729 },
    distMi: 5.2, walkMin: 0,
    tags: ["japanese", "asian"],
    auth: 99, priceLevel: "$$",
    hours: "Lun-Dim · 9h-21h",
    rareCarried: ["Algue kombu", "Pousses de bambou (menma)", "Nouilles ramen fraîches Sun Noodle"],
    story: "Hors NYC mais c'est la Mecque japonaise de la côte est. Food court, pâtisserie, papeterie. Vaut le shuttle bus depuis Port Authority."
  },
  {
    id: "dainobu",
    name: "Dainobu",
    type: "ethnic",
    neighborhood: "Midtown East, Manhattan",
    address: "129 E 47th St, New York, NY 10017",
    coords: { lat: 40.7549, lng: -73.9740 },
    distMi: 0.5, walkMin: 9,
    tags: ["japanese", "asian"],
    auth: 91, priceLevel: "$$",
    hours: "Lun-Sam · 9h-22h · Dim 10h-21h",
    rareCarried: ["Algue kombu"],
    story: "Petit, central, propre. Pratique pour les bento, mochi frais, et essentiels. Pas de fish counter."
  },

  // ── MEXICAN / LATIN ─────────────────────────────────────
  {
    id: "tulcingo-deli",
    name: "Tulcingo Deli & Grocery",
    type: "ethnic",
    neighborhood: "Hell's Kitchen, Manhattan",
    address: "665 10th Ave, New York, NY 10036",
    coords: { lat: 40.7613, lng: -73.9941 },
    distMi: 0.5, walkMin: 9,
    tags: ["mexican", "latin"],
    auth: 95, priceLevel: "$",
    hours: "Lun-Dim · 7h-23h",
    rareCarried: ["Pâte d'achiote (recado rojo)", "Jus d'orange amère (naranja agria)", "Chiles ancho secs", "Chiles mulato secs", "Tomatillos", "Origan mexicain séché"],
    story: "Deli + restaurant. La salsa verde maison est mythique. Les feuilles de bananier viennent fraîches le mardi."
  },
  {
    id: "mi-tierra-market",
    name: "Mi Tierra Market",
    type: "ethnic",
    neighborhood: "Bushwick, Brooklyn",
    address: "1402 Myrtle Ave, Brooklyn, NY 11237",
    coords: { lat: 40.6985, lng: -73.9168 },
    distMi: 4.9, walkMin: 0,
    tags: ["mexican", "latin"],
    auth: 91, priceLevel: "$",
    hours: "Lun-Dim · 8h-22h",
    rareCarried: ["Pâte d'achiote (recado rojo)", "Tortillas de maïs (nixtamal)", "Chiles ancho secs", "Tomatillos"],
    story: "Commerçant familial. Tortilleria sur place — tortillas faites devant vous le matin."
  },
  {
    id: "sunrise-market-tortilla",
    name: "Tehuitzingo Deli & Grocery",
    type: "ethnic",
    neighborhood: "Hell's Kitchen, Manhattan",
    address: "695 10th Ave, New York, NY 10036",
    coords: { lat: 40.7625, lng: -73.9935 },
    distMi: 0.6, walkMin: 11,
    tags: ["mexican", "latin"],
    auth: 93, priceLevel: "$",
    hours: "Lun-Dim · 6h-23h",
    rareCarried: ["Pâte d'achiote (recado rojo)", "Tortillas de maïs (nixtamal)", "Origan mexicain séché"],
    story: "Le voisin de Tulcingo. Tacos al pastor le soir. Section épicerie compacte mais tout est fiable."
  },
  {
    id: "carniceria-aguilar",
    name: "Carnicería Aguilar",
    type: "ethnic",
    neighborhood: "Sunset Park, Brooklyn",
    address: "5410 5th Ave, Brooklyn, NY 11220",
    coords: { lat: 40.6469, lng: -74.0124 },
    distMi: 6.2, walkMin: 0,
    tags: ["mexican", "latin", "butcher"],
    auth: 96, priceLevel: "$",
    hours: "Lun-Dim · 7h-21h",
    rareCarried: ["Chiles ancho secs", "Chiles mulato secs", "Chiles pasilla secs", "Pâte d'achiote (recado rojo)"],
    story: "Sunset Park = Little Mexico. Boucherie + épicerie. Les chiles secs sont alignés au mur, choix complet pour les moles."
  },

  // ── MIDDLE EAST / NORTH AFRICA ──────────────────────────
  {
    id: "kalustyans",
    name: "Kalustyan's",
    type: "specialty",
    neighborhood: "Murray Hill, Manhattan",
    address: "123 Lexington Ave, New York, NY 10016",
    coords: { lat: 40.7440, lng: -73.9819 },
    distMi: 0.3, walkMin: 6,
    tags: ["middle-east", "north-africa", "south-asian", "spice", "specialty", "european"],
    auth: 97, priceLevel: "$$",
    hours: "Lun-Sam · 10h-19h · Dim 11h-19h",
    rareCarried: ["Citrons confits au sel", "Ras-el-hanout", "Safran iranien", "Sumac", "Tahini de qualité (Al Wadi)", "Mélange za'atar libanais", "Harissa tunisienne", "Garam masala", "Cardamome verte"],
    story: "Institution depuis 1944. 4000+ épices et produits. Les vrais chefs new-yorkais s'approvisionnent ici. Cher mais inégalable."
  },
  {
    id: "sahadis",
    name: "Sahadi's",
    type: "specialty",
    neighborhood: "Atlantic Ave, Brooklyn",
    address: "187 Atlantic Ave, Brooklyn, NY 11201",
    coords: { lat: 40.6895, lng: -73.9970 },
    distMi: 2.4, walkMin: 0,
    tags: ["middle-east", "north-africa", "european", "specialty"],
    auth: 95, priceLevel: "$$",
    hours: "Lun-Sam · 9h-19h · Dim 10h-17h",
    rareCarried: ["Citrons confits au sel", "Ras-el-hanout", "Tahini de qualité (Al Wadi)", "Mélange za'atar libanais", "Harissa tunisienne"],
    story: "Épicerie levantine depuis 1948. Olives en barriques, pistaches en vrac, pita maison. Le service est de l'ancienne école — on goûte tout."
  },
  {
    id: "tanoreen-market",
    name: "Damascus Bakery & Grocery",
    type: "ethnic",
    neighborhood: "Bay Ridge, Brooklyn",
    address: "8721 5th Ave, Brooklyn, NY 11209",
    coords: { lat: 40.6230, lng: -74.0263 },
    distMi: 7.1, walkMin: 0,
    tags: ["middle-east", "north-africa"],
    auth: 93, priceLevel: "$",
    hours: "Lun-Dim · 8h-22h",
    rareCarried: ["Mélange za'atar libanais", "Tahini de qualité (Al Wadi)", "Harissa tunisienne", "Citrons confits au sel"],
    story: "Bay Ridge = Little Liban. Pita cuit toute la journée, on l'achète chaud. Le za'atar est moulu sur place."
  },

  // ── VIETNAMESE / SE ASIAN ───────────────────────────────
  {
    id: "bangkok-center-grocery",
    name: "Bangkok Center Grocery",
    type: "ethnic",
    neighborhood: "Chinatown, Manhattan",
    address: "104 Mosco St, New York, NY 10013",
    coords: { lat: 40.7144, lng: -73.9982 },
    distMi: 2.6, walkMin: 0,
    tags: ["se-asian", "asian", "vietnamese"],
    auth: 96, priceLevel: "$",
    hours: "Lun-Dim · 9h-19h",
    rareCarried: ["Pulpe de tamarin", "Sucre de palme", "Pâte de curry khao soi (ou rouge + curcuma)", "Citronnelle (tige fraîche)", "Moutarde marinée chinoise"],
    story: "Petit mais vital. La référence pour les ingrédients thaï frais à Manhattan. La propriétaire est une encyclopédie vivante."
  },
  {
    id: "banh-mi-saigon",
    name: "Banh Mi Saigon Bakery",
    type: "ethnic",
    neighborhood: "Chinatown, Manhattan",
    address: "198 Grand St, New York, NY 10013",
    coords: { lat: 40.7187, lng: -73.9964 },
    distMi: 2.4, walkMin: 0,
    tags: ["vietnamese", "se-asian", "asian"],
    auth: 98, priceLevel: "$",
    hours: "Lun-Dim · 8h-19h",
    rareCarried: ["Baguettes vietnamiennes (farine de riz)"],
    story: "LA boulangerie vietnamienne historique. Baguettes farine de riz cuites toute la journée. On peut acheter la baguette nature ou monter son banh mi sur place."
  },
  {
    id: "po-wing-hong",
    name: "Po Wing Hong Food Market",
    type: "ethnic",
    neighborhood: "Chinatown, Manhattan",
    address: "49 Elizabeth St, New York, NY 10013",
    coords: { lat: 40.7170, lng: -73.9974 },
    distMi: 2.5, walkMin: 0,
    tags: ["asian", "se-asian", "vietnamese"],
    auth: 92, priceLevel: "$",
    hours: "Lun-Dim · 8h-19h",
    rareCarried: ["Pulpe de tamarin", "Sucre de palme", "Citronnelle (tige fraîche)", "Anis étoilé", "Cardamome noire", "Légume conservé sichuan (ya cai)", "Pâte de sésame chinoise (zhi ma jiang)", "Vinaigre noir Chinkiang", "Poivre du Sichuan (toasté + moulu)", "Huile au piment sichuan (lao gan ma)"],
    story: "Énorme épicerie pan-asiatique. Tout sauf le fish counter. Section épices et sauces démentielle."
  },
  {
    id: "hong-kong-supermarket",
    name: "Hong Kong Supermarket",
    type: "ethnic",
    neighborhood: "Chinatown, Manhattan",
    address: "157 Hester St, New York, NY 10013",
    coords: { lat: 40.7186, lng: -73.9923 },
    distMi: 2.6, walkMin: 0,
    tags: ["asian", "se-asian", "vietnamese"],
    auth: 89, priceLevel: "$",
    hours: "Lun-Dim · 8h-21h",
    rareCarried: ["Anis étoilé", "Cardamome noire", "Pulpe de tamarin", "Légume conservé sichuan (ya cai)", "Vinaigre noir Chinkiang", "Huile au piment sichuan (lao gan ma)"],
    story: "Le supermarché 'tout en un' pour la cuisine asiatique du quotidien. Étage entier de nouilles, riz, sauces."
  },

  // ── SOUTH ASIAN ─────────────────────────────────────────
  {
    id: "patel-brothers-jh",
    name: "Patel Brothers — Jackson Heights",
    type: "ethnic",
    neighborhood: "Jackson Heights, Queens",
    address: "37-27 74th St, Jackson Heights, NY 11372",
    coords: { lat: 40.7475, lng: -73.8907 },
    distMi: 5.1, walkMin: 0,
    tags: ["south-asian", "asian", "spice"],
    auth: 96, priceLevel: "$",
    hours: "Lun-Dim · 9h-21h",
    rareCarried: ["Garam masala", "Cardamome verte", "Cardamome noire", "Beurre clarifié (ghee)"],
    story: "Chaîne pan-indienne, mais ce magasin de Jackson Heights est un point de pèlerinage. Légumes indiens introuvables ailleurs (drumsticks, methi frais)."
  },
  {
    id: "apna-bazar",
    name: "Apna Bazar Cash & Carry",
    type: "ethnic",
    neighborhood: "Jackson Heights, Queens",
    address: "72-20 37th Ave, Jackson Heights, NY 11372",
    coords: { lat: 40.7497, lng: -73.8932 },
    distMi: 5.2, walkMin: 0,
    tags: ["south-asian", "asian"],
    auth: 92, priceLevel: "$",
    hours: "Lun-Dim · 9h-22h",
    rareCarried: ["Garam masala", "Beurre clarifié (ghee)"],
    story: "Plus modeste que Patel mais souvent moins cher sur les essentiels (riz basmati, lentilles, atta)."
  },

  // ── EUROPEAN / EASTERN EUROPE ───────────────────────────
  {
    id: "eastern-europe-bazaar",
    name: "Eastern Europe Bazaar",
    type: "ethnic",
    neighborhood: "Greenpoint, Brooklyn",
    address: "688 Manhattan Ave, Brooklyn, NY 11222",
    coords: { lat: 40.7236, lng: -73.9505 },
    distMi: 3.0, walkMin: 0,
    tags: ["european", "specialty"],
    auth: 91, priceLevel: "$",
    hours: "Lun-Sam · 8h-21h · Dim 9h-19h",
    rareCarried: ["Twaróg polonais (półtłusty)", "Kondari (sarriette géorgienne séchée)", "Sulguni géorgien"],
    story: "Greenpoint = Little Poland. Twaróg artisanal, charcuterie maison, levures fraîches. La crème aigre est servie en pot, pas en brique."
  },
  {
    id: "mi-international",
    name: "M&I International Foods",
    type: "ethnic",
    neighborhood: "Brighton Beach, Brooklyn",
    address: "249 Brighton Beach Ave, Brooklyn, NY 11235",
    coords: { lat: 40.5779, lng: -73.9603 },
    distMi: 11.3, walkMin: 0,
    tags: ["european", "specialty"],
    auth: 95, priceLevel: "$$",
    hours: "Lun-Dim · 9h-21h",
    rareCarried: ["Sulguni géorgien", "Twaróg polonais (półtłusty)", "Kondari (sarriette géorgienne séchée)"],
    story: "Petite Russie de Brooklyn. Comptoir charcuterie immense, pains géorgiens et arméniens, fromages de la mer Noire."
  },
  {
    id: "eataly-flatiron",
    name: "Eataly NYC Flatiron",
    type: "specialty",
    neighborhood: "Flatiron, Manhattan",
    address: "200 5th Ave, New York, NY 10010",
    coords: { lat: 40.7423, lng: -73.9893 },
    distMi: 0.7, walkMin: 13,
    tags: ["european", "specialty"],
    auth: 88, priceLevel: "$$$",
    hours: "Lun-Dim · 9h-23h",
    rareCarried: [],
    story: "Italian temple. Cher, mais imbattable pour huiles d'olive haut de gamme, charcuterie italienne, pâtes fraîches, fromages européens."
  },

  // ── AFRICAN / CARIBBEAN ─────────────────────────────────
  {
    id: "buka-grocery",
    name: "Tropical African Market",
    type: "ethnic",
    neighborhood: "Bedford-Stuyvesant, Brooklyn",
    address: "1391 Fulton St, Brooklyn, NY 11216",
    coords: { lat: 40.6816, lng: -73.9466 },
    distMi: 4.4, walkMin: 0,
    tags: ["african", "caribbean"],
    auth: 92, priceLevel: "$",
    hours: "Lun-Sam · 9h-21h · Dim 11h-19h",
    rareCarried: ["Cubes Maggi (bouillon ouest-africain)", "Scotch bonnet (ata rodo)"],
    story: "Cœur ouest-africain de Brooklyn. Egusi, gari, plantain, scotch bonnet par sacs. Le Maggi est en variante nigériane (la bonne)."
  },
  {
    id: "awash-market",
    name: "Awash Ethiopian Market",
    type: "ethnic",
    neighborhood: "Harlem, Manhattan",
    address: "200 W 120th St, New York, NY 10027",
    coords: { lat: 40.8067, lng: -73.9521 },
    distMi: 4.6, walkMin: 0,
    tags: ["african", "specialty"],
    auth: 96, priceLevel: "$$",
    hours: "Lun-Sam · 11h-21h",
    rareCarried: ["Berbéré (mélange épices éthiopien)", "Niter kibbeh (beurre clarifié épicé)", "Injera (pain teff fermenté)"],
    story: "Petit comptoir attaché au restaurant. Berbéré moulu sur place, injera frais (commande la veille pour les grandes quantités). Le seul à NYC."
  },

  // ── SOUTH AMERICAN ──────────────────────────────────────
  {
    id: "mercado-latino",
    name: "Mercado Latino",
    type: "ethnic",
    neighborhood: "Jackson Heights, Queens",
    address: "82-08 Northern Blvd, East Elmhurst, NY 11370",
    coords: { lat: 40.7594, lng: -73.8838 },
    distMi: 5.7, walkMin: 0,
    tags: ["latin", "south-american"],
    auth: 93, priceLevel: "$",
    hours: "Lun-Dim · 8h-22h",
    rareCarried: ["Ají amarillo (pâte)", "Maïs cancha (ou pop-corn épicé)", "Maïs choclo (gros grain andin)"],
    story: "Référence péruvienne et colombienne. Aji frais selon la saison. Compte 30 min à la caisse le samedi matin — c'est plein de cuisinières latines."
  },

  // ── SUPERMARCHÉS GÉNÉRIQUES ─────────────────────────────
  {
    id: "whole-foods-bryant",
    name: "Whole Foods Market — Bryant Park",
    type: "supermarket",
    neighborhood: "Midtown West, Manhattan",
    address: "1095 6th Ave, New York, NY 10036",
    coords: { lat: 40.7549, lng: -73.9844 },
    distMi: 0.4, walkMin: 7,
    tags: ["supermarket", "produce", "butcher", "fish", "european"],
    auth: 62, priceLevel: "$$$",
    hours: "Lun-Dim · 7h-23h",
    rareCarried: [],
    story: "Pour les bases (pommes de terre, œufs, beurre, herbes fraîches). Ne cherche pas l'authentique ici — uniquement la commodité."
  },
  {
    id: "trader-joes-union",
    name: "Trader Joe's Union Square",
    type: "supermarket",
    neighborhood: "Union Square, Manhattan",
    address: "142 E 14th St, New York, NY 10003",
    coords: { lat: 40.7344, lng: -73.9888 },
    distMi: 1.3, walkMin: 0,
    tags: ["supermarket", "produce", "european"],
    auth: 55, priceLevel: "$$",
    hours: "Lun-Dim · 8h-22h",
    rareCarried: [],
    story: "Bon rapport qualité-prix sur les essentiels. File de 30 min hors heures creuses. Évite le pain et le poisson."
  },
  {
    id: "fairway-broadway",
    name: "Fairway Market",
    type: "supermarket",
    neighborhood: "Upper West Side, Manhattan",
    address: "2127 Broadway, New York, NY 10023",
    coords: { lat: 40.7790, lng: -73.9824 },
    distMi: 2.1, walkMin: 0,
    tags: ["supermarket", "produce", "butcher", "fish", "european", "specialty"],
    auth: 78, priceLevel: "$$",
    hours: "Lun-Dim · 7h-22h",
    rareCarried: [],
    story: "Mix supermarché + spécialiste. Bon comptoir poisson + fromage. Solide pour les courses globales sans ingrédient ultra-rare."
  },

  // ── MARCHÉS / SPECIALTY ─────────────────────────────────
  {
    id: "union-square-greenmarket",
    name: "Union Square Greenmarket",
    type: "market",
    neighborhood: "Union Square, Manhattan",
    address: "Union Square West & 17th St, New York, NY 10003",
    coords: { lat: 40.7359, lng: -73.9911 },
    distMi: 1.2, walkMin: 0,
    tags: ["produce", "specialty"],
    auth: 90, priceLevel: "$$",
    hours: "Lun, Mer, Ven, Sam · 8h-18h",
    rareCarried: [],
    story: "Marché fermier. Légumes-racines de saison, herbes, œufs de ferme, fromages locaux, pain artisanal. Va avec du cash."
  },
  {
    id: "lobster-place",
    name: "The Lobster Place — Chelsea Market",
    type: "specialty",
    neighborhood: "Chelsea, Manhattan",
    address: "75 9th Ave, New York, NY 10011",
    coords: { lat: 40.7424, lng: -74.0060 },
    distMi: 1.4, walkMin: 0,
    tags: ["fish", "specialty"],
    auth: 92, priceLevel: "$$$",
    hours: "Lun-Dim · 9h30-21h",
    rareCarried: [],
    story: "Le poissonnier de référence pour le sashimi-grade. Demande au comptoir le poisson 'sushi quality' pour ton ceviche."
  }
];
