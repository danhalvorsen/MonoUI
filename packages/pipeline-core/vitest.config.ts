// File: packages/pipeline-core/vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: [path.resolve(__dirname, "tests/setup.ts")], // Ensures reflect-metadata is loaded
    include: ["tests/**/*.test.ts", "src/**/*.test.ts"],
    exclude: ["**/node_modules/**", "**/dist/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@tests": path.resolve(__dirname, "tests"),
    },
  },
});