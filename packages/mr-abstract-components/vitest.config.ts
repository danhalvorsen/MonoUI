import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: [path.resolve(__dirname, "./src/bootstrap.ts")], // auto-load DI bootstrap
  },
  resolve: {
  extensions: [".ts", ".js"],
  alias: [
    { find: /^src$/, replacement: path.resolve(__dirname, "./src/index.ts") },
    { find: /^src\//, replacement: path.resolve(__dirname, "./src/") + "/" },
  ],
}
});
