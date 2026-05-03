// Google Places API wrapper with Postgres-backed cache.
// Uses the LEGACY Places API (still supported, simpler than v1).
// Docs: https://developers.google.com/maps/documentation/places/web-service
//
// Cache strategy: each shop is cached for 30 days in `shops` table.
// On nearby search: check cache first; only call Google for shops we don't know.
import { prisma } from '../db.js';

const CACHE_TTL_DAYS = 30;
const KEY = process.env.GOOGLE_PLACES_API_KEY;

export function isConfigured() { return !!KEY; }

// ─── Distance helper (Haversine) ──────────────────────────
export function haversineMiles(lat1, lng1, lat2, lng2) {
  const R = 3958.8; // Earth radius in miles
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// ─── Bounding-box helper ──────────────────────────────────
// Approx: 1° latitude ≈ 69 miles. Used to pre-filter the cache by lat/lng range.
export function boundingBox(lat, lng, radiusMiles) {
  const latDelta = radiusMiles / 69;
  const lngDelta = radiusMiles / (69 * Math.cos(lat * Math.PI / 180));
  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLng: lng - lngDelta,
    maxLng: lng + lngDelta,
  };
}

// ─── Google API: nearby search ────────────────────────────
export async function googleNearbySearch({ lat, lng, radiusMeters = 2000, type = 'grocery_or_supermarket', keyword }) {
  if (!KEY) throw new Error('GOOGLE_PLACES_API_KEY not configured');
  const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
  url.searchParams.set('location', `${lat},${lng}`);
  url.searchParams.set('radius', String(radiusMeters));
  if (type) url.searchParams.set('type', type);
  if (keyword) url.searchParams.set('keyword', keyword);
  url.searchParams.set('key', KEY);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Google Nearby HTTP ${res.status}`);
  const json = await res.json();
  if (json.status !== 'OK' && json.status !== 'ZERO_RESULTS') {
    throw new Error(`Google Nearby status: ${json.status} — ${json.error_message || ''}`);
  }
  return json.results || [];
}

// ─── Google API: place details ────────────────────────────
const DETAILS_FIELDS = [
  'place_id','name','formatted_address','geometry',
  'rating','user_ratings_total','price_level',
  'opening_hours','formatted_phone_number','website',
  'photos','types','vicinity',
].join(',');

export async function googlePlaceDetails(placeId) {
  if (!KEY) throw new Error('GOOGLE_PLACES_API_KEY not configured');
  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  url.searchParams.set('place_id', placeId);
  url.searchParams.set('fields', DETAILS_FIELDS);
  url.searchParams.set('key', KEY);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Google Details HTTP ${res.status}`);
  const json = await res.json();
  if (json.status !== 'OK') throw new Error(`Google Details: ${json.status}`);
  return json.result;
}

// ─── Cache: upsert a Google place into our `shops` table ──
function googleResultToShop(p) {
  const expiresAt = new Date(Date.now() + CACHE_TTL_DAYS * 24 * 60 * 60 * 1000);
  return {
    id: p.place_id,  // we use Google's place_id as the shop id for non-curated entries
    name: p.name || 'Magasin',
    address: p.formatted_address || p.vicinity || '',
    neighborhood: p.vicinity || null,
    lat: p.geometry?.location?.lat ?? null,
    lng: p.geometry?.location?.lng ?? null,
    type: (p.types || []).find(t => t.includes('grocery') || t.includes('food')) || null,
    hours: p.opening_hours?.open_now != null
      ? (p.opening_hours.open_now ? 'Ouvert' : 'Fermé')
      : null,
    phone: p.formatted_phone_number || null,
    website: p.website || null,
    description: null,
    imageUrl: null,
    gradient: null,
    authScore: 70,  // default for discovered (lower than curated 80+)
    priceLevel: ['$', '$$', '$$$', '$$$$'][p.price_level || 1] || '$$',
    source: 'GOOGLE',
    googlePlaceId: p.place_id,
    rating: p.rating ?? null,
    ratingCount: p.user_ratings_total ?? null,
    photoRef: p.photos?.[0]?.photo_reference || null,
    hoursJson: p.opening_hours ? p.opening_hours : null,
    googleTypes: p.types || [],
    inferredCuisines: [],
    lastFetchedAt: new Date(),
    expiresAt,
  };
}

