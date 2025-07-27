import { defineConfig, type PluginOption } from "vite";
import { resolve } from "path";
import { readFileSync } from "fs";
import dts from "vite-plugin-dts";

// Node built-ins
const nodeBuiltins = [
  "assert","buffer","child_process","cluster","console","constants","crypto","dgram","dns",
  "domain","events","fs","fs/promises","http","https","module","net","os","path","perf_hooks",
  "process","punycode","querystring","readline","repl","stream","string_decoder","sys",
  "timers","tls","tty","url","util","v8","vm","worker_threads","zlib"
];
const allNodeBuiltins = [...nodeBuiltins, ...nodeBuiltins.map(m => `node:${m}`)];

/**
 * Read dependencies + peerDependencies from the current package.json
 */
function getPackageDeps(): string[] {
  try {
    const pkg = JSON.parse(
      readFileSync(resolve(process.cwd(), "package.json"), "utf-8")
    );
    return [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ];
  } catch {
    return [];
  }
}

/**
 * Shared Vite config for Node CLI libraries
 * @param entry Path to library entry file (e.g., "src/index.ts")
 */
export function createNodeLibConfig(entry: string) {
  const packageDeps = getPackageDeps();
  const externalDeps = [...allNodeBuiltins, ...packageDeps];

  return defineConfig({
    build: {
      lib: {
        entry: resolve(process.cwd(), entry),
        formats: ["es"],
        fileName: () => "index.js"
      },
      outDir: "dist",
      sourcemap: true,
      emptyOutDir: true,
      target: "node20",
      rollupOptions: {
        external: (id) =>
          externalDeps.some(dep => id === dep || id.startsWith(`${dep}/`))
      },
      minify: false
    },
    plugins: [
      dts({
        insertTypesEntry: true,
        include: ["src/**/*.ts"],
        exclude: ["**/*.test.ts"]
      }) as PluginOption
    ]
  });
}
