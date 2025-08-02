export interface IFileOperation {
  read(path: string): string;
  write(path: string, content: string): void;
  exists(path: string): boolean;
}

