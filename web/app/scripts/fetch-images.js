/* eatrail · v1.5 — fetch recipe images.
   Sources (in order): Pexels → Wikipedia → DALL-E 3 (opt-in).
   Usage:
     PEXELS_API_KEY=xxx node scripts/fetch-images.js                    # Pexels + Wikipedia
     PEXELS_API_KEY=xxx OPENAI_API_KEY=yyy node scripts/fetch-images.js --openai
     node scripts/fetch-images.js --reset                               # clear cache and start over
*/
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.resolve(__dirname, '..');
const RECIPES_DIR = path.join(ROOT, 'data', 'recipes');
const CACHE_PATH = path.join(ROOT, 'data', 'images.cache.json');
const OUT_PATH = path.join(ROOT, 'data', 'images.js');
const ASSETS_DIR = path.join(ROOT, 'assets', 'recipes');

// Load .env file from scripts/ directory if exists
const ENV_PATH = path.join(__dirname, '.env');
if (fs.existsSync(ENV_PATH)) {
  const envContent = fs.readFileSync(ENV_PATH, 'utf8');
  for (const line of envContent.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.+?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const CUISINES = ['italian','french','american','mexican','japanese','chinese','indian','thai','korean','spanish','greek','turkish','lebanese','vietnamese','brazilian','peruvian','caribbean','german','british','moroccan','ethiopian','philippine','indonesian','russian','polish'];

// Country → English keyword for Pexels search (food photography is mostly tagged in English)
const COUNTRY_KEYWORD = {
  'Italie': 'italian', 'France': 'french', 'États-Unis': 'american', 'Mexique': 'mexican',
  'Japon': 'japanese', 'Chine': 'chinese', 'Inde': 'indian', 'Thaïlande': 'thai',
  'Corée': 'korean', 'Espagne': 'spanish', 'Grèce': 'greek', 'Turquie': 'turkish',
  'Liban': 'lebanese', 'Vietnam': 'vietnamese', 'Brésil': 'brazilian', 'Pérou': 'peruvian',
  'Caraïbes': 'caribbean', 'Allemagne': 'german', 'Royaume-Uni': 'british', 'Maroc': 'moroccan',
  'Éthiopie': 'ethiopian', 'Philippines': 'filipino', 'Indonésie': 'indonesian',
  'Russie': 'russian', 'Pologne': 'polish'
};

const COUNTRY_LANGS = {
  'Italie': ['it','en','fr'], 'France': ['fr','en'], 'États-Unis': ['en','fr'],
  'Mexique': ['es','en','fr'], 'Japon': ['ja','en','fr'], 'Chine': ['zh','en','fr'],
  'Inde': ['en','hi','fr'], 'Thaïlande': ['th','en','fr'], 'Corée': ['ko','en','fr'],
  'Espagne': ['es','en','fr'], 'Grèce': ['el','en','fr'], 'Turquie': ['tr','en','fr'],
  'Liban': ['ar','en','fr'], 'Vietnam': ['vi','en','fr'], 'Brésil': ['pt','en','fr'],
  'Pérou': ['es','en','fr'], 'Caraïbes': ['en','es','fr'], 'Allemagne': ['de','en','fr'],
  'Royaume-Uni': ['en','fr'], 'Maroc': ['ar','fr','en'], 'Éthiopie': ['en','am','fr'],
  'Philippines': ['en','tl','fr'], 'Indonésie': ['id','en','fr'], 'Russie': ['ru','en','fr'],
  'Pologne': ['pl','en','fr']
};

const UA = 'eatrail-image-fetcher/1.0';
const USE_OPENAI = process.argv.includes('--openai');
const RESET = process.argv.includes('--reset');
const PEXELS_KEY = process.env.PEXELS_API_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

function loadAllRecipes() {
  global.window = { EATRAIL_RECIPES: [] };
  const all = [];
  for (const c of CUISINES) {
    global.window.EATRAIL_RECIPES = [];
    eval(fs.readFileSync(path.join(RECIPES_DIR, c + '.js'), 'utf8'));
    all.push(...global.window.EATRAIL_RECIPES);
  }
  return all;
}

async function fetchWithRetry(url, opts = {}, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, { ...opts, headers: { 'User-Agent': UA, ...(opts.headers || {}) }});
      if (res.status === 429 || res.status === 503) {
        await new Promise(r => setTimeout(r, 1500 * (attempt + 1)));
        continue;
      }
      return res;
    } catch (e) {
      if (attempt === retries - 1) return null;
      await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
    }
  }
  return null;
}

