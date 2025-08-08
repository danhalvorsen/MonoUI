import { describe, it, expect } from "vitest";
import path from "node:path";
import { chooseBestExport } from "../src/heuristics.js";
import type { SymbolExport } from "../src/types.js";
import { NodeFilePath } from "file-operations";

const fp = new NodeFilePath();
const norm = (p: string) => p.replace(/\\/g, "/");
const make = (filePath: string, symbol: string, isDefault = false): SymbolExport => ({
  symbol,
  filePath: norm(filePath),
  isDefault
});

describe("chooseBestExport", () => {
  it("returns null for empty candidates", () => {
    expect(chooseBestExport(fp, "Alpha", [])).toBeNull();
  });

  it("returns the only candidate", () => {
    const c = make(path.join("src/a/Alpha.ts"), "Alpha");
    expect(chooseBestExport(fp, "Alpha", [c])).toBe(c);
  });

  it("prefers filename == symbol (exact filename hit wins)", () => {
    const a = make(path.join("src/a/NotAlpha.ts"), "Alpha");
    const b = make(path.join("src/a/Alpha.ts"), "Alpha");
    expect(chooseBestExport(fp, "Alpha", [a, b])).toBe(b);
  });

  it("prefers non-index over index when no filename match", () => {
    const idx = make(path.join("src/lib/index.ts"), "Gamma");
    const non = make(path.join("src/lib/Gamma.ts"), "Gamma");
    expect(chooseBestExport(fp, "Zeta", [idx, non])).toBe(non);
  });

  it("falls back to first candidate when no heuristic applies", () => {
    const a = make(path.join("src/x/One.ts"), "Kappa");
    const b = make(path.join("src/y/Two.ts"), "Kappa");
    expect(chooseBestExport(fp, "Omega", [a, b])).toBe(a);
  });

  it("treats .tsx and .ts as equivalent for filename match", () => {
    const a = make(path.join("src/a/Alpha.tsx"), "Alpha");
    const b = make(path.join("src/a/Alpha.ts"), "Alpha");
    // both match filename; first matching candidate should be returned
    expect(chooseBestExport(fp, "Alpha", [a, b])).toBe(a);
  });

  it("does not consider index.ts a filename match for 'index'", () => {
    const idx = make(path.join("src/pkg/index.ts"), "index");
    const proper = make(path.join("src/pkg/Index.ts"), "index");
    expect(chooseBestExport(fp, "index", [idx, proper])).toBe(proper);
  });

  it("ignores isDefault for ordering (same file)", () => {
    const def = make(path.join("src/m/Model.ts"), "Model", true);
    const non = make(path.join("src/m/Model.ts"), "Model", false);
    // same file; first in list wins
    expect(chooseBestExport(fp, "Model", [def, non])).toBe(def);
  });

  it("handles Windows-style separators", () => {
    const w = make("src\\a\\Alpha.ts", "Alpha");
    const other = make("src/b/NotAlpha.ts", "Alpha");
    expect(chooseBestExport(fp, "Alpha", [other, w])).toBe(w);
  });
});
