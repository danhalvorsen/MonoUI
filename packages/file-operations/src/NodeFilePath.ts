import { existsSync, statSync } from 'fs';
import { relative, join, dirname, basename, extname, resolve, normalize } from 'path';
import { IFilePath } from './IFilePath.js';

/**
 * Node.js implementation of IFilePath interface
 */
export class NodeFilePath implements IFilePath {
  /**
   * Checks if a path exists in the filesystem
   * @param path - The path to check
   * @returns True if the path exists, false otherwise
   */
  exists(path: string): boolean {
    return existsSync(path);
  }

  /**
   * Checks if a path is a directory
   * @param path - The path to check
   * @returns True if the path is a directory, false otherwise
   */
  isDirectory(path: string): boolean {
    try {
      return this.exists(path) && statSync(path).isDirectory();
    } catch (error) {
      return false;
    }
  }

  /**
   * Calculates the relative path from one path to another
   * @param from - The source path
   * @param to - The target path
   * @returns The relative path from source to target
   */
  releativePath(from: string, to: string): string {
    return relative(from, to);
  }

  /**
   * Joins multiple path segments into one path
   * @param paths - The path segments to join
   * @returns The joined path
   */
  join(...paths: string[]): string {
    return join(...paths);
  }

  /**
   * Gets the directory name of a path
   * @param path - The path to process
   * @returns The directory name
   */
  dirname(path: string): string {
    return dirname(path);
  }

  /**
   * Gets the base name (file name with extension) of a path
   * @param path - The path to process
   * @returns The base name
   */
  basename(path: string): string {
    return basename(path);
  }

  /**
   * Gets the extension of a path
   * @param path - The path to process
   * @returns The extension
   */
  extname(path: string): string {
    return extname(path);
  }

  /**
   * Resolves a sequence of paths to an absolute path
   * @param paths - The path segments to resolve
   * @returns The resolved absolute path
   */
  resolve(...paths: string[]): string {
    return resolve(...paths);
  }

  /**
   * Normalizes a path, resolving '..' and '.' segments
   * @param path - The path to normalize
   * @returns The normalized path
   */
  normalize(path: string): string {
    return normalize(path);
  }
}