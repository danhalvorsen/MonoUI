import { ICartesianCoordinateController, IDatastore, ISystemController, IVisualObjectConfiguration } from "src/index.js";
export interface ICanvasController extends ISystemController {
  readonly context: CanvasRenderingContext2D;
  coordinateSystem: ICartesianCoordinateController;
  store: IDatastore;
  visualConfig: IVisualObjectConfiguration;
}
