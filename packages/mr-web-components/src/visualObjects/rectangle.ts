import { IVisualObject } from "mr-abstract-components";

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

export class Rectangle implements IVisualObject<CanvasRenderingContext2D> {
    public position: Vector2;
    public velocity: Vector2;

    constructor(
        public width: number,
        public height: number,
        public color: string,
        x: number = 0,
        y: number = 0,
        velocity: Vector2 = { x: 0, y: 0 }
    ) {
        this.position = { x, y };
        this.velocity = velocity;
    }

    update(dt: number): void {
        this.position = {
            x: this.position.x + this.velocity.x * dt,
            y: this.position.y + this.velocity.y * dt
        };
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}