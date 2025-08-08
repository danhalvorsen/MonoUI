import { describe, it, expect, vi } from "vitest";
import { CodeFsImporter } from "../src/CodeFsImporter.js";
import { DefaultPathService } from "../src/IPathService.js";
import {
  FileOperationsBuilder,
  MockFileOperation,
  NodeFilePath,
  type IFileOps,
} from "file-operations";
import { FakeGlobService } from "./fakes/FakeGlobService.js";
type Globber = ConstructorParameters<typeof CodeFsImporter>[3] extends infer T
  ? T
  : never;

function makeOpsInMem(): IFileOps {
  return new FileOperationsBuilder().forInMemory().build();
}

describe("CodeFsImporter (OOP)", () => {
  it("imports TS/TSX, records parent dirs, skips node_modules/dist/.d.ts", async () => {
    const ops = makeOpsInMem();
    const mem = ops.file as MockFileOperation;
    mem.preload("/repo/src/a.ts", "a");
    mem.preload("/repo/src/sub/b.tsx", "b");
    mem.preload("/repo/node_modules/x/index.js", "ignored");
    mem.preload("/repo/dist/out.js", "ignored");
    mem.preload("/repo/types/a.d.ts", "ignored");

   const glob = vi.fn<(patterns: any, options: any) => Promise<string[]>>((patterns: any, options: any) => {
  if (options.onlyFiles) {
    const all = [
      "/repo/src/a.ts",
      "/repo/src/sub/b.tsx",
      "/repo/node_modules/x/index.js",
      "/repo/dist/out.js",
      "/repo/types/a.d.ts",
    ];
    // simulate 'ignore' from importer
    const filtered = all.filter(
      (p) =>
        !p.includes("/node_modules/") &&
        !p.includes("/dist/") &&
        !p.endsWith(".d.ts")
    );
    return Promise.resolve(filtered);
  }
  if (options.onlyDirectories) {
    // directories list can include everything; importer only records dirs for kept files
    return Promise.resolve([
      "/repo",
      "/repo/src",
      "/repo/src/sub",
      "/repo/node_modules",
      "/repo/dist",
      "/repo/types",
    ]);
  }
  return Promise.resolve([]);
});


    const importer = new CodeFsImporter(
      ops,
      new DefaultPathService(new NodeFilePath()),
      { glob }
    );

    const vfs = await importer.import({ root: "/repo" });

    expect(glob).toHaveBeenCalledTimes(2); // files + dirs
    expect(vfs.files.get("src/a.ts")).toBe("a");
    expect(vfs.files.get("src/sub/b.tsx")).toBe("b");
    expect(vfs.files.has("types/a.d.ts")).toBe(false);
    expect(vfs.files.has("node_modules/x/index.js")).toBe(false);
    expect(vfs.files.has("dist/out.js")).toBe(false);
    expect(vfs.directories.has("src")).toBe(true);
    expect(vfs.directories.has("src/sub")).toBe(true);
  });

  it("respects includeEmptyDirs=false (one glob call only)", async () => {
    const ops = makeOpsInMem();
    const mem = ops.file as MockFileOperation;
    mem.preload("/r/a.ts", "a");

    const glob = vi.fn((patterns: any, options: any) => {
      if (options.onlyFiles) return Promise.resolve(["/r/a.ts"]);
      if (options.onlyDirectories) return Promise.resolve([]); // shouldn't be called
      return Promise.resolve([]);
    });

    const importer = new CodeFsImporter(
      ops,
      new DefaultPathService(new NodeFilePath()),
      { glob }
    );

    const vfs = await importer.import({ root: "/r", includeEmptyDirs: false });

    expect(glob).toHaveBeenCalledTimes(1);
    expect(vfs.files.get("a.ts")).toBe("a");
    // parent dir of file should still be recorded (src-less path here has no parent)
     expect(Array.from(vfs.directories.values()).length).toBe(0);
  });

  it("supports custom include patterns", async () => {
    const ops = makeOpsInMem();
    const mem = ops.file as MockFileOperation;
    mem.preload("/root/x.md", "ignored");
    mem.preload("/root/y.js", "kept");

    const glob = vi.fn<(patterns: any, options: any) => Promise<string[]>>((patterns: any, options: any) => {
      if (options.onlyFiles) {
        // respect incoming include patterns (simulate)
        if (Array.isArray(patterns) && patterns.includes("**/*.js")) {
          return Promise.resolve(["/root/y.js"]);
        }
        return Promise.resolve([]);
      }
      if (options.onlyDirectories) return Promise.resolve(["/root"]);
      return Promise.resolve([]);
    });

    const importer = new CodeFsImporter(
      ops,
      new DefaultPathService(new NodeFilePath()),
      { glob }
    );

    const vfs = await importer.import({
      root: "/root",
      include: ["**/*.js"], // custom include overrides default
    });

    expect(Array.from(vfs.files.keys())).toEqual(["y.js"]);
    expect(vfs.files.get("y.js")).toBe("kept");
  });
});
