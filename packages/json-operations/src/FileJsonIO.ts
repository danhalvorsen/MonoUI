import { readFileSync, writeFileSync, existsSync } from 'fs';
import type { IJsonIO } from './IJsonIO.js';

export class FileJsonIO implements IJsonIO {
  readJson<T = unknown>(path: string): T {
    try {
      if (!existsSync(path)) {
        throw new Error(`File does not exist: ${path}`);
      }
      const content = readFileSync(path, 'utf8');
      return JSON.parse(content) as T;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to read JSON from ${path}: ${error.message}`);
      }
      throw new Error(`Failed to read JSON from ${path}: Unknown error`);
    }
  }

  writeJson<T>(path: string, data: T): void {
    const content = JSON.stringify(data, null, 2) + '\n';
    writeFileSync(path, content, 'utf8');
  }

  exists(path: string): boolean {
    return existsSync(path);
  }
}
