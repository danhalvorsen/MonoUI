import { VisualObject } from './VisualObject.js';
import { Vector2 } from '@my-graphics/math';
import type { IStyle } from "mr-abstract-components";
import { Draggable } from './Draggable.js';
import { Connector } from '../connectors/Connector.js';
import { VisualRectangleTokenService } from 'mr-style';

export class VisualRectangle extends VisualObject {
  declare public id: string;
  public color: IStyle;
  private tokenService: VisualRectangleTokenService;

  private _draggable!: Draggable;

  constructor(
    id: string = 'Rectangle',
    style: IStyle = { color: '#0000ff' },
    width: number = 100,
    height: number = 100,
    tokenService?: VisualRectangleTokenService
  ) {
    super(
      new Vector2(0, 0),
      new Vector2(0, 0), // velocity
      new Vector2(0, 0), // acceleration
      width,
      height
    );
    this.id = id;
    this.color = style;
    this.tokenService = tokenService || new VisualRectangleTokenService();
    
    // Add a connector to the center of the rectangle
    this.addCenterConnector();
  }

  /**
   * Adds a connector to the center of the rectangle
   * The connector will follow the rectangle's movement automatically
   */
  private addCenterConnector(): void {
    const centerConnector = new Connector(
      `${this.id}-center-connector`, // Unique ID for the connector
      this, // Host object (this rectangle)
      0, // Relative X position (center)
      0  // Relative Y position (center)
    );
    
    // Add the connector to this visual object
    this.addConnector(centerConnector);
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
    
    // Update all connectors - they will follow this rectangle's movement
    this.updateConnectors(dt);
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Use token service for styling, fallback to color property, then defaults
    const fillColor = this.tokenService.fillPrimary || this.color.color || '#3b82f6';
    const borderColor = this.tokenService.borderDefault || this.color.borderColor || '#1e40af';
    const borderWidth = this.tokenService.borderWidth || this.color.borderWidth || 1;
    const borderRadius = this.tokenService.borderRadius || 0;
    
    // Draw the rectangle with rounded corners if specified
    ctx.fillStyle = fillColor;
    if (borderRadius > 0) {
      ctx.beginPath();
      ctx.roundRect(this._position.x, this._position.y, this.width, this.height, borderRadius);
      ctx.fill();
      
      // Draw border if specified
      if (borderWidth > 0) {
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = borderWidth;
        ctx.stroke();
      }
    } else {
      // Standard rectangle
      ctx.fillRect(this._position.x, this._position.y, this.width, this.height);
      
      // Draw border if specified
      if (borderWidth > 0) {
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = borderWidth;
        ctx.strokeRect(this._position.x, this._position.y, this.width, this.height);
      }
    }

    // Apply dragging opacity if currently being dragged
    if (this.isDragging) {
      ctx.globalAlpha = this.tokenService.draggingOpacity || 0.7;
    }

    // Draw selection indicator if selected (using dashed lines)
    if (this.selected) {
      const selectionColor = this.tokenService.selectionBorderColor || '#10b981'; // Green selection
      const selectionWidth = this.tokenService.selectionBorderWidth || 2;
      const selectionOffset = this.tokenService.selectionBorderOffset || 2;
      const selectionDash = this.tokenService.selectionBorderDash || [5, 5];
      
      ctx.strokeStyle = selectionColor;
      ctx.lineWidth = selectionWidth;
      ctx.setLineDash(selectionDash); // Set dashed line pattern
      
      if (borderRadius > 0) {
        ctx.beginPath();
        ctx.roundRect(
          this._position.x - selectionOffset, 
          this._position.y - selectionOffset, 
          this.width + (selectionOffset * 2), 
          this.height + (selectionOffset * 2), 
          borderRadius + selectionOffset
        );
        ctx.stroke();
      } else {
        ctx.strokeRect(
          this._position.x - selectionOffset, 
          this._position.y - selectionOffset, 
          this.width + (selectionOffset * 2), 
          this.height + (selectionOffset * 2)
        );
      }
      
      ctx.setLineDash([]); // Reset line dash
    }
    
    // Draw dragging indicator if currently being dragged
    if (this.isDragging) {
      const draggingColor = this.tokenService.draggingBorderColor || '#f59e0b'; // Amber dragging
      const draggingWidth = this.tokenService.draggingBorderWidth || 3;
      const draggingOffset = this.tokenService.draggingBorderOffset || 3;
      const draggingDash = this.tokenService.draggingBorderDash || [8, 4];
      
      ctx.strokeStyle = draggingColor;
      ctx.lineWidth = draggingWidth;
      ctx.setLineDash(draggingDash); // Set dashed line pattern for dragging
      
      if (borderRadius > 0) {
        ctx.beginPath();
        ctx.roundRect(
          this._position.x - draggingOffset, 
          this._position.y - draggingOffset, 
          this.width + (draggingOffset * 2), 
          this.height + (draggingOffset * 2), 
          borderRadius + draggingOffset
        );
        ctx.stroke();
      } else {
        ctx.strokeRect(
          this._position.x - draggingOffset, 
          this._position.y - draggingOffset, 
          this.width + (draggingOffset * 2), 
          this.height + (draggingOffset * 2)
        );
      }
      
      ctx.setLineDash([]); // Reset line dash
      ctx.globalAlpha = 1.0; // Reset opacity
    }
    
    // Render all connectors - they will appear at their updated positions
    this.renderConnectors(ctx);
  }
}
