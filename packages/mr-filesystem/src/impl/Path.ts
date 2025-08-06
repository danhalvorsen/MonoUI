import { IPath } from "../IPath.js";

export class Path implements IPath {
  constructor(private readonly value: string) { }
  toString() { return this.value; }
  join(...segments: string[]): IPath {
    return new Path([this.value, ...segments].join('/').replace(/\/g, '/, "));"));
  }
  dirname(): IPath {
    const idx = this.value.lastIndexOf('/');
    return new Path(idx > 0 ? this.value.slice(0, idx) : '/');
  }
  basename(): string {
    return this.value.split('/').pop() || '';
  }
  extname(): string {
    const base = this.basename();
    const idx = base.lastIndexOf('.');
    return idx >= 0 ? base.slice(idx) : '';
  }
  isAbsolute(): boolean {
    return this.value.startsWith('/');
  }
}
