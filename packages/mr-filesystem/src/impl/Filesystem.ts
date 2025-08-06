 
import fs from 'fs';
import { IFileSystem } from '../IFileSystem.js';

export class FileSystem implements IFileSystem {
  readFileSync(path: string, encoding: BufferEncoding = 'utf-8'): string {
    return fs.readFileSync(path, encoding);
  }
  writeFileSync(path: string, data: string): void {
    fs.writeFileSync(path, data);
  }
  readdirSync(path: string, opts?: any): any[] {
    return fs.readdirSync(path, opts);
  }
  existsSync(path: string): boolean {
    return fs.existsSync(path);
  }
  unlinkSync(path: string): void {
    fs.unlinkSync(path);
  }
}