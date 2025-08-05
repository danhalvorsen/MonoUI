export { Vector2 } from './implementations/Vector2.js';
export { Vector3 } from './implementations/Vector3.js';
export { Matrix3 } from './implementations/Matrix3.js';
export { Matrix as Matrix4 } from './implementations/Matrix4.js';
export { Transform as ImplTransform } from './implementations/Transform.js';
export { Transform as Transformer } from './implementations/Transform.js';

export { BoundingBox2D } from './implementations/BoundingBox.js';
export { Line } from './implementations/Line.js';
 
export { Rectangle } from './implementations/Rectangle.js';

export { LinearInterpolator3D } from './interpolation/LinearInterpolator3D.js';
export { CatmullRomSpline3D } from './interpolation/CatmullRomSpline3D.js';
export { SplineInterpolator3D } from './interpolation/SplineInterpolator3D.js';

export type { IMatrix } from './interfaces/IMatrix.js';
export type { IVector } from './interfaces/IVector.js';
export type { ILine } from './interfaces/ILine.js';
export type { IBoundingBox } from './interfaces/IBoundingBox.js';
export type { IInterpolator } from './interfaces/IInterpolator.js';
export type { ISpline } from './interpolation/ISpline.js';
export type { ITransform } from './interfaces/ITransform.js';
export type { IMesh } from './interfaces/IMesh.js';
export type { IRectangle } from './interfaces/IRectangle.js';
export type {
  Point2,
  Point3,
  Vector2 as IPoint2,
  Vector3 as IPoint3
} from './interfaces/IPoint.js';