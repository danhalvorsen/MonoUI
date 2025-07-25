import { Rect, Vector2 } from "./IPhysicObject.js";
import { IBoundingShape } from "./IBoundingShape.js";
/** Axis‑aligned bounding rectangle. */
export declare class BoundingRectangle implements IBoundingShape {
    private readonly bounds;
    constructor(bounds: Rect);
    reflectIfCollide(moving: Rect, velocity: Vector2): Vector2;
}