export async function upsertShopFromGoogle(p) {
  const data = googleResultToShop(p);
  return prisma.shop.upsert({
    where: { id: data.id },
    create: data,
    update: {
      name: data.name,
      address: data.address,
      neighborhood: data.neighborhood,
      lat: data.lat,
      lng: data.lng,
      hours: data.hours,
      phone: data.phone,
      website: data.website,
      rating: data.rating,
      ratingCount: data.ratingCount,
      photoRef: data.photoRef,
      hoursJson: data.hoursJson,
      googleTypes: data.googleTypes,
      lastFetchedAt: data.lastFetchedAt,
      expiresAt: data.expiresAt,
    },
  });
}

// ─── Public API: discover shops near (lat, lng) ───────────
// Returns a list of shops (mix of cached + freshly-fetched if needed).
// If Google API is not configured, falls back to curated shops only.
export async function discoverNearbyShops({ lat, lng, radiusMiles = 1.5, limit = 30 }) {
  const bbox = boundingBox(lat, lng, radiusMiles);

  // 1. Pull all cached shops within the bounding box
  const cached = await prisma.shop.findMany({
    where: {
      lat: { gte: bbox.minLat, lte: bbox.maxLat },
      lng: { gte: bbox.minLng, lte: bbox.maxLng },
      OR: [
        { source: 'CURATED' },
        { source: 'GOOGLE', expiresAt: { gt: new Date() } },
        { source: 'USER_SUBMITTED' },
      ],
    },
    include: { tags: { select: { tag: true } } },
  });

  // Filter to actual radius (bbox is just a pre-filter)
  let nearby = cached
    .map(s => ({ ...s, distMiles: haversineMiles(lat, lng, s.lat, s.lng) }))
    .filter(s => s.distMiles <= radiusMiles)
    .sort((a, b) => a.distMiles - b.distMiles);

  // 2. If Google is configured AND we have few cached results, query Google
  if (isConfigured() && nearby.length < 10) {
    console.log(`[google-places] cached=${nearby.length} → querying Google for lat=${lat} lng=${lng} radius=${radiusMiles}mi`);
    try {
      const results = await googleNearbySearch({
        lat, lng,
        radiusMeters: Math.round(radiusMiles * 1609),
        type: 'grocery_or_supermarket',
      });
      console.log(`[google-places] Google returned ${results.length} results`);
      // Upsert each result; capped to 20 to stay frugal on quota
      const limited = results.slice(0, 20);
      const upsertResults = await Promise.all(
        limited.map(p => upsertShopFromGoogle(p).catch(e => {
          console.warn(`[google-places] upsert failed for ${p.place_id}:`, e.message);
          return null;
        }))
      );
      const successCount = upsertResults.filter(Boolean).length;
      console.log(`[google-places] upserted ${successCount}/${limited.length} shops`);

      // Re-query cache (now enriched)
      const refreshed = await prisma.shop.findMany({
        where: {
          lat: { gte: bbox.minLat, lte: bbox.maxLat },
          lng: { gte: bbox.minLng, lte: bbox.maxLng },
        },
        include: { tags: { select: { tag: true } } },
      });
      nearby = refreshed
        .map(s => ({ ...s, distMiles: haversineMiles(lat, lng, s.lat, s.lng) }))
        .filter(s => s.distMiles <= radiusMiles)
        .sort((a, b) => a.distMiles - b.distMiles);
      console.log(`[google-places] post-discovery total=${nearby.length}`);
    } catch (e) {
      console.error('[google-places] discover FAILED:', e.message, e.stack?.split('\n')[1]);
    }
  } else if (!isConfigured()) {
    console.log('[google-places] skipped — GOOGLE_PLACES_API_KEY not set');
  } else {
    console.log(`[google-places] skipped — already have ${nearby.length} cached shops (≥10)`);
  }

  return nearby.slice(0, limit);
}
