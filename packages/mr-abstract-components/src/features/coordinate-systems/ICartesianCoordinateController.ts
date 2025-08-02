import type { ISystemController } from "../abstractions/ISystemController.js";
import type { ICartesianCoordinateControllerConfiguration } from "./ICartesianCoordinateControllerConfiguration.js";
import { IAxisController } from "./axis/IAxisController.js";
import type { IVisualAxis } from "./axis/IVisualAxis.js";
import { IGridController } from "./grid/IGridController.js";
import type { IGridFeature } from "./grid/IVisualGrid.js";
import { ISnapController } from "./snap/ISnapController.js";
import type { ISnapFeature } from "./snap/IVisualSnap.js";

//Controller is the mother of the object where an object can have visual objects and other objects in a composistion
//
export interface ICartesianCoordinateController extends ISystemController {
    configuration: ICartesianCoordinateControllerConfiguration;
    xAxis: IAxisController;
    yAxis: IAxisController;
    gridObject: IGridController;
    snapFeature: ISnapController;
}
