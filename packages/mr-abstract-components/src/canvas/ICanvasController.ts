
import { ICartesianCoordinateController } from "src/coordinate-systems/ICartesianCoordinateController.js";
import { IVisualObjectConfiguration } from "src/core/configuration/IVisualObjectConfiguration.js";
import { ISystemController } from "src/ISystemController.js";
import { IDatastore } from "./../store/IDatastore.js";
 
export interface ICanvasController extends ISystemController {
  readonly context: CanvasRenderingContext2D;
  coordinateSystem: ICartesianCoordinateController;
  store: IDatastore;
  visualConfig: IVisualObjectConfiguration;
}
