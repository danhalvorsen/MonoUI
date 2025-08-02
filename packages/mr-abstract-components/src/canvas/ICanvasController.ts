import { ISystemController } from "../features/abstractions/ISystemController.js";
import { ICartesianCoordinateController } from "../features/coordinate-systems/ICartesianCoordinateController.js";
import { IDatastore } from "../store/IDatastore.js";

export interface ICanvasController extends ISystemController {
  readonly context: CanvasRenderingContext2D;
  coordinateSystem: ICartesianCoordinateController;
  store: IDatastore
}

export interface ISystemControllerStore {
  add(obj: ISystemController): void;
  remove(obj: ISystemController): void;
  clear(): void;
}
