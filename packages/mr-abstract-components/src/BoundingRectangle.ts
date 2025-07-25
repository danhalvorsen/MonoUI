import { Rect, Vector2, rectEdges } from "./IPhysicObject.js";
import { IBoundingShape } from "./IBoundingShape.js";

/** Axis‑aligned bounding rectangle. */

export class BoundingRectangle implements IBoundingShape {
  constructor(private readonly bounds: Rect) { }

  reflectIfCollide(moving: Rect, velocity: Vector2): Vector2 {
    const m = rectEdges(moving);
    const e = rectEdges(this.bounds);

    const hit = m.left < e.left || m.top < e.top || m.right > e.right || m.bottom > e.bottom;

    // Rotate by π  (i.e., invert both components) on collision
    return hit ? { x: -velocity.x, y: -velocity.y } : velocity;
  }
}
