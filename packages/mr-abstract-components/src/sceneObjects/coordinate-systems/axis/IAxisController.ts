import { ISystemController } from "../../abstractions/ISystemController.js";
import { IVisualAxisConfiguration } from "./IVisualAxisConfiguration.js";
import { IVisualObject } from "../../abstractions/core/IVisualObject.js";

export interface IAxisController extends ISystemController {
    configuration: IVisualAxisConfiguration;
    axis: IVisualObject;
    
}
