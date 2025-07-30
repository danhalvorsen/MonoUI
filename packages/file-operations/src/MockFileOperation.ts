import { IFileOperation } from "./IFileOperation.js";

 
export class MockFileOperation implements IFileOperation {
  private files = new Map<string, string>();

  read(path: string): string {
    if (!this.files.has(path)) throw new Error(`Mock file not found: ${path}`);
    return this.files.get(path)!;
  }

  write(path: string, content: string): void {
    this.files.set(path, content);
  }

  exists(path: string): boolean {
    return this.files.has(path);
  }

  preload(path: string, content: string): void {
    this.files.set(path, content);
  }
}

