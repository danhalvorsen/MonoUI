import { Rectangle, Vector2 } from "@my-graphics/math";

/** Contract for a shape able to reflect a moving rectangle. */

export interface IBoundingShape {
  /** If *moving* collides with this shape, return the velocity rotated by π; otherwise return *velocity* untouched. */
  reflectIfCollide(moving: Rectangle, velocity: Vector2): Vector2;
}
