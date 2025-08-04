import { IFileSystem } from "./Filesystem.js";

export interface IVirtualFileSystemFactory {
    create(): IFileSystem;
}