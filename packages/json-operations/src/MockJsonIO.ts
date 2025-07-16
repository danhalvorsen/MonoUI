import { IJsonIO } from './IJsonIO.js';

export class MockJsonIO implements IJsonIO {
  private store = new Map<string, string>();

  readJson<T>(path: string): T {
    if (!this.store.has(path)) {
      throw new Error(`Missing mock file: ${path}`);
    }
    return JSON.parse(this.store.get(path)!) as T;
  }

  writeJson<T>(path: string, data: T): void {
    this.store.set(path, JSON.stringify(data));
  }

  exists(path: string): boolean {
    return this.store.has(path);
  }

  preload<T>(path: string, data: T): void {
    this.store.set(path, JSON.stringify(data));
  }

  get(path: string): string | undefined {
    return this.store.get(path);
  }
}
