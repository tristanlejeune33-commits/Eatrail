// /api/pantry — list, add, remove, clear, import, scan (OpenAI vision proxy)
import { Router } from 'express';
import { z } from 'zod';
import multer from 'multer';
import { prisma } from '../db.js';
import { requireAuth } from '../auth/middleware.js';
import { validate, sendValidationError } from '../lib/zod-helpers.js';

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

// ─── Photo scan: client uploads image, we proxy to OpenAI Vision ───────
// Server-side OPENAI_API_KEY (never exposed to client).
const upload = multer({ limits: { fileSize: 8 * 1024 * 1024 }, storage: multer.memoryStorage() });

router.post('/scan', upload.single('photo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'no_photo' });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'scan_unavailable', message: 'OPENAI_API_KEY non configurée côté serveur.' });

  const dataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

  const body = {
    model: 'gpt-4o-mini',
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text:
          'Liste tous les aliments / ingrédients visibles dans cette photo de garde-manger ou de frigo. ' +
          'Inclus emballages clairement identifiables (riz, pâtes, conserves, épices, fruits, légumes, viandes, fromages, etc.). ' +
          'Réponds UNIQUEMENT en JSON : {"ingredients": ["tomate", "riz basmati", "lait"]}. ' +
          'Noms en français, singulier, en minuscules. Ne devine pas ce qui n\'est pas visible.'
        },
        { type: 'image_url', image_url: { url: dataUrl } }
      ]
    }],
    response_format: { type: 'json_object' },
    max_tokens: 800,
  };

  let openaiRes;
  try {
    openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
      body: JSON.stringify(body),
    });
  } catch (e) {
    return res.status(502).json({ error: 'openai_network', message: e.message });
  }

  if (!openaiRes.ok) {
    const txt = await openaiRes.text().catch(() => '');
    return res.status(502).json({ error: 'openai_error', status: openaiRes.status, detail: txt.slice(0, 300) });
  }

  const json = await openaiRes.json();
  const content = json.choices?.[0]?.message?.content;
  let parsed;
  try { parsed = JSON.parse(content); }
  catch { return res.status(502).json({ error: 'openai_invalid_json' }); }

  const detected = Array.isArray(parsed.ingredients) ? parsed.ingredients : [];
  const norm = [...new Set(detected.map(s => String(s).trim().toLowerCase()).filter(Boolean))];

  const result = await prisma.pantryItem.createMany({
    data: norm.map(name => ({ userId: req.user.id, name, source: 'scan' })),
    skipDuplicates: true,
  });
  return res.json({ detected: norm, added: result.count });
});

export default router;
