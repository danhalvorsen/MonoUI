import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { NodeFilePath } from "file-operations";
import type { IFileSystem } from "virtual-filesystem";

const fp = new NodeFilePath();

export class VirtualFsTestHost {
  readonly root: string;

  private constructor(root: string) {
    this.root = root;
  }

  static createFrom(vfs: IFileSystem): VirtualFsTestHost {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "mr-fix-import-vfs-"));
    const host = new VirtualFsTestHost(root);

    // create directories
    for (const dir of vfs.directories) {
      const abs = host.abs(dir);
      fs.mkdirSync(abs, { recursive: true });
    }

    // write files
    for (const [rel, content] of vfs.files) {
      const abs = host.abs(rel);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, content, "utf8");
    }

    return host;
  }

  abs(p: string): string {
    const clean = p.replace(/^[/\\]+/, ""); // strip leading slash for join
    return fp.normalize(fp.join(this.root, clean));
  }

  read(rel: string): string {
    return fs.readFileSync(this.abs(rel), "utf8");
  }

  exists(rel: string): boolean {
    return fs.existsSync(this.abs(rel));
  }

  cleanup(): void {
    // best-effort cleanup
    try {
      fs.rmSync(this.root, { recursive: true, force: true });
    } catch {}
  }
}
