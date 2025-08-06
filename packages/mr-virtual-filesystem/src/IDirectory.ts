import { IPath } from "./IPath.js";

// Directory abstraction

export interface IDirectory extends IPath {
  list(): IPath[];
  create(): void;
  delete(): void;
  exists(): boolean;
  isAbsolute(): boolean;
  isRelative(): boolean;
  toAbsolute(base?: string | IPath): IPath;
  toRelative(base?: string | IPath): IPath;
}
