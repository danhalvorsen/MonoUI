export interface IChangedProperties {
    hasChanged(key: string): boolean;
    get<T = any>(key: string): T | undefined;
    set<T = any>(key: string, value: T): void;
    keys(): string[];
  }
  