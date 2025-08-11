import { IVisualObject } from "../../core/IVisualObject.js";
 
import { IReactiveControllerHost } from "../ReactiveControllerHost.js";
import { PickingOptions, PickHit } from "./IPickingReactiveController.js";




export interface IPickingReactiveController<THost> extends IReactiveControllerHost<THost> {
  /** Enable/disable picking globally */
  setEnabled(enabled: boolean): void;
  isEnabled(): boolean;

  /** Pick a single object at screen-space coords (x, y) */
  pick(x: number, y: number, options?: PickingOptions): IVisualObject | undefined;

  /** Pick all objects intersecting (x, y), sorted by stacking/depth if available */
  pickAll(x: number, y: number, options?: PickingOptions): PickHit[];
}
