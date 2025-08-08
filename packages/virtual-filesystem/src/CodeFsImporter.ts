// packages/virtual-filesystem/src/CodeFsImporter.ts
import type { IFilePath, IFileOperation, IFileOps } from "file-operations";
import type { IFileSystem } from "./Filesystem.js";
import { VirtualFileSystemBuilder } from "./VirtualFileSystemBuilder.js";
import { DefaultPathService, type IPathService } from "./IPathService.js";
import { DefaultGlobService } from "./glob/DefaultGlobService.js";
import type { IGlobService } from "./glob/IGlobService.js";

export interface ImportOptions {
  root: string;
  include?: string[];
  exclude?: string[];
  includeEmptyDirs?: boolean;
}

function looksLikeIFileOps(x: unknown): x is IFileOps {
  return !!x && typeof (x as any).path === "object" && typeof (x as any).file === "object";
}

export class CodeFsImporter {
  private readonly ops!: IFileOps;
  private readonly pathSvc!: IPathService;
  private readonly globSvc!: IGlobService;

  // (ops, pathSvc?, globSvc?) OR (path, file, pathSvc?, globSvc?)
  constructor(ops: IFileOps, pathSvc?: IPathService, globSvc?: IGlobService);
  constructor(path: IFilePath, file: IFileOperation, pathSvc?: IPathService, globSvc?: IGlobService);
  constructor(a: IFileOps | IFilePath, b?: IPathService | IFileOperation, c?: IPathService | IGlobService, d?: IGlobService) {
    if (looksLikeIFileOps(a)) {
      this.ops = a as IFileOps;
      this.pathSvc = (b as IPathService) ?? new DefaultPathService(this.ops.path);
      this.globSvc = (c as IGlobService) ?? new DefaultGlobService();
    } else {
      const path = a as IFilePath;
      const file = b as IFileOperation;
      this.ops = { path, file };
      this.pathSvc = (c as IPathService) ?? new DefaultPathService(path);
      this.globSvc = d ?? new DefaultGlobService();
    }
  }

  async import(opts: ImportOptions): Promise<IFileSystem> {
    const include = opts.include ?? ["**/*.{ts,tsx,js,jsx}"];
    const exclude = opts.exclude ?? ["**/node_modules/**", "**/dist/**", "**/*.d.ts"];
    const includeEmptyDirs = opts.includeEmptyDirs ?? true;

    const vfs = new VirtualFileSystemBuilder();
    const dirs = new Set<string>();

    // files
    const filesAbs = await this.globSvc.glob(include, {
      cwd: opts.root, ignore: exclude, absolute: true, onlyFiles: true, followSymbolicLinks: false,
    });
    for (const abs of filesAbs) {
      const rel = this.pathSvc.normalizeRel(opts.root, abs);
      const content = this.ops.file.read(abs);
      vfs.withFile(rel, content);
      this.pathSvc.collectParentDirs(rel, dirs);
    }

    // optional empty dirs
    if (includeEmptyDirs) {
      const dirsAbs = await this.globSvc.glob(["**/*"], {
        cwd: opts.root, ignore: exclude, absolute: true, onlyDirectories: true, followSymbolicLinks: false,
      });
      for (const dAbs of dirsAbs) {
        const rel = this.pathSvc.normalizeRel(opts.root, dAbs);
        dirs.add(rel);
        this.pathSvc.collectParentDirs(rel, dirs);
      }
    }

    for (const d of dirs) if (d && d !== ".") vfs.withDirectory(d);
    return vfs.withImmutable(true).build();
  }
}
