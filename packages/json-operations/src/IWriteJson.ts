export interface IWriteJson {
  writeJson<T = unknown>(path: string, data: T): void;
}
