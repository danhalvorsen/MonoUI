import { existsSync, statSync } from 'fs';
import { relative as nodeRelative, join, dirname, basename, extname, resolve, normalize } from 'path';
import { IFilePath } from './IFilePath.js';

export class NodeFilePath implements IFilePath {
  exists(path: string): boolean {
    return existsSync(path);
  }

  isDirectory(path: string): boolean {
    try {
      return this.exists(path) && statSync(path).isDirectory();
    } catch {
      return false;
    }
  }

  /** Preferred API */
  relative(from: string, to: string): string {
    return nodeRelative(from, to);
  }

  /** Back-compat alias */
  releativePath(from: string, to: string): string {
    return this.relative(from, to);
  }

  join(...paths: string[]): string { return join(...paths); }
  dirname(path: string): string { return dirname(path); }
  basename(path: string): string { return basename(path); }
  extname(path: string): string { return extname(path); }
  resolve(...paths: string[]): string { return resolve(...paths); }
  normalize(path: string): string { return normalize(path); }
}
