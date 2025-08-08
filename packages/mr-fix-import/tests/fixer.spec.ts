import { describe, it, expect, afterEach } from "vitest";
import { VirtualFileSystemBuilder } from "virtual-filesystem";
import { VirtualFsTestHost } from "./helpers/VirtualFsTestHost.js";
import { fixImports } from "../src/fixer.js";
import type { FixOptions } from "../src/types.js";
import type { FixContext } from "../src/context.js";
import { NodeFilePath } from "file-operations";

const fp = new NodeFilePath();
let host: VirtualFsTestHost | null = null;
afterEach(() => { host?.cleanup(); host = null; });

describe("fixer with virtual-filesystem", () => {
  it("rewrites to exact files and appends .js", async () => {
    const vfs = new VirtualFileSystemBuilder()
      .withFile("src/a/Alpha.ts", `export class Alpha {}`)
      .withFile("src/b/Beta.ts", `export const Beta = 1;`)
      .withFile("src/c/Consumer.ts", `
        import { Alpha } from "../../wrong/place";
        import { Beta } from "../b";
        export const go = () => new Alpha();
        console.log(Beta);
      `)
      .build();

    host = VirtualFsTestHost.createFrom(vfs);

    const opts: FixOptions = {
      root: host.root, write: true, addJsExtension: true,
      include: ["src/**/*.ts"],
      exclude: ["**/*.d.ts", "**/node_modules/**", "**/dist/**"]
    };
    const ctx: FixContext = { path: fp };

    const changes = await fixImports(opts, ctx);
    const updated = host.read("src/c/Consumer.ts");

    expect(changes.length).toBe(2);
    expect(updated).toContain(`from "../a/Alpha.js"`);
    expect(updated).toContain(`from "../b/Beta.js"`);
  });
});
