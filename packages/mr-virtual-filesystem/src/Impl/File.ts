import { IFile } from '../IFile.js';
import { IPath } from '../IPath.js';

// In-memory File implementation
export class File implements IFile {
  constructor(private readonly path: string, private storage: Map<string, string>) {}
  toString() { return this.path; }
  join(...segments: string[]): IPath {
    return new File([this.path, ...segments].join('/').replace(/\\/g, '/'), this.storage);
  }
  dirname(): IPath {
    const idx = this.path.lastIndexOf('/');
    return new File(idx > 0 ? this.path.slice(0, idx) : '/', this.storage);
  }
  basename(): string {
    return this.path.split('/').pop() || '';
  }
  extname(): string {
    const base = this.basename();
    const idx = base.lastIndexOf('.');
    return idx >= 0 ? base.slice(idx) : '';
  }
  isAbsolute(): boolean {
    return this.path.startsWith('/');
  }
  isRelative(): boolean {
    return !this.isAbsolute();
  }
  toAbsolute(base?: string | IPath): IPath {
    if (this.isAbsolute()) return this;
    const basePath = typeof base === 'string' ? base : base?.toString() || '/';
    return new File(basePath.replace(/\/$/, '') + '/' + this.path, this.storage);
  }
  toRelative(base?: string | IPath): IPath {
    const basePath = typeof base === 'string' ? base : base?.toString() || '/';
    if (this.path.startsWith(basePath)) {
      return new File(this.path.slice(basePath.length).replace(/^\/+/, ''), this.storage);
    }
    return this;
  }
  read(encoding: string = 'utf-8'): string {
    if (!this.storage.has(this.path)) throw new Error(`File not found: ${this.path}`);
    return this.storage.get(this.path)!;
  }
  write(data: string): void {
    this.storage.set(this.path, data);
  }
  delete(): void {
    this.storage.delete(this.path);
  }
  exists(): boolean {
    return this.storage.has(this.path);
  }
}

