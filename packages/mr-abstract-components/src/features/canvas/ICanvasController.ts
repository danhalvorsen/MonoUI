// Update the import path if the file is located elsewhere, for example:
import { IDatastore } from "../../store/IDatastore.js";
import { ISystemController } from "../abstractions/ISystemController.js";
import { ICartesianCoordinateController } from "../coordinate-systems/ICartesianCoordinateController.js";

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