// ─── PEXELS ───────────────────────────────────────────────
function pexelsQuery(recipe) {
  const cleanTitle = recipe.title.split('(')[0].trim();
  const stripWords = ['maison','classique','façon','style','plateau','cubes','rôti','grillé'];
  let title = cleanTitle.split(/\s+/).filter(w => !stripWords.includes(w.toLowerCase())).join(' ');
  const country = COUNTRY_KEYWORD[recipe.origin.country] || '';
  // Many dishes are well-known by their native name alone
  return `${title} ${country} food`.trim();
}

async function fetchPexels(recipe) {
  if (!PEXELS_KEY) return null;
  const q = pexelsQuery(recipe);
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=3&orientation=landscape`;
  const res = await fetchWithRetry(url, { headers: { 'Authorization': PEXELS_KEY }});
  if (!res || !res.ok) return null;
  try {
    const json = await res.json();
    if (json.photos && json.photos.length > 0) {
      const p = json.photos[0];
      return { url: p.src.large || p.src.medium || p.src.original, query: q, photographer: p.photographer };
    }
  } catch (e) {}
  return null;
}

// ─── WIKIPEDIA ────────────────────────────────────────────
function getCandidates(recipe) {
  const candidates = [];
  const title = recipe.title;
  const main = title.split('(')[0].trim();
  candidates.push(main);
  const m = title.match(/\(([^)]+)\)/);
  if (m) {
    const inside = m[1].trim();
    if (/[^\x00-\x7F]/.test(inside)) candidates.push(inside);
  }
  const words = main.split(/\s+/);
  if (words.length >= 3) candidates.push(words.slice(0, -1).join(' '));
  if (words.length >= 2) candidates.push(words[0]);
  return [...new Set(candidates)];
}

async function fetchWikiSummary(lang, title) {
  const encoded = encodeURIComponent(title.replace(/ /g, '_'));
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encoded}`;
  const res = await fetchWithRetry(url, { headers: { 'Accept': 'application/json' }});
  if (!res || !res.ok) return null;
  try {
    const json = await res.json();
    if (json.type === 'disambiguation') return null;
    return (json.originalimage && json.originalimage.source) || (json.thumbnail && json.thumbnail.source) || null;
  } catch (e) { return null; }
}

async function searchAndSummary(lang, query) {
  const url = `https://${lang}.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=3&namespace=0&format=json&origin=*`;
  const res = await fetchWithRetry(url);
  if (!res || !res.ok) return null;
  try {
    const json = await res.json();
    const titles = json[1] || [];
    for (const title of titles) {
      const img = await fetchWikiSummary(lang, title);
      if (img) return img;
    }
  } catch (e) {}
  return null;
}

async function fetchWiki(recipe) {
  const langs = COUNTRY_LANGS[recipe.origin.country] || ['en','fr'];
  const candidates = getCandidates(recipe);
  for (const lang of langs) {
    for (const cand of candidates) {
      const img = await fetchWikiSummary(lang, cand);
      if (img) return { url: img, lang, query: cand };
    }
  }
  for (const lang of langs) {
    const img = await searchAndSummary(lang, candidates[0]);
    if (img) return { url: img, lang, query: candidates[0], via: 'opensearch' };
  }
  return null;
}

// ─── DOWNLOAD HELPERS ────────────────────────────────────
function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      // Follow redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlink(dest, () => {});
        return downloadImage(res.headers.location, dest).then(resolve, reject);
      }
      if (res.statusCode !== 200) { file.close(); fs.unlink(dest, () => {}); reject(new Error('HTTP ' + res.statusCode)); return; }
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve()));
    }).on('error', (err) => { fs.unlink(dest, () => {}); reject(err); });
  });
}

