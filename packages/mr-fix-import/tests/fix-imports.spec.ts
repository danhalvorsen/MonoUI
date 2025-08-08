import { describe, it, expect } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fixImports } from "../src/fixer.js";
import type { FixOptions } from "../src/types.js";
import { NodeFilePath } from "file-operations";
import type { FixContext } from "../src/context.js";

function tmpdir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "fix-imports-"));
}
function write(p: string, c: string) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, c, "utf8");
}

describe("fix-imports", () => {
  it("rewrites import to actual file exporting symbol", async () => {
    const root = tmpdir();
    const aPath = path.join(root, "src/a/Alpha.ts");
    const bPath = path.join(root, "src/b/Beta.ts");
    const cPath = path.join(root, "src/c/Consumer.ts");

    write(aPath, `export class Alpha {}`);
    write(bPath, `export const Beta = 1;`);
    write(cPath, `
      import { Alpha } from "../../wrong/place";
      import { Beta } from "../b";
      export const go = () => new Alpha();
      console.log(Beta);
    `);

    const opts: FixOptions = {
      root,
      write: true,
      addJsExtension: true,
      include: ["src/**/*.ts"],
      exclude: ["**/*.d.ts", "**/node_modules/**", "**/dist/**"]
    };
    const ctx: FixContext = { path: new NodeFilePath() };

    const changes = await fixImports(opts, ctx);

    const updated = fs.readFileSync(cPath, "utf8");
    expect(updated).toContain(`from "../a/Alpha.js"`);
    expect(updated).toContain(`from "../b/Beta.js"`);
    expect(changes.length).toBe(2);
  });
});
