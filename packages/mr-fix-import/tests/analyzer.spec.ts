// packages/mr-fix-import/tests/analyzer.spec.ts
import { describe, it, expect, afterEach } from "vitest";
import type { SymbolExport } from "../src/types.js";
import fs from "node:fs";
import path from "node:path";
import { VirtualFileSystemBuilder } from "virtual-filesystem";
import { VirtualFsTestHost } from "./helpers/VirtualFsTestHost.js";
import { buildExportIndex } from "../src/analyzer.js";
import type { FixOptions } from "../src/types.js";
import type { FixContext } from "../src/context.js";
import { NodeFilePath } from "file-operations";

const fp = new NodeFilePath();
let host: VirtualFsTestHost | null = null;
afterEach(() => { host?.cleanup(); host = null; });

const norm = (s: string) => s.replace(/\\/g, "/");
const endsWith = (p: string, suffix: string) => norm(p).endsWith(suffix);

describe("analyzer with virtual-filesystem", () => {
  it("indexes named/default exports, barrel re-exports, ignores .d.ts", async () => {
    const vfs = new VirtualFileSystemBuilder()
      .withDirectory("src/a")
      .withDirectory("src/b")
      .withDirectory("src/c")
      .withDirectory("src/d")
      .withDirectory("src/e")
      .withDirectory("types")
      .withFile("src/a/Alpha.ts", `export class Alpha {}`)
      .withFile("src/b/Beta.ts", `export const Beta = 1;`)
      .withFile("src/c/DefaultThing.ts", `export default class DefaultThing {}`)
      .withFile("src/d/AnonDefault.ts", `export default () => 42`)
      .withFile("src/e/Gamma.ts", `export const Gamma = 3;`)
      .withFile("src/e/index.ts", `export { Gamma } from "./Gamma.js";`)
      .withFile("types/types.d.ts", `export interface Ignored { x: number }`)
      .build();

    host = VirtualFsTestHost.createFrom(vfs);

    // minimal tsconfig so ts-morph has context
    fs.writeFileSync(
      path.join(host.root, "tsconfig.json"),
      JSON.stringify(
        { compilerOptions: { target: "ES2022", module: "ESNext", moduleResolution: "Bundler", strict: true } },
        null,
        2
      )
    );

    const opts: FixOptions = {
      root: host.root,
      write: false,
      addJsExtension: true,
      include: ["src/**/*.ts", "types/**/*.ts"],
      exclude: ["**/*.d.ts", "**/node_modules/**", "**/dist/**"]
    };
    const ctx: FixContext = { path: fp };

    const index = await buildExportIndex(opts, ctx);

    // Alpha & Beta (named)
   expect(index.get("Alpha")?.some((e: SymbolExport) => endsWith(e.filePath, "/src/a/Alpha.ts"))).toBe(true);
expect(index.get("Beta")?.some((e: SymbolExport) => endsWith(e.filePath, "/src/b/Beta.ts"))).toBe(true);

    // DefaultThing (default class) — allow either isDefault flagged or not; key is "DefaultThing"
   const defThing = index.get("DefaultThing");
expect(defThing, "DefaultThing should be indexed").toBeTruthy();
expect(defThing!.some((e: SymbolExport) => endsWith(e.filePath, "/src/c/DefaultThing.ts"))).toBe(true);

    // Anon default — key inferred from filename: "AnonDefault"
  const anon = index.get("AnonDefault");
expect(anon, "AnonDefault should be indexed").toBeTruthy();
expect(anon!.some((e: SymbolExport) => endsWith(e.filePath, "/src/d/AnonDefault.ts"))).toBe(true);

   const gamma = index.get("Gamma");
expect(gamma, "Gamma should be indexed").toBeTruthy();
expect(gamma!.some((e: SymbolExport) => /\/src\/e\/(Gamma|index)\.ts$/.test(norm(e.filePath)))).toBe(true);

    // .d.ts ignored
    expect(index.get("Ignored")).toBeUndefined();
  });
});
