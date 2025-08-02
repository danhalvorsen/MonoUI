// src/physics/PhysicObject.ts
import { Vector2 } from '@my-graphics/math';
import type { IPhysicObject } from 'mr-abstract-components';

export class PhysicObject implements IPhysicObject {
  readonly position: Vector2;
  readonly size: { width: number; height: number };

  constructor(
    x: number = 0,
    y: number = 0,
    width: number = 0,
    height: number = 0
  ) {
    this.position = new Vector2(x, y);
    this.size = { width, height };
  }
  get direction(): Vector2 {
    throw new Error('Method not implemented.');
  }
  get Posistion(): Vector2 {
    throw new Error('Method not implemented.');
  }
  get Velocity(): Vector2 {
    throw new Error('Method not implemented.');
  }
  get Dimension(): Vector2 {
    throw new Error('Method not implemented.');
  }
  mass: number;
  velocity: Vector2;
  acceleration: Vector2;
  width: number;
  height: number;
  get Direction(): Vector2 {
    throw new Error('Method not implemented.');
  }
  get Width(): number {
    throw new Error('Method not implemented.');
  }
  get Height(): number {
    throw new Error('Method not implemented.');
  }
  update(dt: number): void {
    throw new Error('Method not implemented.');
  }

  setPosition(x: number, y: number): void {
    this.position.x = x;
    this.position.y = y;
  }

  setSize(width: number, height: number): void {
    this.size.width = width;
    this.size.height = height;
  }

  moveBy(dx: number, dy: number): void {
    this.position.x += dx;
    this.position.y += dy;
  }
}
