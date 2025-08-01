import type { IGridObject } from '../IGridObject.js';
import type { IStyle, IConnector, ChangedProperties } from 'mr-abstract-components';
import { Vector2 } from '@my-graphics/math';

export class GridObject implements IGridObject {
    GridCOn
  id: string;
  gridSize: number;
  gridColor?: string;
  showGrid: boolean;
  snapToGrid?: boolean;
  selected?: boolean;
  enabled?: boolean;
  physicObject?: any;
  style?: IStyle;
  connectors?: IConnector[];
  isDraggable?: boolean;
  onDragStart?: (event: MouseEvent) => void;
  onDrag?: (event: MouseEvent, dx: number, dy: number) => void;
  onDragEnd?: (event: MouseEvent) => void;

  constructor(
    id: string = 'grid',
    gridSize: number = 20,
    gridColor: string = '#e5e7eb',
    showGrid: boolean = true,
    snapToGrid: boolean = true
  ) {
    this.id = id;
    this.gridSize = gridSize;
    this.gridColor = gridColor;
    this.showGrid = showGrid;
    this.snapToGrid = snapToGrid;
  }
    position: Vector2;

  update(dt: number): void {
    // Grid doesn't need updates
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.showGrid) return;

    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;

    ctx.save();
    ctx.strokeStyle = this.gridColor || '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;

    // Draw vertical lines
    for (let x = 0; x <= width; x += this.gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= height; y += this.gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.restore();
  }

  // Snap a point to the nearest grid intersection
  snapToGridPoint(point: Vector2): Vector2 {
    if (!this.snapToGrid) return point;

    const snappedX = Math.round(point.x / this.gridSize) * this.gridSize;
    const snappedY = Math.round(point.y / this.gridSize) * this.gridSize;
    
    return new Vector2(snappedX, snappedY);
  }

  connectedCallback?(): void {}
  disconnectedCallback?(): void {}
  shouldUpdate?(changedProperties: ChangedProperties): boolean { return true; }
  willUpdate?(changedProperties: ChangedProperties): void {}
  firstUpdated?(changedProperties: ChangedProperties): void {}
  updated?(changedProperties: ChangedProperties): void {}
}
