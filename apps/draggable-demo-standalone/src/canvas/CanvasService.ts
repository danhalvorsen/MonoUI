/**
 * CanvasService encapsulates all canvas-specific functionality
 * Follows Single Responsibility Principle by handling only canvas DOM and sizing concerns
 */
export class CanvasService {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private resizeCallback?: (width: number, height: number) => void;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!this.canvas) {
      throw new Error(`Canvas element with id '${canvasId}' not found`);
    }
    
    this.ctx = this.canvas.getContext('2d')!;
    if (!this.ctx) {
      throw new Error('Failed to get 2D rendering context');
    }

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  /**
   * Resizes canvas to fill the window and notifies listeners
   */
  private resizeCanvas(): void {
    const oldWidth = this.canvas.width;
    const oldHeight = this.canvas.height;
    
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    // Notify listeners if size changed
    if ((oldWidth !== this.canvas.width || oldHeight !== this.canvas.height) && this.resizeCallback) {
      this.resizeCallback(this.canvas.width, this.canvas.height);
    }
  }

  /**
   * Sets a callback to be called when canvas is resized
   */
  public onResize(callback: (width: number, height: number) => void): void {
    this.resizeCallback = callback;
  }

  /**
   * Gets the canvas element (read-only access)
   */
  public getElement(): HTMLCanvasElement {
    return this.canvas;
  }

  /**
   * Gets the 2D rendering context
   */
  public getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  /**
   * Gets the canvas width
   */
  public get width(): number {
    return this.canvas.width;
  }

  /**
   * Gets the canvas height
   */
  public get height(): number {
    return this.canvas.height;
  }

  /**
   * Clears the entire canvas
   */
  public clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Applies Cartesian coordinate transformation to the canvas context
   * Origin at center, +Y pointing up
   */
  public applyCartesianTransform(): void {
    this.ctx.save();
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.scale(1, -1); // Flip Y-axis so +Y points up
  }

  /**
   * Restores the original coordinate system
   */
  public restoreTransform(): void {
    this.ctx.restore();
  }

  /**
   * Cleanup method to remove event listeners
   */
  public dispose(): void {
    window.removeEventListener('resize', () => this.resizeCanvas());
  }
}
