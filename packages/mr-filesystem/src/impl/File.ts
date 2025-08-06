import { IFile } from '../IFile.js';
import { IPath } from '../IPath.js';
import fs from 'fs';
import pathModule from 'path';

export class File implements IFile {
  constructor(private readonly filePath: string) {}
  toString() { return this.filePath; }
  join(...segments: string[]): IPath {
    return new File(pathModule.join(this.filePath, ...segments));
  }
  dirname(): IPath {
    return new File(pathModule.dirname(this.filePath));
  }
  basename(): string {
    return pathModule.basename(this.filePath);
  }
  extname(): string {
    return pathModule.extname(this.filePath);
  }
  isAbsolute(): boolean {
    return pathModule.isAbsolute(this.filePath);
  }
  isRelative(): boolean {
    return !this.isAbsolute();
  }
  toAbsolute(base?: string | IPath): IPath {
    const basePath = base ? (typeof base === 'string' ? base : base.toString()) : process.cwd();
    return new File(pathModule.resolve(basePath, this.filePath));
  }
  toRelative(base?: string | IPath): IPath {
    const basePath = base ? (typeof base === 'string' ? base : base.toString()) : process.cwd();
    return new File(pathModule.relative(basePath, this.filePath));
  }
  read(encoding: string = 'utf-8'): string {
    return fs.readFileSync(this.filePath, encoding as BufferEncoding);
  }
  write(data: string): void {
    fs.writeFileSync(this.filePath, data);
  }
  delete(): void {
    fs.unlinkSync(this.filePath);
  }
  exists(): boolean {
    return fs.existsSync(this.filePath);
  }
}
