export interface IFileSystem {
    readonly files: ReadonlyMap<string, string>;
    readonly directories: ReadonlySet<string>;
}
export interface IMutableFileSystem extends IFileSystem {
    files: Map<string, string>;
    directories: Set<string>;
}
