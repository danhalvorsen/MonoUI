 
import type { IRenderContext } from "../core/IRenderContext.js";
import type { IReactiveControllerHost } from "../controllers/ReactiveControllerHost.js";
import type { ICanvas } from "./ICanvas.js";
export interface ICanvasController {
  controllerHost: IReactiveControllerHost<any>;
  attachCanvas(canvas: ICanvas, rc: IRenderContext): void;
}