
import { IDirectory } from '../IDirectory.js';
import { IPath } from '../IPath.js';
import {File } from './File.js'
import * as fs from 'fs';
import path, { join } from 'path';

export class Directory implements IDirectory {
  constructor(private readonly dirPath: string) {}
  toString() { return this.dirPath; }
  join(...segments: string[]): IPath {
    return new Directory(join(this.dirPath, ...segments));
  }
  dirname(): IPath {
    return new Directory(path.dirname(this.dirPath));
  }
  basename(): string {
    return path.basename(this.dirPath);
  }
  extname(): string {
    return '';
  }
  isAbsolute(): boolean {
    return pathModule.isAbsolute(this.dirPath);
  }
  isRelative(): boolean {
    return !this.isAbsolute();
  }
  toAbsolute(base?: string | IPath): IPath {
    const basePath = base ? (typeof base === 'string' ? base : base.toString()) : process.cwd();
    return new Directory(pathModule.resolve(basePath, this.dirPath));
  }
  toRelative(base?: string | IPath): IPath {
    const basePath = base ? (typeof base === 'string' ? base : base.toString()) : process.cwd();
    return new Directory(pathModule.relative(basePath, this.dirPath));
  }
  list(): IPath[] {
    return fs.readdirSync(this.dirPath)
      .map(f => {
        const fullPath = pathModule.join(this.dirPath, f);
        return fs.statSync(fullPath).isDirectory()
          ? new Directory(fullPath)
          : new File(fullPath);
      });
  }
  create(): void {
    if (!fs.existsSync(this.dirPath)) fs.mkdirSync(this.dirPath, { recursive: true });
  }
  delete(): void {
    if (fs.existsSync(this.dirPath)) fs.rmdirSync(this.dirPath, { recursive: true });
  }
  exists(): boolean {
    return fs.existsSync(this.dirPath);
  }
}
