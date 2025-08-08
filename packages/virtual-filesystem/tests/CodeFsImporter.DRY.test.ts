// packages/virtual-filesystem/tests/CodeFsImporter.DRY.test.ts
import { describe, it, expect } from "vitest";
import { CodeFsImporter } from "../src/CodeFsImporter.js";
import { DefaultPathService } from "../src/IPathService.js";
import { FakeGlobService } from "./fakes/FakeGlobService.js";
import { FileOperationsBuilder, MockFileOperation } from "file-operations";

describe("CodeFsImporter + FileOperationsBuilder (DRY)", () => {
  it("happy path with in-memory ops", async () => {
    const ops = new FileOperationsBuilder().forInMemory().build();
    (ops.file as MockFileOperation).preload("/root/a.ts", "export const a=1;");

    const importer = new CodeFsImporter(
      ops,
      new DefaultPathService(ops.path),
      new FakeGlobService(["/root/a.ts"], ["/root"])
    );

    const vfs = await importer.import({ root: "/root", includeEmptyDirs: false });
    expect(vfs.files.get("a.ts")).toBe("export const a=1;");
  });
});
