export interface IFileOperations {
  /**
   * Joins path segments
   */
  joinPaths(base: string, ...segments: string[]): string;

  /**
   * Checks if a path exists
   * @param path The path to check
   * @returns A Promise resolving to true if the path exists, false otherwise
   */
  exists(path: string): Promise<boolean>;

  /**
   * Reads a file from disk
   * @param path The file path to read
   * @returns A Promise resolving to the file content as string
   */
  readFile(path: string): Promise<string>;

  /**
   * Writes content to a file
   * @param path The file path to write to
   * @param content The content to write
   */
  writeFile(path: string, content: string): Promise<void>;

  /**
   * Finds files matching a pattern
   * @param pattern The glob pattern to match
   * @param options Options for file matching
   * @returns A Promise resolving to an array of matching file paths
   */
  findFiles(pattern: string, options?: any): Promise<string[]>;

  /**
   * Gets the relative path from one path to another
   * @param from The base path
   * @param to The target path
   * @returns The relative path
   */
  getRelativePath(from: string, to: string): string;
}