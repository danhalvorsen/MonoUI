import { Vector3 } from "../implementations/Vector3";
import { IMatrix} from './IMatrix';
 
import { Vector2 } from './IPoint';

export interface ITransform {
  translate(offset: Vector2 | Vector3): this;
  rotate(angleInRadians: number): this;
  scale(sx: number, sy: number): this;

  setFrom(matrix: IMatrix): this;
  getMatrix(): IMatrix;
}
