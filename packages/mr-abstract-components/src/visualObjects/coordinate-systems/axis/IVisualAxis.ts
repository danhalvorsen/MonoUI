import { IVisualObject, IVisualAxisConfiguration } from "src/index.js";

export interface IVisualAxis extends IVisualObject {
    configuration: IVisualAxisConfiguration;
    render(context: CanvasRenderingContext2D): void;
}
