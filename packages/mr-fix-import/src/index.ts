#!/usr/bin/env node
import { Command } from "commander";
import path from "node:path";
import { fixImports } from "./fixer.js";
import type { FixOptions } from "./types.js";
import { NodeFilePath } from "file-operations";
import type { FixContext } from "./context.js";

const program = new Command();

program
  .name("fix-imports")
  .description("Rewrite TS import paths after file/folder restructuring")
  .option("-r, --root <path>", "project root", process.cwd())
  .option("--write", "apply changes to files", false)
  .option("--add-js-extension", "append .js to relative imports", false)
  .option("-i, --include <globs...>", "include globs")
  .option("-x, --exclude <globs...>", "exclude globs")
  .action(async (opts) => {
    const options: FixOptions = {
      root: path.resolve(opts.root),
      write: Boolean(opts.write),
      addJsExtension: Boolean(opts.addJsExtension),
      include: (opts.include && opts.include.length) ? opts.include : ["**/*.ts", "**/*.tsx"],
      exclude: (opts.exclude && opts.exclude.length) ? opts.exclude : ["**/dist/**", "**/node_modules/**", "**/*.d.ts"]
    };

    const ctx: FixContext = { path: new NodeFilePath() };

    const changes = await fixImports(options, ctx);

    if (!options.write) {
      for (const c of changes) {
        console.log(`${relative(options.root, c.file)}: '${c.from}' -> '${c.to}'`);
      }
      console.log(`\n${changes.length} import${changes.length === 1 ? "" : "s"} would change. Run with --write to apply.`);
    } else {
      console.log(`Updated ${changes.length} import${changes.length === 1 ? "" : "s"}.`);
    }
  });

program.parseAsync(process.argv);

function relative(root: string, file: string) {
  return path.relative(root, file).replace(/\\/g, "/");
}
