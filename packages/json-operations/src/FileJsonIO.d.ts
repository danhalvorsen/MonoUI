import type { IJsonIO } from './IJsonIO.js';
export declare class FileJsonIO implements IJsonIO {
    readJson<T = unknown>(path: string): T;
    writeJson<T>(path: string, data: T): void;
    exists(path: string): boolean;
}
