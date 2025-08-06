import { IChangedProperties } from './IChangedProperties.js';

export abstract class ChangedProperties implements IChangedProperties {
  protected changes = new Map<string, any>();

  hasChanged(key: string): boolean {
    return this.changes.has(key);
  }

  get<T = any>(key: string): T | undefined {
    return this.changes.get(key);
  }

  set<T = any>(key: string, value: T): void {
    this.changes.set(key, value);
  }

  keys(): string[] {
    return Array.from(this.changes.keys());
  }

  /** For enkel reset mellom render-sykluser */
  clear(): void {
    this.changes.clear();
  }
}
