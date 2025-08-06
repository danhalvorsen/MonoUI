import { ISystemController } from "../abstractions/ISystemController.js";
import { IAxisController } from "./axis/IAxisController.js";
import { IGridController } from "./grid/IGridController.js";
import { ICartesianCoordinateControllerConfiguration } from "./ICartesianCoordinateControllerConfiguration.js";
import { ISnapController } from "./snap/ISnapController.js";

export interface ICartesianCoordinateController extends ISystemController {
    configuration: ICartesianCoordinateControllerConfiguration;
    xAxis: IAxisController;
    yAxis: IAxisController;
    gridObject: IGridController;
    snapFeature: ISnapController;
}
