import { Vector2 } from "@my-graphics/math";
import { IVisualObject } from "../../core/IVisualObject.js";
export type PickingMode = "topmost" | "first" | "all";

export interface PickingOptions {
  /** How to resolve hits */
  mode?: PickingMode;
  /** Additional filter for pickable objects */
  filter?: (obj: IVisualObject) => boolean;
  /** Include objects with enabled === false */
  includeDisabled?: boolean;
  /** Pixel radius tolerance for hit-testing */
  tolerance?: number;
}
export interface PickHit {
  object: IVisualObject;
  /** Screen-space test point */
  point: Vector2;
  /** Optional distance/depth (for sorting) */
  distance?: number;
}



