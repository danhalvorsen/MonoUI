import { IVector } from './IVector';

export interface ILine<T extends IVector<T>> {
  A: T;
  B: T;

  direction(): T;
  length(): number;
  getPoint(t: number): T;
  closestPointTo(point: T): T;
}
