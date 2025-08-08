// packages/virtual-filesystem/src/index.ts
export { IFileSystem, IMutableFileSystem } from "./Filesystem.js";
export { VirtualFileSystemBuilder } from "./VirtualFileSystemBuilder.js";
export { CodeFsImporter, type ImportOptions } from "./CodeFsImporter.js";
export { DefaultPathService, type IPathService } from "./IPathService.js";
export { DefaultGlobService } from "./glob/DefaultGlobService.js";
export { type IGlobService, type GlobOptions } from "./glob/IGlobService.js";
