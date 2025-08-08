export type SymbolExport = {
  symbol: string;
  filePath: string; // absolute
  isDefault: boolean;
};

export type FixOptions = {
  root: string;          // absolute cwd of project or subfolder
  write: boolean;        // actually write or just preview
  addJsExtension: boolean; // for NodeNext/nodenext builds
  include: string[];     // globs
  exclude: string[];     // globs
};