function urlExtension(url) {
  const m = url.match(/\.(jpe?g|png|webp|svg|gif)(?:\?|#|$)/i);
  return m ? m[1].toLowerCase().replace('jpeg','jpg') : 'jpg';
}

async function downloadToLocal(recipeId, remoteUrl) {
  if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR, { recursive: true });
  const ext = urlExtension(remoteUrl);
  const filename = `${recipeId}.${ext}`;
  const dest = path.join(ASSETS_DIR, filename);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 1024) return `assets/recipes/${filename}`;
  try {
    await downloadImage(remoteUrl, dest);
    return `assets/recipes/${filename}`;
  } catch (e) {
    return null;
  }
}

async function fetchOpenAI(recipe) {
  if (!OPENAI_KEY) return null;
  const cleanTitle = recipe.title.split('(')[0].trim();
  const country = recipe.origin.country;
  const summary = recipe.summary || '';
  const prompt = `Professional food photography of "${cleanTitle}", a traditional ${country} dish. ${summary} Top-down view, natural lighting, rustic ceramic plate, garnished, appetizing, magazine-quality. No text, no watermark.`.substring(0, 1000);
  try {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify({ model: 'dall-e-3', prompt, n: 1, size: '1024x1024', quality: 'standard', response_format: 'url' })
    });
    if (!res.ok) {
      const t = await res.text();
      console.error(`\nOpenAI ${recipe.id}: ${res.status} ${t.slice(0,150)}`);
      return null;
    }
    const json = await res.json();
    const url = json.data && json.data[0] && json.data[0].url;
    if (!url) return null;
    if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR, { recursive: true });
    const dest = path.join(ASSETS_DIR, `${recipe.id}.png`);
    await downloadImage(url, dest);
    return { url: `assets/recipes/${recipe.id}.png` };
  } catch (e) {
    console.error(`\nOpenAI ${recipe.id} failed: ${e.message}`);
    return null;
  }
}

// ─── ORCHESTRATION ────────────────────────────────────────
async function processRecipe(recipe, cache) {
  // Skip if already downloaded locally as Pexels
  if (cache[recipe.id] && cache[recipe.id].localPath && cache[recipe.id].src === 'pexels') return;

  // Try Pexels first (will overwrite Wikipedia entries)
  if (PEXELS_KEY) {
    const r = await fetchPexels(recipe);
    if (r) {
      const local = await downloadToLocal(recipe.id, r.url);
      if (local) {
        cache[recipe.id] = { url: local, localPath: local, remoteUrl: r.url, src: 'pexels', query: r.query, photographer: r.photographer };
        return;
      }
    }
  }

  // Already have a working entry (Wikipedia from prior run)?
  if (cache[recipe.id] && cache[recipe.id].url) {
    // Make sure it's downloaded locally
    if (!cache[recipe.id].localPath && cache[recipe.id].url.startsWith('http')) {
      const local = await downloadToLocal(recipe.id, cache[recipe.id].url);
      if (local) {
        cache[recipe.id].remoteUrl = cache[recipe.id].url;
        cache[recipe.id].url = local;
        cache[recipe.id].localPath = local;
      }
    }
    return;
  }

  // Fall back to Wikipedia
  const w = await fetchWiki(recipe);
  if (w) {
    const local = await downloadToLocal(recipe.id, w.url);
    if (local) {
      cache[recipe.id] = { url: local, localPath: local, remoteUrl: w.url, src: 'wiki', lang: w.lang, query: w.query, via: w.via };
      return;
    }
    cache[recipe.id] = { url: w.url, src: 'wiki', lang: w.lang, query: w.query, via: w.via };
    return;
  }

  cache[recipe.id] = { url: null, src: null };
}

