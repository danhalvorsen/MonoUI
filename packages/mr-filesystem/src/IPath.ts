// Path abstraction

export interface IPath {
  toString(): string;
  join(...segments: string[]): IPath;
  dirname(): IPath;
  basename(): string;
  extname(): string;
  isAbsolute(): boolean;
}
