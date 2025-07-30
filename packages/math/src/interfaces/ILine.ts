import { IVector } from './IVector.js';

export interface ILine<T extends IVector<T>> {
  A: T;
  B: T;

  direction(): T;
  length(): number;
  getPoint(t: number): T;
  closestPointTo(point: T): T;
  /**
   * Returns the intersection point with another segment, or null if none.
   */
  intersect(other: ILine<T>): T | null;
}
