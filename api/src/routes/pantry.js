// /api/pantry — list, add, remove, clear, import, scan (Claude vision proxy)
import { Router } from 'express';
import { z } from 'zod';
import multer from 'multer';
import { prisma } from '../db.js';
import { requireAuth } from '../auth/middleware.js';
import { validate, sendValidationError } from '../lib/zod-helpers.js';
import { anthropic, isConfigured as anthropicConfigured, DEFAULT_MODEL } from '../lib/anthropic.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const items = await prisma.pantryItem.findMany({
    where: { userId: req.user.id },
    orderBy: { addedAt: 'desc' },
  });
  return res.json({ items });
});

const addSchema = z.object({
  name: z.string().min(1).max(120),
  source: z.enum(['manual', 'scan', 'import']).default('manual'),
});

router.post('/', async (req, res) => {
  const { data, error } = validate(addSchema, req.body);
  if (error) return sendValidationError(res, error);
  const norm = data.name.trim().toLowerCase();
  if (!norm) return res.status(400).json({ error: 'empty_name' });

  const item = await prisma.pantryItem.upsert({
    where: { userId_name: { userId: req.user.id, name: norm } },
    update: {},
    create: { userId: req.user.id, name: norm, source: data.source },
  });
  return res.status(201).json({ item });
});

const removeSchema = z.object({ name: z.string().min(1).max(120) });
router.delete('/by-name', async (req, res) => {
  const { data, error } = validate(removeSchema, req.body);
  if (error) return sendValidationError(res, error);
  const norm = data.name.trim().toLowerCase();
  await prisma.pantryItem.deleteMany({ where: { userId: req.user.id, name: norm } });
  return res.json({ ok: true });
});

router.delete('/', async (req, res) => {
  await prisma.pantryItem.deleteMany({ where: { userId: req.user.id } });
  return res.json({ ok: true });
});

const importSchema = z.object({ names: z.array(z.string().min(1).max(120)).max(500) });
router.post('/import', async (req, res) => {
  const { data, error } = validate(importSchema, req.body);
  if (error) return sendValidationError(res, error);
  const names = [...new Set(data.names.map(n => n.trim().toLowerCase()).filter(Boolean))];
  if (names.length === 0) return res.json({ added: 0 });

  const result = await prisma.pantryItem.createMany({
    data: names.map(name => ({ userId: req.user.id, name, source: 'import' })),
    skipDuplicates: true,
  });
  return res.json({ added: result.count });
});

// ─── Photo scan: client uploads image, we proxy to Claude Opus 4.7 Vision ──
// Server-side ANTHROPIC_API_KEY (never exposed to client).
// Opus 4.7 has high-resolution vision (up to 2576px long edge) — automatic, no opt-in needed.
const upload = multer({ limits: { fileSize: 8 * 1024 * 1024 }, storage: multer.memoryStorage() });

const SCAN_SCHEMA = {
  type: 'object',
  properties: {
    ingredients: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: ['ingredients'],
  additionalProperties: false,
};

router.post('/scan', upload.single('photo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'no_photo' });
  if (!anthropicConfigured()) {
    return res.status(503).json({ error: 'scan_unavailable', message: 'ANTHROPIC_API_KEY non configurée côté serveur.' });
  }

  const mediaType = req.file.mimetype;
  // Claude vision accepts: image/jpeg, image/png, image/gif, image/webp
  if (!/^image\/(jpe?g|png|gif|webp)$/i.test(mediaType)) {
    return res.status(400).json({ error: 'unsupported_image_type', detail: mediaType });
  }
  const base64 = req.file.buffer.toString('base64');

  let response;
  try {
    response = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 1024,
      system: 'You are a vision assistant that identifies food items visible in pantry/fridge photos. Respond ONLY with valid JSON matching the requested schema. No commentary.',
      output_config: {
        format: {
          type: 'json_schema',
          schema: SCAN_SCHEMA,
          name: 'pantry_scan_result',
        },
        effort: 'medium',  // vision needs more thought than text classification
      },
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: base64 },
          },
          {
            type: 'text',
            text:
              'Liste tous les aliments / ingrédients visibles dans cette photo de garde-manger ou de frigo. ' +
              'Inclus emballages clairement identifiables (riz, pâtes, conserves, épices, fruits, légumes, viandes, fromages, etc.). ' +
              'Noms en français, singulier, en minuscules. Ne devine pas ce qui n\'est pas visible. ' +
              'Format de réponse : {"ingredients": ["tomate", "riz basmati", "lait", ...]}',
          },
        ],
      }],
    });
  } catch (e) {
    console.error('[scan] Anthropic error:', e.message, e.status);
    return res.status(502).json({ error: 'anthropic_error', detail: e.message?.slice(0, 300) });
  }

  // Extract JSON from response content blocks
  const textBlock = (response.content || []).find(b => b.type === 'text');
  if (!textBlock) {
    return res.status(502).json({ error: 'anthropic_no_text' });
  }

  let parsed;
  try {
    parsed = JSON.parse(textBlock.text);
  } catch {
    return res.status(502).json({ error: 'anthropic_invalid_json', raw: textBlock.text?.slice(0, 200) });
  }

  const detected = Array.isArray(parsed.ingredients) ? parsed.ingredients : [];
  const norm = [...new Set(detected.map(s => String(s).trim().toLowerCase()).filter(Boolean))];

  const result = await prisma.pantryItem.createMany({
    data: norm.map(name => ({ userId: req.user.id, name, source: 'scan' })),
    skipDuplicates: true,
  });
  return res.json({ detected: norm, added: result.count });
});

export default router;
