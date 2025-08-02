import { Vector2 } from '@my-graphics/math';

export interface GridConfig {
  size: number;
  color: string;
  opacity: number;
  enabled: boolean;
}

/**
 * Service responsible for grid configuration and grid-related calculations
 * Follows Single Responsibility Principle - handles grid config, snapping, and calculations only
 * Rendering is handled by AxisVisual class
 */
export class AxisService {
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
