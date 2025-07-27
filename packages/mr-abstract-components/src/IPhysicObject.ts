
export interface Vector2 { readonly x: number; readonly y: number; }

export const add = (a: Vector2, b: Vector2): Vector2 => ({ x: a.x + b.x, y: a.y + b.y });
export const mul = (v: Vector2, s: number): Vector2 => ({ x: v.x * s, y: v.y * s });
export const magnitude = (v: Vector2): number => Math.hypot(v.x, v.y);
export const normalize = (v: Vector2): Vector2 => {
  const m = magnitude(v);
  return m === 0 ? { x: 0, y: 0 } : { x: v.x / m, y: v.y / m };
};

/* ---------------------------------------------------------------------
 *  PhysicObject
 * ------------------------------------------------------------------ */
export interface IPhysicObject {
  readonly mass: number;
  readonly position: Vector2;
  readonly velocity: Vector2;
  readonly acceleration: Vector2;
  get direction(): Vector2;
  update(dt: number): void;
}

/* ---------------------------------------------------------------------
 *  Geometry & Bounding
 * ------------------------------------------------------------------ */
export type Rect = Readonly<{ x: number; y: number; width: number; height: number }>;

export const rectEdges = (r: Rect) => ({
  left: r.x,
  top: r.y,
  right: r.x + r.width,
  bottom: r.y + r.height,
});

