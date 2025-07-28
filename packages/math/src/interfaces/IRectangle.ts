import { IVector } from './IVector';
import { ILine } from './ILine';
import { IMesh } from './IMesh';

export interface IRectangle<T extends IVector<T>> {
  vertices: [T,T,T,T];
  edges: [ILine<T>,ILine<T>,ILine<T>,ILine<T>];

  contains(point: T, tolerance?: number): boolean;
  intersects(other: IRectangle<T>, tolerance?: number): boolean;
  union(other: IRectangle<T>): IRectangle<T>;
  intersectionRect(other: IRectangle<T>, tolerance?: number): IRectangle<T> | null;
  subtract(other: IRectangle<T>): IMesh<T>;
}
