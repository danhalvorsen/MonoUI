import type { IFilePath } from "file-operations";
import type { SymbolExport } from "./types.js";

function basenameNoExt(fp: IFilePath, p: string): string {
  const base = fp.basename(p);
  const ext = fp.extname(p);
  return base.slice(0, base.length - ext.length);
}

// CASE-SENSITIVE: only exact "index.ts" is a barrel
function isIndexFile(fp: IFilePath, p: string): boolean {
  return fp.basename(p) === "index.ts" || basenameNoExt(fp, p) === "index";
}

export function chooseBestExport(
  fp: IFilePath,
  symbol: string,
  candidates: SymbolExport[]
): SymbolExport | null {
  if (candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0];

  // 1) exact filename (not index.*)
  const exact = candidates.find(c => {
    const bn = basenameNoExt(fp, c.filePath);
    if (bn === "index") return false;
    return bn === symbol;
  });
  if (exact) return exact;

  // 2) prefer non-index over index
  const nonBarrel = candidates.find(c => !isIndexFile(fp, c.filePath));
  if (nonBarrel) return nonBarrel;

  // 3) fallback to first
  return candidates[0];
}
