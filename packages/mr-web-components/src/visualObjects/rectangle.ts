import { Vector2 } from "./Vector2.js";
import { IVisualObject } from 'mr-abstract-components';

import type { ISelectionBehavior } from 'mr-abstract-components';

import { injectable, inject } from 'tsyringe';

@injectable()
export class Rectangle implements IVisualObject<CanvasRenderingContext2D> {
  public id: string;
  public position: Vector2;
  public velocity: Vector2;
  private selectionBehavior?: ISelectionBehavior<CanvasRenderingContext2D>;

  constructor(
    public width: number,
    public height: number,
    public color: string,
    x: number = 0,
    y: number = 0,
    velocity: Vector2 = { x: 0, y: 0 },
    @inject("ISelectionBehavior") selectionBehavior?: ISelectionBehavior<CanvasRenderingContext2D>,
    id: string = 'Rectangle'
  ) {
    this.id = id;
    
    this.position = { x, y };
    this.velocity = velocity;
    this.selectionBehavior = selectionBehavior;
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
    this.selectionBehavior?.drawSelection(ctx, {
      x: this.position.x,
      y: this.position.y,
      width: this.width,
      height: this.height
    });
  }
  
  // Optionally, expose selection state
  get selected(): boolean {
    return this.selectionBehavior?.selected ?? false;
  }
  set selected(val: boolean) {
    if (this.selectionBehavior) this.selectionBehavior.selected = val;
  }
}

