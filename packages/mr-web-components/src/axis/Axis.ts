import type { IStyle, IVisualConnector, ChangedProperties, IAxis, AxisConfig } from 'mr-abstract-components';
import { Vector2 } from '@my-graphics/math';

export class Axis implements IAxis {
  // IVisualObject properties
  id: string;
  position: Vector2;
  selected?: boolean;
  physicObject?: any;
  style?: IStyle;
  connectors?: IVisualConnector[];
  isDraggable?: boolean;
  onDragStart?: (event: MouseEvent) => void;
  onDrag?: (event: MouseEvent, dx: number, dy: number) => void;
  onDragEnd?: (event: MouseEvent) => void;

  // IAxis properties
  config: AxisConfig;
  
  // Legacy properties for backward compatibility
  min: number;
  max: number;

  constructor(
    id: string,
    min: number = -100,
    max: number = 100
  ) {
    this.id = id;
    this.position = new Vector2(0, 0);
    this.min = min;
    this.max = max;
    
    // Initialize with default AxisConfig
    this.config = {
      showXAxis: true,
      showYAxis: true,
      color: '#374151',
      lineWidth: 2,
      opacity: 1,
      showTicks: true,
      tickSize: 5,
      tickSpacing: 10,
      showLabels: true,
      labelFont: '12px Arial',
      labelColor: '#6b7280',
      showOrigin: true,
      originSize: 4,
      originColor: '#ef4444',
      showGrid: false,
      gridSize: 10,
      gridColor: '#e5e7eb',
      gridOpacity: 0.5
    };
  }

  // IAxis interface methods
  setConfig(config: Partial<AxisConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): AxisConfig {
    return { ...this.config };
  }

  // IVisualObject methods
  update(dt: number): void {
    // Axis doesn't need updates
  }

  render(ctx: CanvasRenderingContext2D): void {
    // This will be implemented based on whether it's X or Y axis
    // For now, just a placeholder
  }

  renderXAxis(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {
    if (!this.config.showXAxis) return;
    
    ctx.save();
    
    const centerY = canvasHeight / 2;
    
    // Draw main axis line
    ctx.strokeStyle = this.config.color;
    ctx.lineWidth = this.config.lineWidth;
    ctx.globalAlpha = this.config.opacity;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvasWidth, centerY);
    ctx.stroke();

    if (this.config.showTicks || this.config.showLabels) {
      const range = this.max - this.min;
      const pixelsPerUnit = canvasWidth / range;
      
      ctx.strokeStyle = this.config.color;
      ctx.lineWidth = 1;
      ctx.fillStyle = this.config.labelColor;
      ctx.font = this.config.labelFont;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      for (let value = this.min; value <= this.max; value += this.config.tickSpacing) {
        const x = (value - this.min) * pixelsPerUnit;
        
        if (this.config.showTicks) {
          ctx.beginPath();
          ctx.moveTo(x, centerY - this.config.tickSize);
          ctx.lineTo(x, centerY + this.config.tickSize);
          ctx.stroke();
        }
        
        if (this.config.showLabels) {
          ctx.fillText(value.toString(), x, centerY + this.config.tickSize + 2);
        }
      }
    }

    ctx.restore();
  }

  renderYAxis(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {
    if (!this.config.showYAxis) return;
    
    ctx.save();
    
    const centerX = canvasWidth / 2;
    
    // Draw main axis line
    ctx.strokeStyle = this.config.color;
    ctx.lineWidth = this.config.lineWidth;
    ctx.globalAlpha = this.config.opacity;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvasHeight);
    ctx.stroke();

    if (this.config.showTicks || this.config.showLabels) {
      const range = this.max - this.min;
      const pixelsPerUnit = canvasHeight / range;
      
      ctx.strokeStyle = this.config.color;
      ctx.lineWidth = 1;
      ctx.fillStyle = this.config.labelColor;
      ctx.font = this.config.labelFont;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      for (let value = this.min; value <= this.max; value += this.config.tickSpacing) {
        const y = canvasHeight - (value - this.min) * pixelsPerUnit; // Flip Y for screen coordinates
        
        if (this.config.showTicks) {
          ctx.beginPath();
          ctx.moveTo(centerX - this.config.tickSize, y);
          ctx.lineTo(centerX + this.config.tickSize, y);
          ctx.stroke();
        }
        
        if (this.config.showLabels) {
          ctx.fillText(value.toString(), centerX - this.config.tickSize - 2, y);
        }
      }
    }

    ctx.restore();
  }

  renderTicks(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {
    // Ticks are rendered as part of renderXAxis and renderYAxis
  }

  renderLabels(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {
    // Labels are rendered as part of renderXAxis and renderYAxis
  }

  renderOrigin(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {
    if (!this.config.showOrigin) return;
    
    ctx.save();
    
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    
    ctx.fillStyle = this.config.originColor;
    ctx.beginPath();
    ctx.arc(centerX, centerY, this.config.originSize, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.restore();
  }

  screenToAxis(screenPoint: Vector2, canvasWidth: number, canvasHeight: number): Vector2 {
    const xRange = this.max - this.min;
    const yRange = this.max - this.min; // Assuming square coordinate system
    
    const axisX = this.min + (screenPoint.x / canvasWidth) * xRange;
    const axisY = this.max - (screenPoint.y / canvasHeight) * yRange; // Flip Y axis
    
    return new Vector2(axisX, axisY);
  }

  axisToScreen(axisPoint: Vector2, canvasWidth: number, canvasHeight: number): Vector2 {
    const xRange = this.max - this.min;
    const yRange = this.max - this.min; // Assuming square coordinate system
    
    const screenX = ((axisPoint.x - this.min) / xRange) * canvasWidth;
    const screenY = ((this.max - axisPoint.y) / yRange) * canvasHeight; // Flip Y axis
    
    return new Vector2(screenX, screenY);
  }

  // IVisualObject lifecycle methods
  connectedCallback?(): void {}
  disconnectedCallback?(): void {}
  shouldUpdate?(changedProperties: ChangedProperties): boolean { return true; }
  willUpdate?(changedProperties: ChangedProperties): void {}
  firstUpdated?(changedProperties: ChangedProperties): void {}
  updated?(changedProperties: ChangedProperties): void {}
}
