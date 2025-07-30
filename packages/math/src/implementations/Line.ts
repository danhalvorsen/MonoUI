import { ILine } from "../interfaces/ILine.js";
import { IVector } from "../interfaces/IVector.js";

export class Line<T extends IVector<T>> implements ILine<T>{
  constructor(
    public A: T,
    public B: T
  ) {}

  direction(): T {
    return this.B.subtract(this.A).normalize();
  }

  length(): number {
    return this.A.distanceTo(this.B);
  }

  getPoint(t: number): T {
    return this.A.lerp(this.B, t);
  }

  closestPointTo(point: T): T {
    const AB = this.B.subtract(this.A);
    const AP = point.subtract(this.A);
    const abLengthSquared = AB.dot(AB);

    if (abLengthSquared === 0) return this.A.clone(); // Line is a point

    const t = AP.dot(AB) / abLengthSquared;
    const clampedT = Math.max(0, Math.min(1, t));
    return this.getPoint(clampedT);
  }

  intersect(other: ILine<T>): T | null {
    const p = this.A, r = this.B.subtract(this.A);
    const q = other.A, s = other.B.subtract(other.A);
    const rxs = r.cross(s), q_p = q.subtract(p);
    if (rxs.z === 0) return null;
    const t = q_p.cross(s).z / rxs.z;
    const u = q_p.cross(r).z / rxs.z;
    return (t>=0 && t<=1 && u>=0 && u<=1) ? this.getPoint(t) : null;
  }
}
