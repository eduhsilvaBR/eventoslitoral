#!/usr/bin/env node
/**
 * Eventos Litoral — Servidor local de desenvolvimento + admin
 * node admin-server.js
 */
const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;

const MIME = {
  '.html' : 'text/html; charset=utf-8',
  '.js'   : 'application/javascript',
  '.jsx'  : 'application/javascript',
  '.css'  : 'text/css',
  '.json' : 'application/json',
  '.png'  : 'image/png',
  '.jpg'  : 'image/jpeg',
  '.jpeg' : 'image/jpeg',
  '.webp' : 'image/webp',
  '.avif' : 'image/avif',
  '.svg'  : 'image/svg+xml',
  '.ico'  : 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff' : 'font/woff',
  '.ttf'  : 'font/ttf',
};

// Only these filenames are writable via the API
const WRITABLE = new Set(['.image-slots.state.json', 'cms.json']);

const server = http.createServer((req, res) => {
  const u = new URL(req.url, `http://localhost:${PORT}`);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  // ── POST /api/write-file ─────────────────────────────────────────────────
  if (req.method === 'POST' && u.pathname === '/api/write-file') {
    let body = '';
    req.on('data', c => (body += c));
    req.on('end', () => {
      try {
        const { filename, content } = JSON.parse(body);
        const base = path.basename(filename);
        if (!WRITABLE.has(base)) {
          res.writeHead(403, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Arquivo não permitido: ' + base }));
          return;
        }
        fs.writeFileSync(path.join(ROOT, base), content, 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // ── GET static files ──────────────────────────────────────────────────────
  let p = u.pathname;
  if (p === '/' || p === '') p = '/index.html';

  // Prevent path traversal
  const safe = p.replace(/\.\./g, '').replace(/\/+/g, '/');
  let fp = path.join(ROOT, safe);

  // Clean URLs: /fotos → fotos.html, /admin → admin.html
  if (!fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
    const withHtml = fp.replace(/\/$/, '') + '.html';
    if (fs.existsSync(withHtml)) {
      fp = withHtml;
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 — não encontrado');
      return;
    }
  }

  const ext  = path.extname(fp).toLowerCase();
  const mime = MIME[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': mime });
  fs.createReadStream(fp).pipe(res);
});

server.listen(PORT, () => {
  console.log('\n  ╔══════════════════════════════════╗');
  console.log('  ║  EVENTOS LITORAL — Dev Server    ║');
  console.log('  ╠══════════════════════════════════╣');
  console.log(`  ║  Site:   http://localhost:${PORT}     ║`);
  console.log(`  ║  Admin:  http://localhost:${PORT}/admin ║`);
  console.log('  ╚══════════════════════════════════╝\n');
});
