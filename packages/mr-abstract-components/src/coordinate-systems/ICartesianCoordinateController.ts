import type { IController } from "../IController.js";
import type { ICartesianCoordinateControllerConfiguration } from "./ICartesianCoordinateControllerConfiguration.js";
import type { IVisualAxis } from "./IVisualAxis.js";
import type { IGridFeature } from "./IVisualGrid.js";
import type { ISnapFeature } from "./IVisualSnap.js";


//Controller is the mother of the object where an object can have visual objects and other objects in a composistion
//
export interface ICartesianCoordinateController extends IController {
    configuration: ICartesianCoordinateControllerConfiguration;
    xAxis: IVisualAxis;
    yAxis: IVisualAxis;
    gridObject: IGridFeature;
    snapFeature: ISnapFeature;
}
