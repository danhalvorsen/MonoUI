import * as path from 'path';
import * as glob from 'glob';

/**
 * In-memory file system for testing
 */
export class InMemoryFileSystem {
  private files: Map<string, string> = new Map();
  private directories: Set<string> = new Set();
  
  /**
   * Creates a new directory
   * @param dirPath Directory path
   */
  createDirectory(dirPath: string): void {
    // Normalize path
    dirPath = this.normalizePath(dirPath);
    
    // Add directory
    this.directories.add(dirPath);
    
    // Create parent directories if they don't exist
    const parentDir = path.dirname(dirPath);
    if (parentDir !== dirPath) { // Avoid infinite recursion at root
      this.createDirectory(parentDir);
    }
  }
  
  /**
   * Checks if a file or directory exists
   * @param filePath File or directory path
   * @returns True if exists
   */
  exists(filePath: string): boolean {
    filePath = this.normalizePath(filePath);
    return this.files.has(filePath) || this.directories.has(filePath);
  }
  
  /**
   * Writes a file
   * @param filePath File path
   * @param content File content
   */
  writeFile(filePath: string, content: string): void {
    filePath = this.normalizePath(filePath);
    
    // Create parent directory if it doesn't exist
    const dirPath = path.dirname(filePath);
    this.createDirectory(dirPath);
    
    // Write file
    this.files.set(filePath, content);
  }
  
  /**
   * Reads a file
   * @param filePath File path
   * @returns File content
   */
  readFile(filePath: string): string {
    filePath = this.normalizePath(filePath);
    
    if (!this.files.has(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    return this.files.get(filePath)!;
  }
  
  /**
   * Deletes a file
   * @param filePath File path
   */
  deleteFile(filePath: string): void {
    filePath = this.normalizePath(filePath);
    this.files.delete(filePath);
  }
  
  /**
   * Deletes a directory
   * @param dirPath Directory path
   */
  deleteDirectory(dirPath: string): void {
    dirPath = this.normalizePath(dirPath);
    
    // Delete directory
    this.directories.delete(dirPath);
    
    // Delete all files and subdirectories
    const prefix = dirPath + '/';
    
    // Delete files in directory
    for (const filePath of this.files.keys()) {
      if (filePath === dirPath || filePath.startsWith(prefix)) {
        this.files.delete(filePath);
      }
    }
    
    // Delete subdirectories
    for (const subDir of this.directories) {
      if (subDir === dirPath || subDir.startsWith(prefix)) {
        this.directories.delete(subDir);
      }
    }
  }
  
  /**
   * Lists files matching a glob pattern
   * @param pattern Glob pattern
   * @returns Array of file paths
   */
  findFiles(pattern: string): string[] {
    const matches: string[] = [];
    const regex = this.globToRegex(pattern);
    
    for (const filePath of this.files.keys()) {
      if (regex.test(filePath)) {
        matches.push(filePath);
      }
    }
    
    return matches;
  }
  
  /**
   * Converts a glob pattern to a regular expression
   * @param pattern Glob pattern
   * @returns Regular expression
   */
  private globToRegex(pattern: string): RegExp {
    // Convert glob pattern to regex
    // This is a simplified version, in real usage you might want to use a library
    const normalizedPattern = this.normalizePath(pattern);
    
    // Replace glob special characters with regex equivalents
    let regexStr = '^' + normalizedPattern
      .replace(/\./g, '\\.')
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]*')
      .replace(/\?/g, '[^/]')
      + '$';
      
    return new RegExp(regexStr);
  }
  
  /**
   * Normalizes a path
   * @param filePath Path to normalize
   * @returns Normalized path
   */
  private normalizePath(filePath: string): string {
    // Convert backslashes to forward slashes
    return filePath.replace(/\\/g, '/');
  }
}