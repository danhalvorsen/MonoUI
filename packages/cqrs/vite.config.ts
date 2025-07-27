// File: packages/cqrs/vite.config.ts
import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "MrCQRS",
      fileName: (format) => `index.${format}.js`,
      formats: ["es"],
    },
    outDir: "dist",
    sourcemap: true,
    emptyOutDir: true,
    target: "node20",
    rollupOptions: {
      external: ["node:module"],
      output: { preserveModules: true, preserveModulesRoot: "src" },
    },
    minify: false,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@packages/design-patterns": resolve(__dirname, "../design-patterns/src"), 
    },
  },
});
