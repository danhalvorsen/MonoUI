/**
 * Lightweight physics & bounding utilities – SOLID, DRY, Open‑closed.
 * Updated: BoundingRectangle now accepts a Rect in its constructor instead of separate x/y/width/height
 */
 
import { IPhysicObject, Vector2, normalize, add, mul } from "./IPhysicObject.js";
import { injectable } from "tsyringe";

@injectable()
export class PhysicObject implements IPhysicObject {
  constructor(
    public readonly mass: number = 1.0,
    private _position: Vector2,
    private _velocity: Vector2 = { x: 0, y: 0 },
    private _acceleration: Vector2 = { x: 0, y: 0 }
  ) {
    if (mass <= 0) throw new Error("Mass must be positive");
  }

  get position(): Vector2 { return this._position; }
  get velocity(): Vector2 { return this._velocity; }
  get acceleration(): Vector2 { return this._acceleration; }
  set acceleration(a: Vector2) { this._acceleration = a; }

  get direction(): Vector2 { return normalize(this._velocity); }

  update(dt: number): void {
    if (dt <= 0 || !Number.isFinite(dt)) return;
    this._velocity = add(this._velocity, mul(this._acceleration, dt));
    this._position = add(this._position, mul(this._velocity, dt));
  }

  protected setVelocity(v: Vector2): void { this._velocity = v; }
}
