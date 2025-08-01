import { IAxisConfiguration } from "./IAxisConfiguration.js";
import { IVisualAxis } from "./IVisualAxis.js";
import { IController } from "../IController.js";

export interface IAxisController extends IController {
    configuration: IAxisConfiguration;
    axis: IVisualAxis;
    
}
