// This file ensures path aliases work in tests
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// This makes sure path aliases work in tests
// The actual aliases are configured in tsconfig.json and vitest.config.ts
