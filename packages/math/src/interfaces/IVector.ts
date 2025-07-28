export interface IVector<T> {
  x: number;
  y: number;
  z: number;

  add(v: T): T;
  subtract(v: T): T;

  /**
   * Multiply this vector uniformly by a scalar.
   */
  scale(scalar: number): T;

  dot(v: T): number;
  length(): number;
  normalize(): T;
  clone(): T;
  cross(v: T): T;
  transform(matrix: Float32Array | number[]): T;

  angleTo(v: T): number;
  projectOnto(v: T): T;
  reflect(normal: T): T;
  lerp(v: T, t: number): T;

  distanceTo(v: T): number;
  equals(v: T, tolerance?: number): boolean;
  toArray(): number[];

  /**
   * @deprecated use scale(...) instead
   */
  multiplyScalar(scalar: number): T;
}
