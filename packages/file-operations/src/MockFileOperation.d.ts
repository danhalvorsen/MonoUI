import { IFileOperation } from './IFileOperation';
export declare class MockFileOperation implements IFileOperation {
    private files;
    read(path: string): string;
    write(path: string, content: string): void;
    exists(path: string): boolean;
    preload(path: string, content: string): void;
}
