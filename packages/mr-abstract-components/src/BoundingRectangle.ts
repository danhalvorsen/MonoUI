import { Rectangle, Vector2 } from "@my-graphics/math";
import { IBoundingShape } from "./IBoundingShape.js";

/** Axis‑aligned bounding rectangle. */

export class BoundingRectangle implements IBoundingShape {
  constructor(private readonly bounds: Rectangle) { }

  reflectIfCollide(moving: Rectangle, velocity: Vector2): Vector2 {
    // Check if moving rectangle is outside the bounds
    // Rectangle vertices: [bottom-left, bottom-right, top-right, top-left]
    const movingLeft = moving.vertices[0].x;
    const movingBottom = moving.vertices[0].y;
    const movingRight = moving.vertices[2].x;
    const movingTop = moving.vertices[2].y;
    
    const boundsLeft = this.bounds.vertices[0].x;
    const boundsBottom = this.bounds.vertices[0].y;
    const boundsRight = this.bounds.vertices[2].x;
    const boundsTop = this.bounds.vertices[2].y;

    const hit = movingLeft < boundsLeft || 
                movingBottom < boundsBottom || 
                movingRight > boundsRight ||
                movingTop > boundsTop;

    // Rotate by π  (i.e., invert both components) on collision
    return hit ? new Vector2(-velocity.x, -velocity.y) : velocity;
  }
}
