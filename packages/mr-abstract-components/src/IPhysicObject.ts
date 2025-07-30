import { Vector2 } from "@my-graphics/math";

export interface IPhysicObject {
  mass: number;
  readonly position: Vector2;
  readonly velocity: Vector2;
  readonly acceleration: Vector2;
  
  get direction(): Vector2;
  get width(): number;
  get height(): number;
  update(dt: number): void;
}

 
