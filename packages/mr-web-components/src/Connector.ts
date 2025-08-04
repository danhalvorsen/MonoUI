
import { VisualRectangleTokenService } from 'mr-style';
import { VisualObject } from './visual/VisualObject.js';
import { Vector2 } from '@my-graphics/math';
import { Connector } from './connectors/Connector.js';
import { Draggable } from './visual/Draggable.js';
import type { IStyle } from './visual/IStyle.js';

export class VisualRectangle extends VisualObject {
  declare public id: string;
  public style: IStyle;
  private tokenService: VisualRectangleTokenService;
  private _draggable: Draggable;

  constructor(
    id: string = 'Rectangle',
    style: IStyle = { color: '#0000ff' },
    width: number = 100,
    height: number = 100,
    tokenService?: VisualRectangleTokenService
  ) {
    super(new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0), width, height);
    this.id = id;
    this.style = style;
    this.tokenService = tokenService || new VisualRectangleTokenService();
    this._draggable = new Draggable();

    // Add a connector to the center
    this.addCenterConnector();
  }

  get isDragging(): boolean {
    return this._draggable?.isDragging ?? false;
  }

  private addCenterConnector(): void {
    const centerConnector = new Connector(`${this.id}-center-connector`, this, 0, 0);
    this.addConnector(centerConnector as IConnector);
  }

  get Velocity(): Vector2 { return this.physicObject.velocity; }
  get Acceleration(): Vector2 { return this.physicObject.acceleration; }
  set Acceleration(a: Vector2) { this.physicObject.acceleration = a; }
  get direction(): Vector2 { return this.physicObject.Direction; }
  protected setVelocity(v: Vector2): void { (this.physicObject as any)?.setVelocity?.(v); }

  update(dt: number): void {
    this.updateConnectors(dt);
  }

  render(ctx: CanvasRenderingContext2D): void {
    const fillColor = this.tokenService.fillPrimary || this.style.color || '#3b82f6';
    const borderColor = this.tokenService.borderDefault || this.style.borderColor || '#1e40af';
    const borderWidth = this.tokenService.borderWidth || this.style.borderWidth || 1;
    const borderRadius = this.tokenService.borderRadius || 0;

    // Draw filled rect
    ctx.fillStyle = fillColor;
    if (borderRadius > 0 && "roundRect" in ctx) {
      ctx.beginPath();
      (ctx as any).roundRect(this.physicObject.position.x, this.physicObject.position.y, this.width, this.height, borderRadius);
      ctx.fill();
    } else {
      ctx.fillRect(this.physicObject.position.x, this.physicObject.position.y, this.width, this.height);
    }

    if (borderWidth > 0) {
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderWidth;
      if (borderRadius > 0 && "roundRect" in ctx) {
        ctx.stroke();
      } else {
        ctx.strokeRect(this.physicObject.position.x, this.physicObject.position.y, this.width, this.height);
      }
    }

    // Selection + dragging overlays
    if (this.selected) { /* selection drawing code (as before) */ }
    if (this.isDragging) { /* dragging indicator code (as before) */ }

    this.renderConnectors(ctx);
  }
}
