import { IPath } from "./IPath.js";

// File abstraction
export interface IFile extends IPath {
  read(encoding?: string): string;
  write(data: string): void;
  delete(): void;
  exists(): boolean;
  isAbsolute(): boolean;
  isRelative(): boolean;
  toAbsolute(base?: string | IPath): IPath;
  toRelative(base?: string | IPath): IPath;
}
