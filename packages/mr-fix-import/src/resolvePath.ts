import type { IFilePath } from "file-operations";

/** Compute a relative module specifier from `fromFileAbs` → `toFileAbs`. */
export function computeModulePath(
  fp: IFilePath,
  fromFileAbs: string,
  toFileAbs: string,
  addJsExt: boolean
): string {
  const fromDir = fp.dirname(fromFileAbs);
  // NOTE: your interface is spelled `releativePath`
  const relRaw = fp.releativePath(fromDir, toFileAbs);
  const rel = relRaw.replace(/\\/g, "/");
  let noExt = rel.replace(/\.(ts|tsx)$/, "");
  if (!noExt.startsWith(".")) noExt = "./" + noExt;
  return addJsExt ? ensureJsExt(noExt) : noExt;
}

function ensureJsExt(p: string): string {
  if (/\.(js|mjs|cjs)$/i.test(p)) return p;
  return p + ".js";
}
