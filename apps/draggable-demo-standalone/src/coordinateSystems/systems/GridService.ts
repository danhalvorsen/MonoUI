import { Vector2 } from '@my-graphics/math';

export interface GridConfig {
  size: number;
  color: string;
  opacity: number;
  enabled: boolean;
}

/**
 * Service responsible for grid rendering and grid-related calculations
 * Follows Single Responsibility Principle - only handles grid functionality
 */
export class GridService {
  private config: GridConfig;

  constructor(config: GridConfig = {
    size: 20,
    color: '#e0e0e0',
    opacity: 0.5,
    enabled: true
  }) {
    this.config = config;
  }

  /**
   * Renders the grid on the canvas using Cartesian coordinates
   * Grid is centered at origin (0,0) and extends in all directions
   */
  render(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {
    if (!this.config.enabled) return;

    ctx.save();
    ctx.globalAlpha = this.config.opacity;
    ctx.strokeStyle = this.config.color;
    ctx.lineWidth = 1;

    // Calculate grid bounds in Cartesian coordinates
    const halfWidth = canvasWidth / 2;
    const halfHeight = canvasHeight / 2;
    
    // Draw vertical lines (parallel to Y-axis)
    for (let x = -halfWidth; x <= halfWidth; x += this.config.size) {
      // Snap to grid to avoid floating point issues
      const gridX = Math.round(x / this.config.size) * this.config.size;
      
      ctx.beginPath();
      ctx.moveTo(gridX, -halfHeight);
      ctx.lineTo(gridX, halfHeight);
      ctx.stroke();
    }

    // Draw horizontal lines (parallel to X-axis)
    for (let y = -halfHeight; y <= halfHeight; y += this.config.size) {
      // Snap to grid to avoid floating point issues
      const gridY = Math.round(y / this.config.size) * this.config.size;
      
      ctx.beginPath();
      ctx.moveTo(-halfWidth, gridY);
      ctx.lineTo(halfWidth, gridY);
      ctx.stroke();
    }

    // Draw axes (X and Y) with different style
    ctx.strokeStyle = this.config.color;
    ctx.globalAlpha = Math.min(this.config.opacity * 2, 1); // Make axes more visible
    ctx.lineWidth = 2;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(-halfWidth, 0);
    ctx.lineTo(halfWidth, 0);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(0, -halfHeight);
    ctx.lineTo(0, halfHeight);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Snaps a position to the nearest grid point
   */
  snapToGrid(position: Vector2): Vector2 {
    if (!this.config.enabled) return position;

    const snappedX = Math.round(position.x / this.config.size) * this.config.size;
    const snappedY = Math.round(position.y / this.config.size) * this.config.size;
    
    return new Vector2(snappedX, snappedY);
  }

  /**
   * Snaps a single coordinate value to the grid
   */
  snapValue(value: number): number {
    if (!this.config.enabled) return value;
    return Math.round(value / this.config.size) * this.config.size;
  }

  /**
   * Gets the grid size
   */
  getGridSize(): number {
    return this.config.size;
  }

  /**
   * Updates the grid configuration
   */
  updateConfig(newConfig: Partial<GridConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Toggles grid visibility
   */
  toggleGrid(): void {
    this.config.enabled = !this.config.enabled;
  }

  /**
   * Checks if grid is enabled
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Gets the current grid configuration
   */
  getConfig(): GridConfig {
    return { ...this.config };
  }
}
