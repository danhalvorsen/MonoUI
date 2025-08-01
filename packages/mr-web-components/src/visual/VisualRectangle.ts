import { VisualObject } from './VisualObject.js';
import { Vector2 } from '@my-graphics/math';
import { Draggable } from './Draggable.js';
import { Connector } from '../connectors/Connector.js';
import { VisualRectangleTokenService } from 'mr-style';
import type { IConnector, IStyle } from 'mr-abstract-components';

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

    this.addCenterConnector();
  }

 

  private addCenterConnector(): void {
    const centerConnector = new Connector(`${this.id}-center-connector`, this, 0, 0);
    this.addConnector(centerConnector as unknown as IConnector);
  }

  get Velocity(): Vector2 { return this.physicObject.velocity; }
  get Acceleration(): Vector2 { return this.physicObject.acceleration; }
  set Acceleration(a: Vector2) { this.physicObject.acceleration = a; }
  get direction(): Vector2 { return this.physicObject.Direction; }
  protected setVelocity(v: Vector2): void { (this.physicObject as any)?.setVelocity?.(v); }

  update(dt: number): void {
    // Ensure connectors remain centered if size changes
    const center = new Vector2(this.width / 2, this.height / 2);
    this.connectors?.forEach(c => (c as any).setRelativePosition?.(center));
    this.updateConnectors(dt);
  }
  render(ctx: CanvasRenderingContext2D): void {
    this.drawBaseRect(ctx);
    if (this.isDragging) this.drawDraggingOutline(ctx);
    if (this.selected) this.drawSelectionOutline(ctx);
    this.renderConnectors(ctx);
  }

  private drawBaseRect(ctx: CanvasRenderingContext2D): void {
    const { fill, border, borderWidth, radius } = this.resolveStyle();
    ctx.fillStyle = fill;

    ctx.save();
    if (radius > 0 && "roundRect" in ctx) {
      ctx.beginPath();
      (ctx as any).roundRect(this.physicObject.position.x, this.physicObject.position.y, this.width, this.height, radius);
      ctx.fill();
      if (borderWidth > 0) {
        ctx.strokeStyle = border;
        ctx.lineWidth = borderWidth;
        ctx.stroke();
      }
    } else {
      ctx.fillRect(this.physicObject.position.x, this.physicObject.position.y, this.width, this.height);
      if (borderWidth > 0) {
        ctx.strokeStyle = border;
        ctx.lineWidth = borderWidth;
        ctx.strokeRect(this.physicObject.position.x, this.physicObject.position.y, this.width, this.height);
      }
    }
    ctx.restore();
  }

  private drawSelectionOutline(ctx: CanvasRenderingContext2D): void {
    const selectionColor = this.tokenService.selectionBorderColor || '#10b981';
    const selectionWidth = this.tokenService.selectionBorderWidth || 2;
    const selectionOffset = this.tokenService.selectionBorderOffset || 2;
    const selectionDash = this.tokenService.selectionBorderDash || [5, 5];
    const radius = this.tokenService.borderRadius || 0;

    ctx.save();
    ctx.strokeStyle = selectionColor;
    ctx.lineWidth = selectionWidth;
    ctx.setLineDash(selectionDash);

    if (radius > 0 && "roundRect" in ctx) {
      ctx.beginPath();
      (ctx as any).roundRect(
        this.physicObject.position.x - selectionOffset,
        this.physicObject.position.y - selectionOffset,
        this.width + (selectionOffset * 2),
        this.height + (selectionOffset * 2),
        radius + selectionOffset
      );
      ctx.stroke();
    } else {
      ctx.strokeRect(
        this.physicObject.position.x - selectionOffset,
        this.physicObject.position.y - selectionOffset,
        this.width + (selectionOffset * 2),
        this.height + (selectionOffset * 2)
      );
    }
    ctx.restore();
  }

  private drawDraggingOutline(ctx: CanvasRenderingContext2D): void {
    const draggingColor = this.tokenService.draggingBorderColor || '#f59e0b';
    const draggingWidth = this.tokenService.draggingBorderWidth || 3;
    const draggingOffset = this.tokenService.draggingBorderOffset || 3;
    const draggingDash = this.tokenService.draggingBorderDash || [8, 4];
    const radius = this.tokenService.borderRadius || 0;

    ctx.save();
    ctx.globalAlpha = this.tokenService.draggingOpacity || 0.7;
    ctx.strokeStyle = draggingColor;
    ctx.lineWidth = draggingWidth;
    ctx.setLineDash(draggingDash);

    if (radius > 0 && "roundRect" in ctx) {
      ctx.beginPath();
      (ctx as any).roundRect(
        this.physicObject.position.x - draggingOffset,
        this.physicObject.position.y - draggingOffset,
        this.width + (draggingOffset * 2),
        this.height + (draggingOffset * 2),
        radius + draggingOffset
      );
      ctx.stroke();
    } else {
      ctx.strokeRect(
        this.physicObject.position.x - draggingOffset,
        this.physicObject.position.y - draggingOffset,
        this.width + (draggingOffset * 2),
        this.height + (draggingOffset * 2)
      );
    }
    ctx.restore();
  }

  private resolveStyle() {
    return {
      fill: this.tokenService.fillPrimary ?? this.style.color ?? '#3b82f6',
      border: this.tokenService.borderDefault ?? this.style.borderColor ?? '#1e40af',
      borderWidth: this.tokenService.borderWidth ?? this.style.borderWidth ?? 1,
      radius: this.tokenService.borderRadius ?? 0
    };
  }
}
