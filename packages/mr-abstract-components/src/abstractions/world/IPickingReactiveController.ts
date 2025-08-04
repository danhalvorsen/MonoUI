
import { IReactiveController, IVisualObject } from "src/index.js";

export interface IPickingReactiveController extends IReactiveController {
  /**
   * Pick the topmost object at screen coordinates.
   */
  pick(x: number, y: number): IVisualObject | undefined;

  /**
   * Pick all objects at screen coordinates.
   */
  pickAll?(x: number, y: number): IVisualObject[];
}
