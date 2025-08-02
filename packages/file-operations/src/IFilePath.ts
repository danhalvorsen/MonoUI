export interface IFilePath {
  /**
   * Checks if a path exists in the filesystem
   */
  exists(path: string): boolean;
  
  /**
   * Checks if a path is a directory
   */
  isDirectory(path: string): boolean;
  
  /**
   * Calculates the relative path from one path to another
   */
  releativePath(from: string, to: string): string;
  
  /**
   * Joins multiple path segments into one path
   */
  join(...paths: string[]): string;
  
  /**
   * Gets the directory name of a path
   */
  dirname(path: string): string;
  
  /**
   * Gets the base name (file name with extension) of a path
   */
  basename(path: string): string;
  
  /**
   * Gets the extension of a path
   */
  extname(path: string): string;
  
  /**
   * Resolves a sequence of paths to an absolute path
   */
  resolve(...paths: string[]): string;
  
  /**
   * Normalizes a path, resolving '..' and '.' segments
   */
  normalize(path: string): string;
}