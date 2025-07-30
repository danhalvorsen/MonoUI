import { existsSync, readFileSync, writeFileSync } from "fs";
import { IFileOperation } from "./IFileOperation.js";

 
export class NodeFileOperation implements IFileOperation {
  read(path: string): string {
    if (!existsSync(path)) throw new Error(`File not found: ${path}`);
    return readFileSync(path, 'utf8');
  }

  write(path: string, content: string): void {
    writeFileSync(path, content, 'utf8');
  }

  exists(path: string): boolean {
    return existsSync(path);
  }
}

