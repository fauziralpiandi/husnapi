import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFile } from 'fs/promises';
import { type Response, type Request, Router } from 'express';

type Lang = 'en' | 'id';

interface Name {
  id: number;
  arabic: string;
  latin: string; // DIN 31635 transliteration
  translations: {
    en: {
      meaning: string;
      tafsir: string;
      insight?: string; // to-do
    };
    id: {
      meaning: string;
      tafsir: string;
      insight?: string; // to-do
    };
  };
}

interface Res<T> {
  success: boolean;
  status: number;
  data: T;
}

// ESM doesn’t have `__dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let cachedNames: readonly Name[] = [];

async function loadNames(): Promise<void> {
  const filePath = join(__dirname, '..', '..', 'db', 'v1.json');

  try {
    const json = await readFile(filePath, 'utf-8');
    // `Object.freeze` prevents accidental mutations
    const data = Object.freeze(JSON.parse(json) as Name[]); // immutable once loaded

    cachedNames = data;
  } catch (err) {
    console.error(err);

    cachedNames = [];
  }
}

// data loads before any routes are registered
await loadNames(); // top-level await, only works in ESM

function parseLang(query: unknown): Lang {
  const lang = typeof query === 'string' ? query.trim().toLowerCase() : 'en';

  return lang === 'id' ? 'id' : 'en';
}

function parseQuery(query: unknown): string {
  const q = typeof query === 'string' ? query.trim().toLowerCase() : '';

  // prevents injection attacks
  return /^[a-z0-9\s-]*$/.test(q) ? q : '';
}

function formatName(name: Name, lang: Lang) {
  const t = name.translations[lang];

  return {
    id: name.id,
    arabic: name.arabic,
    latin: name.latin,
    name: { ...t, insight: t.insight ?? null },
  };
}

const router = Router();

router.get('/names', (req: Request, res: Response) => {
  const lang = parseLang(req.query.lang);
  const q = parseQuery(req.query.q);

  let filtered = cachedNames;

  if (q) {
    filtered = cachedNames.filter((name) => {
      const t = name.translations[lang];

      return (
        t.meaning.toLowerCase().includes(q) ||
        t.tafsir.toLowerCase().includes(q) ||
        t.insight?.toLowerCase().includes(q)
      );
    });

    if (!filtered.length) {
      const response: Res<null> = {
        success: false,
        status: 404,
        data: null,
      };

      return res.status(404).json(response);
    }
  }

  const data = filtered.map((name) => formatName(name, lang));
  const response: Res<typeof data> = { success: true, status: 200, data };

  return res.status(200).json(response);
});

router.get('/names/random', (req: Request, res: Response) => {
  const lang = parseLang(req.query.lang);

  let count = Number(req.query.count) || 1;

  count = Math.min(count, cachedNames.length);

  const shuffled = [...cachedNames];

  // fisher-yates - O(n), unbiased randomization
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const data = shuffled.slice(0, count).map((name) => formatName(name, lang));
  const response: Res<typeof data> = {
    success: true,
    status: 200,
    data,
  };

  return res.status(200).json(response);
});

router.get('/names/:id', (req: Request, res: Response) => {
  const lang = parseLang(req.query.lang);
  const id = Number(req.params.id);

  if (isNaN(id)) {
    const response: Res<null> = {
      success: false,
      status: 400,
      data: null,
    };

    return res.status(400).json(response);
  }

  const found = cachedNames.find((name) => name.id === id);

  if (!found) {
    const response: Res<null> = {
      success: false,
      status: 404,
      data: null,
    };

    return res.status(404).json(response);
  }

  const result = formatName(found, lang);
  const prop = req.query.prop as keyof typeof result.name | undefined;

  let data: typeof result | Record<string, unknown> = result;

  if (prop) {
    if (!(prop in result.name)) {
      const response: Res<null> = {
        success: false,
        status: 400,
        data: null,
      };

      return res.status(400).json(response);
    }

    data = { [prop]: result.name[prop] };
  }

  const response: Res<typeof data> = {
    success: true,
    status: 200,
    data,
  };

  return res.status(200).json(response);
});

router.get('/health', (_, res: Response) => {
  const memoryUsage = process.memoryUsage();
  const response: Res<{
    status: string;
    uptime: number;
    timestamp: string;
    memory: {
      heapUsed: string;
      heapTotal: string;
      rss: string;
    };
  }> = {
    success: true,
    status: 200,
    data: {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      memory: {
        heapUsed: `${String(Math.round(memoryUsage.heapUsed / 1024 / 1024))}MB`,
        heapTotal: `${String(Math.round(memoryUsage.heapTotal / 1024 / 1024))}MB`,
        rss: `${String(Math.round(memoryUsage.rss / 1024 / 1024))}MB`,
      },
    },
  };

  return res.status(200).json(response);
});

export { parseLang, parseQuery, formatName, router as v1 };
