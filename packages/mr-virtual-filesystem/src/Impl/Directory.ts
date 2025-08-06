import { IDirectory } from '../IDirectory.js';
import { IPath } from '../IPath.js';

// In-memory Directory implementation

export class Directory implements IDirectory {
    constructor(private readonly path: string, private storage: Map<string, string>) { }
    toString() { return this.path; }
    join(...segments: string[]): IPath {
        return new Directory([this.path, ...segments].join('/').replace(/\\/g, '/'), this.storage);
    }
    dirname(): IPath {
        const idx = this.path.lastIndexOf('/');
        return new Directory(idx > 0 ? this.path.slice(0, idx) : '/', this.storage);
    }
    basename(): string {
        return this.path.split('/').pop() || '';
    }
    extname(): string {
        return '';
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
        return new Directory(basePath.replace(/\/$/, '') + '/' + this.path, this.storage);
    }
    toRelative(base?: string | IPath): IPath {
        const basePath = typeof base === 'string' ? base : base?.toString() || '/';
        if (this.path.startsWith(basePath)) {
            return new Directory(this.path.slice(basePath.length).replace(/^\/+/, ''), this.storage);
        }
        return this;
    }
    list(): IPath[] {
        const prefix = this.path.endsWith('/') ? this.path : this.path + '/';
        return Array.from(this.storage.keys())
            .filter(f => f.startsWith(prefix) && !f.slice(prefix.length).includes('/'))
            .map(f => new File(f, this.storage));
    }
    create(): void {
        // No-op for in-memory
    }
    delete(): void {
        // Remove all files in this directory
        const prefix = this.path.endsWith('/') ? this.path : this.path + '/';
        for (const key of Array.from(this.storage.keys())) {
            if (key.startsWith(prefix)) this.storage.delete(key);
        }
    }
    exists(): boolean {
        // Directory exists if any file is in it
        const prefix = this.path.endsWith('/') ? this.path : this.path + '/';
        return Array.from(this.storage.keys()).some(f => f.startsWith(prefix));
    }
}
