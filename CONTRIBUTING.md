# Contributing

## Tech Stack

- Node.js with TypeScript
- Express.js 5 (ES modules)
- Vitest + Supertest for testing
- ESLint + Prettier for code quality
- Data stored in `db/v1.json`

## Quick Setup

```bash
git clone https://github.com/fauziralpiandi/husnapi.git
cd husnapi

npm install
npm run dev # http://localhost:3000
```

## Project Structure

```
husnapi/
├── db/
│   └── v1.json            # The 99 Names data
├── dist/                  # Compiled JavaScript (generated)
├── src/
│   ├── index.ts           # Entry
│   ├── tests/
│   │   ├── integration/   # Integration tests
│   │   └── unit/          # Unit tests
│   └── v1/
│       └── index.ts       # v1 API routes
└── ...
```

## Development

```bash
npm run dev          # Dev with hot reload
npm run format       # Format code
npm run lint         # Linting code
npm test             # Run all tests
npm run test:watch   # Tests in watch mode
npm run build        # Compile TypeScript
npm start            # Run pre-production build
```

## Pull Request

1. Fork the repository
2. Create a branch: `git checkout -b feat/your-feature`
3. Make your changes and add tests
4. Ensure all the tests pass
5. Run formatter and linter
6. Commit using semantic commit
7. Push and open a pull request

## Data Accuracy

When editing `db/v1.json`:

- Ensure Arabic text is accurate
- Latin (transliteration) should follow DIN 31635 standard
- Translations should be reviewed by native speakers when possible

## Questions?

Open an issue for any questions or discussions about contributing.

---

Thank you for helping make Islamic resources more accessible!
