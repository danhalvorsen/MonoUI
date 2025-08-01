import { Vector2 } from "@my-graphics/math";


export interface IPhysicObjectConfiguration {
  mass: number;
}

export interface IPhysicObject {
  configuration : IPhysicObjectConfiguration;
  readonly dimension:  Vector2;
  get mass(): number;
  set mass(value: number);
  get position(): Vector2;
  set position(value: Vector2);
  get velocity(): Vector2;
  set velocity(value: Vector2);
  get acceleration(): Vector2;
  set acceleration(value: Vector2);
  get width(): number;
  set width(value: number);
  get height(): number;
  set height(value: number);
  get direction(): Vector2;
  get Width(): number;
  set Width(value: number);
  get Height(): number;
  set Height(value: number);
  get Position(): Vector2;
  set Position(value: Vector2);
  get Velocity(): Vector2;
  set Velocity(value: Vector2);
  get Dimension(): Vector2;
  
  update(dt: number): void;
}

 
