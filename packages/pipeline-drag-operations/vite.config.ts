import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "PipelineDragOperations",
      fileName: "index",
    },
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      external: ["@mr/pipeline-core", "@mr/design-patterns"],
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"]
  },
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "src"),
    },
  },
});