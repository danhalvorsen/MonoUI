
import { ISystemController, IVisualAxisConfiguration, IVisualObject } from "src/index.js";

export interface IAxisController extends ISystemController {
    configuration: IVisualAxisConfiguration;
    axis: IVisualObject;
    
}
