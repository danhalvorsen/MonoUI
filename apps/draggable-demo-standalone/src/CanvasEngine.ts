import { IVisualObject } from 'mr-abstract-components';
import { RequestAnimationLoop, VisualRectangle } from 'mr-web-components';
import { GridService } from './services/GridService.js';
import { SnappingService } from './services/SnappingService.js';
import { CoordinateMappingService } from './services/CoordinateMappingService.js';
import { Vector2 } from '@my-graphics/math';

export class CanvasEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationLoop: RequestAnimationLoop;
  private visualObjects: (IVisualObject | VisualRectangle)[] = [];
  private gridService: GridService;
  private snappingService: SnappingService;
  private coordinateMapping: CoordinateMappingService;
  private draggedObject: IVisualObject | null = null;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.animationLoop = new RequestAnimationLoop();

    // Initialize coordinate mapping, grid and snapping services
    this.coordinateMapping = new CoordinateMappingService(this.canvas.width, this.canvas.height);
    this.gridService = new GridService();
    this.snappingService = new SnappingService(this.gridService);

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.animationLoop.onTick(() => this.render());
  }

  private resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    // Update coordinate mapping when canvas is resized
    this.coordinateMapping.updateCanvasSize(this.canvas.width, this.canvas.height);
  }

  public addObject(obj: IVisualObject | VisualRectangle) {
    this.visualObjects.push(obj);
  }

  /**
   * Gets the canvas width
   */
  public get canvasWidth(): number {
    return this.canvas.width;
  }

  /**
   * Gets the canvas height
   */
  public get canvasHeight(): number {
    return this.canvas.height;
  }

  /**
   * Gets the canvas element (read-only access)
   */
  public get canvasElement(): HTMLCanvasElement {
    return this.canvas;
  }

  /**
   * Applies Cartesian coordinate transformation to the canvas context
   */
  private applyCartesianTransform(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    // Translate origin to center
    const center = this.coordinateMapping.getCenter();
    ctx.translate(center.x, center.y);
    // Flip Y axis to make +Y go up instead of down
    ctx.scale(1, -1);
  }

  /**
   * Restores the original coordinate system
   */
  private restoreTransform(ctx: CanvasRenderingContext2D): void {
    ctx.restore();
  }

  private render() {
    // Clear the entire canvas in screen coordinates
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Apply Cartesian coordinate transformation
    this.applyCartesianTransform(this.ctx);
    
    // Render grid first (background layer) - now in Cartesian coordinates
    this.gridService.render(this.ctx, this.canvas.width, this.canvas.height);
    
    // Update all connectors to sync with their host positions
    this.visualObjects.forEach(obj => {
      if ('connectors' in obj && obj.connectors) {
        obj.connectors.forEach((connector: any) => {
          if ('update' in connector && typeof connector.update === 'function') {
            connector.update();
          }
        });
      }
    });
    
    // Render visual objects in Cartesian coordinates
    this.visualObjects.forEach(obj => {
      if ('render' in obj && typeof obj.render === 'function') {
        obj.render(this.ctx);
      } else if (obj instanceof VisualRectangle) {
        this.ctx.fillStyle = obj.color.color;
        // Objects are now positioned in Cartesian coordinates
        this.ctx.fillRect(obj.position.x, obj.position.y, obj.width, obj.height);
      }
    });
    
    // Render snap guides if an object is being dragged
    if (this.draggedObject) {
      this.snappingService.renderSnapGuides(
        this.ctx,
        this.draggedObject,
        this.visualObjects as IVisualObject[],
        this.canvas.width,
        this.canvas.height
      );
    }
    
    // Restore original coordinate system
    this.restoreTransform(this.ctx);
  }

  public start() {
    this.animationLoop.start();
  }

  /**
   * Requests a single render frame
   * Useful for triggering updates when selection or other state changes
   */
  public requestRender(): void {
    this.render();
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  // Grid and Snapping API
  
  /**
   * Snaps a position to grid and/or objects based on current settings
   */
  public snapPosition(position: Vector2, draggedObject: IVisualObject): Vector2 {
    return this.snappingService.snapPosition(
      position,
      draggedObject,
      this.visualObjects as IVisualObject[]
    );
  }

  /**
   * Sets the currently dragged object (for snap guide rendering)
   */
  public setDraggedObject(obj: IVisualObject | null): void {
    this.draggedObject = obj;
  }

  /**
   * Toggles grid visibility
   */
  public toggleGrid(): void {
    this.gridService.toggleGrid();
  }

  /**
   * Toggles grid snapping
   */
  public toggleGridSnapping(): void {
    this.snappingService.toggleGridSnapping();
  }

  /**
   * Toggles object snapping
   */
  public toggleObjectSnapping(): void {
    this.snappingService.toggleObjectSnapping();
  }

  /**
   * Updates grid configuration
   */
  public updateGridConfig(config: Partial<import('./services/GridService.js').GridConfig>): void {
    this.gridService.updateConfig(config);
  }

  /**
   * Updates snapping configuration
   */
  public updateSnappingConfig(config: Partial<import('./services/SnappingService.js').SnappingConfig>): void {
    this.snappingService.updateConfig(config);
  }

  /**
   * Gets current grid configuration
   */
  public getGridConfig(): import('./services/GridService.js').GridConfig {
    return this.gridService.getConfig();
  }

  /**
   * Gets current snapping configuration
   */
  public getSnappingConfig(): import('./services/SnappingService.js').SnappingConfig {
    return this.snappingService.getConfig();
  }

  /**
   * Gets the grid service instance (for advanced usage)
   */
  public getGridService(): GridService {
    return this.gridService;
  }

  /**
   * Gets the snapping service instance (for advanced usage)
   */
  public getSnappingService(): SnappingService {
    return this.snappingService;
  }

  // Coordinate System API
  
  /**
   * Converts Cartesian coordinates to screen coordinates
   */
  public cartesianToScreen(cartesian: Vector2): Vector2 {
    return this.coordinateMapping.cartesianToScreen(cartesian);
  }

  /**
   * Converts screen coordinates to Cartesian coordinates
   */
  public screenToCartesian(screen: Vector2): Vector2 {
    return this.coordinateMapping.screenToCartesian(screen);
  }

  /**
   * Gets the coordinate mapping service instance (for advanced usage)
   */
  public getCoordinateSystem(): CoordinateMappingService {
    return this.coordinateMapping;
  }

  /**
   * Gets the coordinate mapping service instance (preferred method name)
   */
  public getCoordinateMapping(): CoordinateMappingService {
    return this.coordinateMapping;
  }

  /**
   * Gets the canvas bounds in Cartesian coordinates
   */
  public getCartesianBounds(): {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  } {
    return this.coordinateMapping.getCartesianBounds();
  }

  /**
   * Gets the center point (origin) in screen coordinates
   */
  public getCenter(): Vector2 {
    return this.coordinateMapping.getCenter();
  }
}
