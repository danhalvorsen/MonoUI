import { IAxisConfiguration } from "./IAxisConfiguration.js";
import { IVisualAxis } from "./IVisualAxis.js";
import { ISystemController } from "../features/abstractions/ISystemController.js";

export interface IAxisController extends ISystemController {
    configuration: IAxisConfiguration;
    axis: IVisualAxis;
    
}
