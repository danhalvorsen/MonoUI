import { Project, ImportDeclaration, ImportSpecifier } from "ts-morph";
import type { FixOptions } from "./types.js";
import { buildExportIndex } from "./analyzer.js";
import { chooseBestExport } from "./heuristics.js";
import { computeModulePath } from "./resolvePath.js";
import fg from "fast-glob";
import type { FixContext } from "./context.js";
import type { SymbolExport } from "./types.js";
export async function fixImports(opts: FixOptions, ctx: FixContext) {
  const project = new Project({
    tsConfigFilePath: undefined,
    skipAddingFilesFromTsConfig: true
  });

  const files = await fg(opts.include, { cwd: opts.root, ignore: opts.exclude, absolute: true });
  project.addSourceFilesAtPaths(files);
  const index = await buildExportIndex(opts, ctx);

  const changes: Array<{ file: string; from: string; to: string }> = [];

  for (const sf of project.getSourceFiles()) {
    if (sf.getBaseName().endsWith(".d.ts")) continue;

    sf.getImportDeclarations().forEach((imp: ImportDeclaration) => {
      const spec = imp.getModuleSpecifierValue();
      if (!spec.startsWith(".") && !spec.startsWith("/")) return;

      const named = imp.getNamedImports().map((n: ImportSpecifier) => n.getName());
      const def = imp.getDefaultImport()?.getText();

      const targets = new Set<string>();

      named.forEach((n: string) => {
        const candidates = index.get(n) ?? [];
        const chosen = chooseBestExport(ctx.path, n, candidates);
        if (chosen) targets.add(chosen.filePath);
      });

      if (def) {
        const candidates = (index.get(def) ?? []).filter(x => x.isDefault);
        const chosen = chooseBestExport(ctx.path, def, candidates.length ? candidates : (index.get(def) ?? []));
        if (chosen) targets.add(chosen.filePath);
      }

      if (targets.size === 0) return;
      if (targets.size > 1) return;

      const targetAbs = [...targets][0];
      const fromAbs = sf.getFilePath();

      const desired = computeModulePath(ctx.path, fromAbs, targetAbs, opts.addJsExtension);
      const current = normalizeImportPath(spec);
      if (sameTarget(current, desired)) return;

      changes.push({ file: fromAbs, from: spec, to: desired });
      imp.setModuleSpecifier(desired);
    });
  }

  if (opts.write) {
    await project.save();
  }

  return changes;
}

function sameTarget(current: string, desired: string) {
  const strip = (p: string) => p.replace(/\.(ts|tsx|js|mjs|cjs)$/i, "");
  return strip(current) === strip(desired);
}

function normalizeImportPath(p: string) {
  return p.replace(/\\/g, "/");
}
