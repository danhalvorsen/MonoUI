import { IAxisController, ISystemController, IGridController, ISnapController, ICartesianCoordinateControllerConfiguration} from "src/index.js";

//Controller is the mother of the object where an object can have visual objects and other objects in a composistion
//
export interface ICartesianCoordinateController extends ISystemController {
    configuration: ICartesianCoordinateControllerConfiguration;
    xAxis: IAxisController;
    yAxis: IAxisController;
    gridObject: IGridController;
    snapFeature: ISnapController;
}
