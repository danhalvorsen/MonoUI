import { IJsonIO } from './IJsonIO.js';
export declare class MockJsonIO implements IJsonIO {
    private store;
    readJson<T>(path: string): T;
    writeJson<T>(path: string, data: T): void;
    exists(path: string): boolean;
    preload<T>(path: string, data: T): void;
    get(path: string): string | undefined;
}
