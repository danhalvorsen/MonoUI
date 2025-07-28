import { IVector } from './IVector';
import { ILine } from './ILine';

/**
 * A polygonal mesh consisting of closed loops.
 */
export interface IMesh<T extends IVector<T>> {
  /** array of vertex cycles */
  polygons: T[][];
  /** matching edges for each cycle */
  edges: ILine<T>[][];

  union(other: IMesh<T>): IMesh<T>;
  intersect(other: IMesh<T>): IMesh<T>;
  subtract(other: IMesh<T>): IMesh<T>;
}
