import { ISystemController } from "../abstractions/ISystemController.js";
import { IVisualObject } from "../abstractions/IVisualObject.js";
import { ICartesianCoordinateController } from "../coordinate-systems/ICartesianCoordinateController.js";

export interface ICanvasController extends ISystemController {
  readonly context: CanvasRenderingContext2D;
  coordinateSystem: ICartesianCoordinateController;
  add(obj: IVisualObject): void;
  remove(obj: IVisualObject): void;
  clear(): void;
}
