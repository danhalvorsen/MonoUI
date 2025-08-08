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
  relative(from: string, to: string): string;

  /**
   * @deprecated Use `relative(from, to)` instead.
   * Kept for backward compatibility.
   */
  releativePath(from: string, to: string): string;

  join(...paths: string[]): string;
  dirname(path: string): string;
  basename(path: string): string;
  extname(path: string): string;
  resolve(...paths: string[]): string;
  normalize(path: string): string;
}
