/**
 * Lightweight physics & bounding utilities – SOLID, DRY, Open‑closed.
 * Updated: BoundingRectangle now accepts a Rect in its constructor instead of separate x/y/width/height
 */
import { IPhysicObject, Vector2 } from "./IPhysicObject.js";
export declare class PhysicObject implements IPhysicObject {
    readonly mass: number;
    private _position;
    private _velocity;
    private _acceleration;
    constructor(mass: number | undefined, _position: Vector2, _velocity?: Vector2, _acceleration?: Vector2);
    get position(): Vector2;
    get velocity(): Vector2;
    get acceleration(): Vector2;
    set acceleration(a: Vector2);
    get direction(): Vector2;
    update(dt: number): void;
    protected setVelocity(v: Vector2): void;
}
