
import { Draggable } from "./Draggable.js";
import { VisualObject } from "./VisualObject.js";
import { IVisual } from "./IVisual.js";
import { Vector2 } from "@my-graphics/math";
 

export class VisualRectangle extends VisualObject {
  public id: string;
  public color: IVisual;

  private _draggable!: Draggable;

  constructor(
    id: string = 'Rectangle',
    style: IVisual = { color: '#0000ff' },
    position: Vector2 = new Vector2(0, 0),
    width: number = 100,
    height: number = 100
  ) {
    super(
      position,
      new Vector2(0, 0), // velocity
      new Vector2(0, 0), // acceleration
      width,
      height
    );
    this.id = id;
    this.color = style;
  }


  get Velocity(): Vector2 {
    return this._velocity;
  }
  get Acceleration(): Vector2 {
    return this._acceleration;
  }
  set Acceleration(a: Vector2) {
    this._acceleration = a;
  }
  get direction(): Vector2 {
    return super.direction;
  }
  protected setVelocity(v: Vector2): void {
    super.setVelocity(v);
  }

  update(dt: number): void {
    // Simple update - no velocity/animation needed for basic rectangle
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Draw the rectangle
    ctx.fillStyle = this.color.color || '#0000ff';
    ctx.fillRect(this._position.x, this._position.y, this.width, this.height);

    // Draw selection indicator if selected
    if (this.selected) {
      ctx.strokeStyle = '#00ff00'; // Green selection border
      ctx.lineWidth = 2;
      ctx.strokeRect(this._position.x - 2, this._position.y - 2, this.width + 4, this.height + 4);
    }
  }
}
