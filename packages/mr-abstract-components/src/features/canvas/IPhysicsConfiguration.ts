import { Vector2 } from "@my-graphics/math";

export interface IPhysicsConfiguration {
  position: Vector2;
  dimension: Vector2;
  mass?: number;
  velocity?: Vector2;
  acceleration?: Vector2;
  direction?: Vector2;
  hasPhysics?: boolean;
  isStatic?: boolean;
  hasCollision?: boolean;
  boundingType?: 'rectangle' | 'circle' | 'polygon' | 'custom';
}
