/**
 * Lightweight physics & bounding utilities – SOLID, DRY, Open‑closed.
 * Updated: BoundingRectangle now accepts a Rect in its constructor instead of separate x/y/width/height
 */
 
import { Rectangle, Vector2 } from "@my-graphics/math";
import { IPhysicObject } from "./IPhysicObject.js";
 

export class PhysicObject implements IPhysicObject {
  public _position: Vector2;
  public _velocity: Vector2;
  public _acceleration: Vector2;
  public mass: number = 1;
  public boundardRectangle: Rectangle = new Rectangle(new Vector2(0, 0), new Vector2(0, 0));

  constructor(
    position: Vector2,
    velocity: Vector2,
    acceleration: Vector2,
    width: number,
    height: number
  ) {
  
    this._position = position;
    this._velocity = velocity;
    this._acceleration = acceleration;
    this.boundardRectangle = new Rectangle(new Vector2(0, 0), new Vector2(width, height));
  }

  get position(): Vector2 { return this._position; }
  get velocity(): Vector2 { return this._velocity; }
  get acceleration(): Vector2 { return this._acceleration; }
  set acceleration(a: Vector2) { this._acceleration = a; }

  get direction(): Vector2 { return this._velocity.normalize(); }

  get width(): number { return this.boundardRectangle.width; }
  get height(): number { return this.boundardRectangle.height; }  


  update(dt: number): void {
    if (dt <= 0 || !Number.isFinite(dt)) return;
    this._velocity = this._velocity.add(this._acceleration.scale(dt));
    this._position = this._position.add(this._velocity.scale(dt));
  }

  protected setVelocity(v: Vector2): void { this._velocity = v; }
}
