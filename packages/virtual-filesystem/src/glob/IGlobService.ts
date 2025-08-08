// packages/virtual-filesystem/src/glob/IGlobService.ts
export interface GlobOptions {
  cwd: string;
  ignore: string[];
  absolute: boolean;
  followSymbolicLinks: boolean;
  onlyFiles?: boolean;
  onlyDirectories?: boolean;
}

export interface IGlobService {
  glob(patterns: string[] | string, options: GlobOptions): Promise<string[]>;
}
