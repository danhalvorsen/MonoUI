export interface Vector2 {
    readonly x: number;
    readonly y: number;
}

  export const add = (a: Vector2, b: Vector2): Vector2 => ({ x: a.x + b.x, y: a.y + b.y });
  export const mul = (v: Vector2, scalar: number): Vector2 => ({ x: v.x * scalar, y: v.y * scalar });
  export const magnitude = (v: Vector2): number => Math.hypot(v.x, v.y);
  export const normalize = (v: Vector2): Vector2 => {
    const mag = magnitude(v);
    return mag === 0 ? { x: 0, y: 0 } : { x: v.x / mag, y: v.y / mag };
  };