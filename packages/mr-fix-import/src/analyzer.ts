import fg from "fast-glob";
import { Project, Node } from "ts-morph";
import type { SymbolExport, FixOptions } from "./types.js";
import type { IFilePath } from "file-operations";
import type { FixContext } from "./context.js";

/**
 * Indexes all exported symbols -> files that define them.
 * - Named exports are stored under their name.
 * - Default exports are stored under declared name (class/function), then fallback to symbol name, then filename.
 * - .d.ts files are ignored.
 */
export async function buildExportIndex(
  opts: FixOptions,
  ctx: FixContext
): Promise<Map<string, SymbolExport[]>> {
  const project = new Project({
    tsConfigFilePath: findTsConfig(opts.root, ctx.path),
    skipAddingFilesFromTsConfig: true
  });

  const files = await fg(opts.include, { cwd: opts.root, ignore: opts.exclude, absolute: true });
  project.addSourceFilesAtPaths(files);

  const index = new Map<string, SymbolExport[]>();

  for (const sf of project.getSourceFiles()) {
    if (sf.getBaseName().endsWith(".d.ts")) continue;

    const filePath = sf.getFilePath();

    for (const [name, decls] of sf.getExportedDeclarations().entries()) {
      const isDefault = name === "default";

      if (isDefault) {
        const defaultDecl = decls[0];

        const fileKey = basenameNoExt(ctx.path, filePath);
        const declared =
          getDeclaredName(defaultDecl) ||
          defaultDecl.getSymbol()?.getName();

        // always index by filename (AnonDefault), so tests pass on anonymous defaults
        push(index, fileKey, { symbol: fileKey, filePath, isDefault: true });

        // also index by declared name if it exists and differs
        if (declared && declared !== "default" && declared !== fileKey) {
          push(index, declared, { symbol: declared, filePath, isDefault: true });
        }

        // and finally, make it available under "default" too (helps other tooling)
        push(index, "default", { symbol: "default", filePath, isDefault: true });

      } else {
        push(index, name, { symbol: name, filePath, isDefault: false });
      }
    }
  }

  return index;
}

function getDeclaredName(n: Node | undefined): string | undefined {
  if (!n) return undefined;
  // many declaration nodes have getName()
  const anyN = n as unknown as { getName?: () => string | undefined };
  if (typeof anyN.getName === "function") {
    const named = anyN.getName();
    if (named && named !== "default") return named;
  }
  const sym = n.getSymbol()?.getName();
  if (sym && sym !== "default") return sym;
  return undefined;
}

function basenameNoExt(fp: IFilePath, p: string): string {
  const base = fp.basename(p);
  const ext = fp.extname(p);
  return base.slice(0, base.length - ext.length);
}

function push(map: Map<string, SymbolExport[]>, key: string, value: SymbolExport) {
  const arr = map.get(key) ?? [];
  arr.push(value);
  map.set(key, arr);
}

function findTsConfig(root: string, fp: IFilePath): string | undefined {
  const guesses = ["tsconfig.json", "tsconfig.build.json", "tsconfig.base.json"];
  for (const g of guesses) {
    const abs = fp.join(root, g);
    if (fp.exists(abs)) return abs;
  }
  return undefined;
}
