// packages/virtual-filesystem/src/IPathService.ts
import type { IFilePath } from "file-operations";

export interface IPathService {
  /** normalize absolute -> posix-like relative (trim leading ./) */
  normalizeRel(root: string, abs: string): string;
  /** add all parents of relPath into dirs */
  collectParentDirs(relPath: string, dirs: Set<string>): void;
}

export class DefaultPathService implements IPathService {
  constructor(private readonly path: IFilePath) {}

  normalizeRel(root: string, abs: string): string {
    const anyPath = this.path as unknown as {
      relative?: (from: string, to: string) => string;
      releativePath?: (from: string, to: string) => string; // legacy typo supported
    };

    let rel: string;
    if (typeof anyPath.relative === "function") rel = anyPath.relative(root, abs);
    else if (typeof anyPath.releativePath === "function") rel = anyPath.releativePath(root, abs);
    else throw new Error("IFilePath must provide relative() or releativePath().");

    const unix = rel.replace(/\\/g, "/");
    return unix.startsWith("./") ? unix.slice(2) : unix;
  }

  collectParentDirs(relPath: string, dirs: Set<string>): void {
    let cur = this.path.dirname(relPath);
    while (cur && cur !== "." && !dirs.has(cur)) {
      dirs.add(cur);
      const next = this.path.dirname(cur);
      if (next === cur) break;
      cur = next;
    }
  }
}
