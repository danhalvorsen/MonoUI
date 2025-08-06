import { ISystemController } from "./../abstractions/ISystemController.js";
import { IVisualObjectConfiguration } from "./../abstractions/IVisualObjectConfiguration.js";
import { ICartesianCoordinateController } from "./../coordinate-systems/ICartesianCoordinateController.js";
import { IDatastore } from "./../store/IDatastore.js";
 
export interface ICanvasController extends ISystemController {
  readonly context: CanvasRenderingContext2D;
  coordinateSystem: ICartesianCoordinateController;
  store: IDatastore;
  visualConfig: IVisualObjectConfiguration;
}
