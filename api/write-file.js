// Vercel serverless function — POST /api/write-file
const fs   = require('fs');
const path = require('path');

const WRITABLE = new Set(['.image-slots.state.json', 'cms.json']);

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { filename, content } = req.body || {};
  const base = path.basename(filename || '');

  if (!WRITABLE.has(base)) {
    res.status(403).json({ error: 'Arquivo não permitido: ' + base });
    return;
  }

  try {
    // /tmp é o único diretório gravável na Vercel (não persiste entre deploys)
    // Para persistência real, use o admin local + git push
    const target = path.join('/tmp', base);
    fs.writeFileSync(target, content, 'utf8');
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
