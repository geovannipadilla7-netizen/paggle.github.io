import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DDG_ORIGIN = 'https://duckduckgo.com';

const DDG_PREFIXES = [
  '/static-pages/',
  '/dist/',
  '/js/',
  '/font/',
  '/assets/',
  '/locales/',
  '/images/',
  '/t/',
  '/i/',
  '/m/',
  '/v/',
  '/ac/',
  '/l/',
  '/duckchat/'
];

const DDG_EXACT_PATHS = new Set([
  '/d.js',
  '/y.js',
  '/serp.js',
  '/country.json',
  '/favicon.ico',
  '/manifest.json'
]);

function isDuckDuckGoAssetPath(pathname: string): boolean {
  if (DDG_EXACT_PATHS.has(pathname)) return true;
  if (pathname.startsWith('/serp')) return true;
  return DDG_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

async function proxyToDuckDuckGo(targetPath: string, req: Request, res: Response) {
  try {
    const targetUrl = `${DDG_ORIGIN}${targetPath}`;
    const headers: Record<string, string> = {
      'user-agent':
        req.headers['user-agent'] ||
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      accept: req.headers['accept'] || '*/*',
      'accept-language': req.headers['accept-language'] || 'en-US,en;q=0.9',
      referer: `${DDG_ORIGIN}/`
    };

    if (req.method !== 'GET' && req.method !== 'HEAD' && req.headers['content-type']) {
      headers['content-type'] = String(req.headers['content-type']);
      headers['origin'] = DDG_ORIGIN;
    }

    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers,
      redirect: 'follow'
    });

    const contentType = upstream.headers.get('content-type');
    if (contentType) {
      res.setHeader('content-type', contentType);
    }

    const cacheControl = upstream.headers.get('cache-control');
    if (cacheControl) {
      res.setHeader('cache-control', cacheControl);
    }

    const arrayBuffer = await upstream.arrayBuffer();
    res.status(upstream.status).send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error('DuckDuckGo proxy error:', err);
    res.status(502).send(`
      <!doctype html>
      <html>
        <body style="font-family: system-ui, sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; margin:0; background:#0f172a; color:#e2e8f0;">
          <div style="text-align:center; max-width:420px; padding:24px;">
            <h2 style="margin:0 0 8px;">Unable to load DuckDuckGo</h2>
            <p style="font-size:14px; color:#94a3b8; margin:0 0 16px;">The embedded connection encountered a temporary error.</p>
            <a href="https://duckduckgo.com/" target="_blank" rel="noopener noreferrer" style="display:inline-block; padding:10px 18px; background:#2563eb; color:#fff; text-decoration:none; border-radius:8px; font-size:14px; font-weight:600;">Open DuckDuckGo in New Tab</a>
          </div>
        </body>
      </html>
    `);
  }
}

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT || 3000);
  const isProd = process.env.NODE_ENV === 'production';
  const distDir = path.join(__dirname, 'dist');

  // Primary DuckDuckGo embed entry point
  app.use('/api/ddg', async (req: Request, res: Response) => {
    const suffix = req.url === '/' ? '/' : req.url;
    await proxyToDuckDuckGo(suffix, req, res);
  });

  // Intercept DuckDuckGo search queries submitted from within the embedded frame (e.g. /?q=...)
  app.get('/', async (req: Request, res: Response, next: NextFunction) => {
    if (typeof req.query.q === 'string' || typeof req.query.ia === 'string') {
      await proxyToDuckDuckGo(req.originalUrl, req, res);
      return;
    }
    next();
  });

  if (isProd && fs.existsSync(distDir)) {
    // Serve built local static assets first so Paggle's /assets/index-*.js always takes priority
    app.use(express.static(distDir, { fallthrough: true }));
  }

  // Proxy DuckDuckGo static assets, scripts, and autocomplete APIs
  app.use(async (req: Request, res: Response, next: NextFunction) => {
    if (isDuckDuckGoAssetPath(req.path)) {
      await proxyToDuckDuckGo(req.originalUrl, req, res);
      return;
    }
    next();
  });

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use((_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
