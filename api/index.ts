import express, {
  type Application,
  type NextFunction,
  type Response,
} from 'express';
import { v1 } from './v1/index.js';
import pkg from '../package.json' with { type: 'json' };

const app: Application = express();
const PORT = Number(process.env.PORT) || 3000;

app.set('trust proxy', 1); // load balancer

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
  res.status(200).json({
    success: true,
    status: 200,
    data: {
      name: pkg.name,
      description: pkg.description,
      version: pkg.version,
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      endpoints: {
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
      },
    },
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

// global error
app.use((_, res: Response) => {
  res.status(500).json({
    success: false,
    status: 500,
    data: null,
  });
});

// start server
app.listen(PORT, () => {
  console.log(
    `${pkg.name} v${pkg.version} (listening on port ${String(PORT)})`,
  );
});

export { app as husnapi };
