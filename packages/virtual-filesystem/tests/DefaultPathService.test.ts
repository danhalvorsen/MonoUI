import { describe, it, expect } from "vitest";
import type { IFilePath } from "file-operations";
import { DefaultPathService } from "../src/IPathService.js";

class FakePath implements IFilePath {
  exists(): boolean { return true; }
  isDirectory(): boolean { return true; }
  // modern API
  relative(from: string, to: string): string {
    // simulate node path.relative with forward slashes
    return to.replace(from.replace(/\\/g, "/") + "/", "");
  }
  // legacy kept to verify fallback (unused here)
  releativePath(from: string, to: string): string { return this.relative(from, to); }
  join(...paths: string[]): string { return paths.join("/"); }
  dirname(p: string): string {
    const n = p.replace(/\\/g, "/").replace(/\/+$/, "");
    const i = n.lastIndexOf("/");
    return i <= 0 ? "" : n.slice(0, i);
  }
  basename(p: string): string { return p.split("/").pop() ?? ""; }
  extname(p: string): string { const m = /\.[^/.]+$/.exec(p); return m ? m[0] : ""; }
  resolve(...paths: string[]): string { return paths.join("/"); }
  normalize(p: string): string { return p.replace(/\\/g, "/"); }
}

describe("DefaultPathService", () => {
  it("normalizeRel trims ./ and uses POSIX slashes", () => {
    const svc = new DefaultPathService(new FakePath());
    const rel = svc.normalizeRel("/root", "/root/src/a.ts");
    expect(rel).toBe("src/a.ts");
  });

  it("collectParentDirs adds all parents", () => {
    const svc = new DefaultPathService(new FakePath());
    const dirs = new Set<string>();
    svc.collectParentDirs("src/utils/a.ts", dirs);
    expect(dirs).toEqual(new Set(["src/utils", "src"]));
  });
});
