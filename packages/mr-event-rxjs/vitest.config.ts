import { defineConfig } from "vitest/config";
import { resolve } from "node:path";
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"]
  },
  resolve: {
    conditions: ["module", "import", "node"],
  }
});