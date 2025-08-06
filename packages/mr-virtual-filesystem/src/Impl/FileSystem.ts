import { IVirtualFileSystem } from "../IVirtualFileSystem.js";

export class FileSystem implements IVirtualFileSystem {
  private files = new Map<string, string>();
  private directories = new Set<string>();

  readFileSync(path: string, encoding: string = 'utf-8'): string {
    if (!this.files.has(path)) throw new Error(`File not found: ${path}`);
    return this.files.get(path)!;
  }

  writeFileSync(path: string, data: string): void {
    this.files.set(path, data);
    this.directories.add(this.dirname(path));
  }

  readdirSync(path: string, opts?: any): any[] {
    // Return file names in the directory
    const prefix = path.endsWith('/') ? path : path + '/';
    return Array.from(this.files.keys())
      .filter(f => f.startsWith(prefix) && !f.slice(prefix.length).includes('/'))
      .map(f => ({ name: f.slice(prefix.length), isFile: () => true, isDirectory: () => false }));
  }

  existsSync(path: string): boolean {
    return this.files.has(path) || this.directories.has(path);
  }

  unlinkSync(path: string): void {
    this.files.delete(path);
  }

  private dirname(path: string): string {
    const idx = path.lastIndexOf('/');
    return idx > 0 ? path.slice(0, idx) : '/';
  }
}