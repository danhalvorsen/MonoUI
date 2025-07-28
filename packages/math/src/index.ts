export { Vector2 } from './implementations/Vector2';
export { Vector3 } from './implementations/Vector3';
export { Matrix } from './implementations/Matrix4';
export { Transform as ImplTransform } from './implementations/Transform';
export { Transform as Transformer } from './implementations/Transform';

export { BoundingBox2D } from './implementations/BoundingBox';
export { Line } from './implementations/Line';

export { LinearInterpolator3D } from './interpolation/LinearInterpolator3D';
export { CatmullRomSpline3D } from './interpolation/CatmullRomSpline3D';
export { SplineInterpolator3D } from './interpolation/SplineInterpolator3D';

export type { IMatrix } from './interfaces/IMatrix';
export type { IVector } from './interfaces/IVector';
export type { ILine } from './interfaces/ILine';
export type { IBoundingBox } from './interfaces/IBoundingBox';
export type { IInterpolator } from './interfaces/IInterpolator';
export type { ISpline } from './interpolation/ISpline';
export type { ITransform } from './interfaces/ITransform';
export type {
  Point2,
  Point3,
  Vector2 as IPoint2,
  Vector3 as IPoint3
} from './interfaces/IPoint';