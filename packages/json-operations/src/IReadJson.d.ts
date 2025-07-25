export interface IReadJson {
    readJson<T = unknown>(path: string): T;
    exists(path: string): boolean;
}
