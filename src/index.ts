import express, {
  type Application,
  type NextFunction,
  type Response,
} from 'express';
import { v1 } from './v1/index.js';
import pkg from '../package.json' with { type: 'json' };

const app: Application = express();
const PORT = Number(process.env.PORT) || 3000;

// trust first proxy (load balancer)
app.set('trust proxy', 1);

// middleware
app.use(express.json());

// CORS
app.use((_, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
});

// root
app.get('/', (_, res: Response) => {
  const meta = {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    homepage: pkg.homepage,
  };
  const system = {
    status: 'ok',
    uptime: process.uptime(),
    process_id: process.pid,
    timestamp: new Date().toISOString(),
  };
  const endpoints = {
    routes: [
      {
        path: '/v1/names',
        method: 'GET',
        description: 'Get all names',
      },
      {
        path: '/v1/names/random',
        method: 'GET',
        description: 'Get random name(s)',
      },
      {
        path: '/v1/names/:id',
        method: 'GET',
        description: 'Get specific name by ID',
      },
      {
        path: '/v1/health',
        method: 'GET',
        description: 'Health check',
      },
    ],
  };

  res.status(200).json({
    success: true,
    status: 200,
    data: { ...meta, system, endpoints },
  });
});

// API
app.use('/v1', v1);

// 404
app.use((_, res: Response) => {
  res.status(404).json({
    success: false,
    status: 404,
    data: null,
  });
});

// global error handler
app.use((_, res: Response) => {
  res.status(500).json({
    success: false,
    status: 500,
    data: null,
  });
});

// start server (only for local development)
// will handle the server lifecycle in production
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(
      `${pkg.name} v${pkg.version} (listening on http://localhost:${String(PORT)})`,
    );
  });
}

export { app as default };
