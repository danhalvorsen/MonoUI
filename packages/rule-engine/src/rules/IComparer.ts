import "reflect-metadata";
export interface IComparer<T> {
    compare(a: T, b: T): number;
  }

  export class DefaultComparer implements IComparer<any> {
    compare(a: any, b: any): number {
      if (a == null || b == null) throw new Error("Cannot compare null or undefined values");
      if (typeof a === "number" && typeof b === "number") return a - b;
      if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
      if (typeof a === "string" && typeof b === "string") return a.localeCompare(b);
      throw new Error(`Unsupported type for comparison: ${typeof a} vs ${typeof b}`);
    }
  }