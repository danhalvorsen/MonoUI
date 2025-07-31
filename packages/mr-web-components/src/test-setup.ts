// src/test-setup.ts

// Shim for process.env for browser environments
if (typeof process === 'undefined') {
  (globalThis as any).process = { env: {} };
}
