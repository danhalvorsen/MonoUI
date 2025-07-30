import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import { GenerateBarrelPipe, GenerateBarrelData } from "@src/GenerateBarrelPipe";

const tempDir = path.resolve(__dirname, "tmp");

describe("GenerateBarrelPipe", () => {
  beforeEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
    fs.mkdirSync(tempDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("should generate an index.ts with exports for files with exports (positive)", async () => {
    // Create dummy files with exports
    const file1 = path.join(tempDir, "Foo.ts");
    const file2 = path.join(tempDir, "Bar.ts");
    fs.writeFileSync(file1, "export const Foo = 1;");
    fs.writeFileSync(file2, "export function Bar() {}");

    const pipe = new GenerateBarrelPipe();
    const data: GenerateBarrelData = { context: { targetDir: tempDir } };
    const result = await pipe.execute(data);

    const indexContent = fs.readFileSync(path.join(tempDir, "index.ts"), "utf-8");
    expect(indexContent).toContain(`export * from './Foo.js'`);
    expect(indexContent).toContain(`export * from './Bar.js'`);
    expect(result.context.fileCount).toBe(2);
  });

  it("should create an empty index.ts when no files have exports (negative)", async () => {
    fs.writeFileSync(path.join(tempDir, "NoExport.ts"), "const X = 1;");

    const pipe = new GenerateBarrelPipe();
    const data: GenerateBarrelData = { context: { targetDir: tempDir } };
    const result = await pipe.execute(data);

    const indexContent = fs.readFileSync(path.join(tempDir, "index.ts"), "utf-8");
    expect(indexContent.trim()).toBe(""); // No exports
    expect(result.context.fileCount).toBe(1);
  });

  it("should throw if targetDir does not exist (negative)", async () => {
    const invalidDir = path.join(tempDir, "nonexistent");
    const pipe = new GenerateBarrelPipe();
    const data: GenerateBarrelData = { context: { targetDir: invalidDir } };

    await expect(pipe.execute(data)).rejects.toThrow();
  });
});
