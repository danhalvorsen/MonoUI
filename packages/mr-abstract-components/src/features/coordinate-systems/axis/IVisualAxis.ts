import type { IVisualObject } from "../canvas/IVisualObject.js";
import { IVisualAxisConfiguration } from "../IVisualAxisConfiguration.js";

export interface IVisualAxis extends IVisualObject {
    configuration: IVisualAxisConfiguration;
    render(context: CanvasRenderingContext2D): void;
}
