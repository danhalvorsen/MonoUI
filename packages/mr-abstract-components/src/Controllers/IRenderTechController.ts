import { IReactiveController } from "./IReactiveController.js";
import { IRenderType } from "../abstractions/world/IRenderType.js";

/**
 * A controller that depends on the rendering backend (RenderTech).
 * Example: Picking, raycasting, render-pipeline effects.
 */
export interface IRenderTechController extends IReactiveController {
  /** Called when this controller is attached to a SceneHost with a specific RenderType */
  attachToRenderTech(renderType: IRenderType): void;
}
