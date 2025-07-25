import { IFileOperation } from './IFileOperation';
export declare class NodeFileOperation implements IFileOperation {
    read(path: string): string;
    write(path: string, content: string): void;
    exists(path: string): boolean;
}