async function main() {
  const recipes = loadAllRecipes();
  console.log(`Loaded ${recipes.length} recipes`);
  console.log(`Pexels key: ${PEXELS_KEY ? 'YES' : 'NO'}`);
  console.log(`OpenAI key: ${OPENAI_KEY ? 'YES' : 'NO'} (--openai flag: ${USE_OPENAI})`);

  let cache = {};
  if (!RESET && fs.existsSync(CACHE_PATH)) {
    cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
    console.log(`Loaded cache: ${Object.keys(cache).length} entries`);
  } else if (RESET) {
    console.log('Cache reset (--reset)');
  }

  // Phase 1: Pexels + Wikipedia (Pexels free: 200/h, so ~3/min = 20s between batches of 1)
  console.log('\n=== Phase 1: Pexels (primary) + Wikipedia (fallback) ===');
  const BATCH = parseInt(process.env.BATCH || '1', 10);
  const DELAY_MS = parseInt(process.env.DELAY_MS || '20000', 10); // 20s default = 180/h, safe under 200/h
  console.log(`Rate: BATCH=${BATCH}, DELAY=${DELAY_MS}ms (override with BATCH= and DELAY_MS= env vars)`);
  for (let i = 0; i < recipes.length; i += BATCH) {
    const batch = recipes.slice(i, i + BATCH);
    await Promise.all(batch.map(r => processRecipe(r, cache)));
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
    const pex = recipes.filter(r => cache[r.id] && cache[r.id].src === 'pexels').length;
    const wiki = recipes.filter(r => cache[r.id] && cache[r.id].src === 'wiki').length;
    const local = recipes.filter(r => cache[r.id] && cache[r.id].localPath).length;
    process.stdout.write(`\r${i + batch.length}/${recipes.length} | Pexels:${pex} Wiki:${wiki} | local:${local}      `);
    if (i + BATCH < recipes.length) await new Promise(r => setTimeout(r, DELAY_MS));
  }
  console.log('');

  let missing = recipes.filter(r => !cache[r.id] || !cache[r.id].url);

  // Phase 2: OpenAI fallback (opt-in)
  if (USE_OPENAI && missing.length > 0 && OPENAI_KEY) {
    console.log(`\n=== Phase 2: DALL-E 3 for ${missing.length} missing (~$${(missing.length * 0.04).toFixed(2)}) ===`);
    for (let i = 0; i < missing.length; i++) {
      const r = missing[i];
      process.stdout.write(`\r[${i+1}/${missing.length}] ${r.id}...     `);
      const img = await fetchOpenAI(r);
      if (img) cache[r.id] = { url: img.url, src: 'openai' };
      fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
    }
    console.log('');
    missing = recipes.filter(r => !cache[r.id] || !cache[r.id].url);
  }

  // Stats
  const pex = recipes.filter(r => cache[r.id] && cache[r.id].src === 'pexels').length;
  const wiki = recipes.filter(r => cache[r.id] && cache[r.id].src === 'wiki').length;
  const ai = recipes.filter(r => cache[r.id] && cache[r.id].src === 'openai').length;
  const found = pex + wiki + ai;
  console.log('\n=== FINAL ===');
  console.log(`Pexels: ${pex}`);
  console.log(`Wikipedia: ${wiki}`);
  console.log(`OpenAI: ${ai}`);
  console.log(`Total: ${found}/${recipes.length} (${(found/recipes.length*100).toFixed(1)}%)`);
  console.log(`Missing (gradient fallback): ${missing.length}`);
  if (missing.length > 0 && missing.length <= 50) {
    console.log('--- Missing ---');
    missing.forEach(r => console.log(`  ${r.id.padEnd(28)} ${r.origin.country.padEnd(14)} "${r.title}"`));
  }

  // Build images.js
  const finalMap = {};
  for (const r of recipes) {
    if (cache[r.id] && cache[r.id].url) finalMap[r.id] = cache[r.id].url;
  }
  const out = `/* eatrail · v1.5 — recipe images (${Object.keys(finalMap).length}/${recipes.length} resolved) */\nwindow.EATRAIL_IMAGES = ${JSON.stringify(finalMap, null, 2)};\n`;
  fs.writeFileSync(OUT_PATH, out);
  console.log(`\nWrote ${OUT_PATH}`);
}

main().catch(e => { console.error(e); process.exit(1); });
