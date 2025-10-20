import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'husnapi',
    globals: true,
    environment: 'node',
    include: ['**/*.test.ts'],
  },
});
