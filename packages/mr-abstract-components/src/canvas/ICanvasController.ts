import { IVisualObject } from "./IVisualObject.js";
import { ICartesianCoordinateController } from "../coordinate-systems/ICartesianCoordinateController.js";
import { IController } from "../IController.js";


export interface ICanvasController extends IController {
  readonly context: CanvasRenderingContext2D;
  coordinateSystem: ICartesianCoordinateController;
  add(obj: IVisualObject): void;
  remove(obj: IVisualObject): void;
  clear(): void;
}
