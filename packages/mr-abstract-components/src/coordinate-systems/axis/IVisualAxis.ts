
import {IVisualObject} from "./../../abstractions/IVisualObject.js";
import { IVisualAxisConfiguration } from "./IVisualAxisConfiguration.js";
 

export interface IVisualAxis extends IVisualObject {
    configuration: IVisualAxisConfiguration;
    render(context: CanvasRenderingContext2D): void;
}
