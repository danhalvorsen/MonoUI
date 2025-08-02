import { IFileOperations } from './IFileOperations.js';

/**
 * In-memory implementation of IFileOperations for testing with async methods
 */
export class MockFileOperations implements IFileOperations {
  private fileSystem: Map<string, string> = new Map();
  private fileExists: Map<string, boolean> = new Map();
  private globResults: Map<string, string[]> = new Map();
  
  constructor() {
    // Set default behavior
    this.fileExists.set('default', true);
  }
  
  /**
   * Reset the mock file system
   */
  reset(): void {
    this.fileSystem.clear();
    this.fileExists.clear();
    this.globResults.clear();
    this.fileExists.set('default', true);
  }
  
  /**
   * Mock a file's content
   * @param path The file path
   * @param content The file content
   */
  mockFile(path: string, content: string): void {
    this.fileSystem.set(path, content);
    this.fileExists.set(path, true);
  }
  
  /**
   * Mock file existence
   * @param path The path to check
   * @param exists Whether the path exists
   */
  mockExists(path: string, exists: boolean): void {
    this.fileExists.set(path, exists);
  }
  
  /**
   * Mock glob pattern results
   * @param pattern The glob pattern
   * @param results The matching file paths
   */
  mockGlob(pattern: string, results: string[]): void {
    this.globResults.set(pattern, results);
  }
  
  // IFileOperations async implementation
  async exists(path: string): Promise<boolean> {
    if (this.fileExists.has(path)) {
      return this.fileExists.get(path)!;
    }
    return this.fileExists.get('default') || false;
  }
  
  async readFile(path: string, encoding: BufferEncoding = 'utf8'): Promise<string> {
    if (this.fileSystem.has(path)) {
      return this.fileSystem.get(path)!;
    }
    throw new Error(`File not found: ${path}`);
  }
  
  async writeFile(path: string, content: string, encoding: BufferEncoding = 'utf8'): Promise<void> {
    this.fileSystem.set(path, content);
    this.fileExists.set(path, true);
  }
  
  async findFiles(pattern: string, options?: { ignore?: string[] }): Promise<string[]> {
    if (this.globResults.has(pattern)) {
      return this.globResults.get(pattern)!;
    }
    return [];
  }
  
  getRelativePath(from: string, to: string): string {
    // Simple implementation for testing
    return to.replace(from + '/', '');
  }
  
  joinPaths(...paths: string[]): string {
    return paths.join('/');
  }
}