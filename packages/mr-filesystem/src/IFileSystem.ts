
export interface IFileSystem  {
  readFileSync(path: string, encoding?: string): string;
  writeFileSync(path: string, data: string): void;
  readdirSync(path: string, opts?: any): any[];
  existsSync(path: string): boolean;
  unlinkSync(path: string): void;
  // Add more fs-like methods as needed
}
