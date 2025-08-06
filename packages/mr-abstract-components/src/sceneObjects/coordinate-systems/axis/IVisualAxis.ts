
import {IVisualObject} from "../../abstractions/core/IVisualObject.js";
import { IVisualAxisConfiguration } from "./IVisualAxisConfiguration.js";
 

export interface IVisualAxis extends IVisualObject {
    configuration: IVisualAxisConfiguration;
    render(context: CanvasRenderingContext2D): void;
}
