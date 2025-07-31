import { Vector2 } from '@my-graphics/math';

/**
 * Service responsible for coordinate system transformations
 * Converts between screen coordinates (top-left origin) and Cartesian coordinates (center origin)
 * Follows Single Responsibility Principle - only handles coordinate transformations
 */
export class CoordinateSystemService {
  private canvasWidth!: number;
  private canvasHeight!: number;
  private centerX!: number;
  private centerY!: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.updateCanvasSize(canvasWidth, canvasHeight);
  }

  /**
   * Updates the canvas size and recalculates center point
   */
  updateCanvasSize(width: number, height: number): void {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.centerX = width / 2;
    this.centerY = height / 2;
  }

  /**
   * Converts Cartesian coordinates (origin at center) to screen coordinates (origin at top-left)
   * In Cartesian: (0,0) is center, +Y is up, -Y is down
   * In Screen: (0,0) is top-left, +Y is down, -Y is up
   */
  cartesianToScreen(cartesian: Vector2): Vector2 {
    return new Vector2(
      cartesian.x + this.centerX,
      this.centerY - cartesian.y  // Flip Y axis
    );
  }

  /**
   * Converts screen coordinates (origin at top-left) to Cartesian coordinates (origin at center)
   */
  screenToCartesian(screen: Vector2): Vector2 {
    return new Vector2(
      screen.x - this.centerX,
      this.centerY - screen.y  // Flip Y axis
    );
  }

  /**
   * Applies Cartesian coordinate transformation to the canvas context
   * This transforms the entire coordinate system so all subsequent drawing operations use Cartesian coordinates
   */
  applyCartesianTransform(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    // Translate origin to center
    ctx.translate(this.centerX, this.centerY);
    // Flip Y axis to make +Y go up instead of down
    ctx.scale(1, -1);
  }

  /**
   * Restores the original coordinate system
   */
  restoreTransform(ctx: CanvasRenderingContext2D): void {
    ctx.restore();
  }

  /**
   * Gets the center point in screen coordinates
   */
  getCenter(): Vector2 {
    return new Vector2(this.centerX, this.centerY);
  }

  /**
   * Gets the canvas bounds in Cartesian coordinates
   */
  getCartesianBounds(): {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  } {
    return {
      minX: -this.centerX,
      maxX: this.centerX,
      minY: -this.centerY,
      maxY: this.centerY
    };
  }

  /**
   * Checks if a Cartesian coordinate is within the canvas bounds
   */
  isWithinBounds(cartesian: Vector2): boolean {
    const bounds = this.getCartesianBounds();
    return (
      cartesian.x >= bounds.minX &&
      cartesian.x <= bounds.maxX &&
      cartesian.y >= bounds.minY &&
      cartesian.y <= bounds.maxY
    );
  }

  /**
   * Clamps a Cartesian coordinate to stay within canvas bounds
   */
  clampToBounds(cartesian: Vector2): Vector2 {
    const bounds = this.getCartesianBounds();
    return new Vector2(
      Math.max(bounds.minX, Math.min(bounds.maxX, cartesian.x)),
      Math.max(bounds.minY, Math.min(bounds.maxY, cartesian.y))
    );
  }

  /**
   * Gets the current canvas dimensions
   */
  getCanvasDimensions(): { width: number; height: number } {
    return {
      width: this.canvasWidth,
      height: this.canvasHeight
    };
  }
}
