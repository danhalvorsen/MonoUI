import { IFileOperations } from './IFileOperations.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { glob } from 'glob';
import { promisify } from 'util';

const globPromise = promisify(glob);

export class FileOperations implements IFileOperations {
  joinPaths(base: string, ...segments: string[]): string {
    return path.join(base, ...segments);
  }

  async exists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async readFile(filePath: string): Promise<string> {
    return await fs.readFile(filePath, 'utf-8');
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    // Ensure directory exists before writing
    const directory = path.dirname(filePath);
    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(filePath, content, 'utf-8');
  }

  async findFiles(pattern: string, options?: any): Promise<string[]> {
    return await globPromise(pattern, options || {}) as string[];
  }

  getRelativePath(from: string, to: string): string {
    return path.relative(from, to);
  }
}