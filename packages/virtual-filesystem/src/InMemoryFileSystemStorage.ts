 
// Add import or definition for IFileSystemStorage and IMutableFileSystem
// Example definition (replace with actual interface if available)
export interface IFileSystemStorage {
    create(): IMutableFileSystem;
}

export interface IMutableFileSystem {
    files: Map<string, string>;
    directories: Set<string>;
}

export class InMemoryFileSystemStorage implements IFileSystemStorage {
    create(): IMutableFileSystem {
        return {
            files: new Map<string, string>(),
            directories: new Set<string>()
        };
    }
}
