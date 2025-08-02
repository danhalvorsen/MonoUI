import { IVisualObject } from 'mr-abstract-components';
import { RequestAnimationLoop, VisualRectangle, Connector } from 'mr-web-components';
import { CanvasDarkTheme } from 'mr-style';
import { GridService } from '../coordinateSystems/systems/GridService.js';
import { SnappingService } from '../coordinateSystems/systems/SnappingService.js';
import { MapBetweenCoordinateSystemService } from '../Helpers/MapBetweenCoordinateSystemService.js';
import { CanvasService } from './CanvasService.js';
import { DragHostService } from '../dragging/DragHostService.js';
import { CartesianDragController } from '../dragging/CartesianDragController.js';
import { MapScreenCoordinateSystem } from '../coordinateSystems/systems/MapScreenCoordinateSystem.js';
import { SelectionService } from '../services/SelectionService.js';
import { Vector2 } from '@my-graphics/math';

export class CanvasEngine {
  private canvasService: CanvasService;
  private animationLoop: RequestAnimationLoop;
  private visualObjects: (IVisualObject | VisualRectangle)[] = [];
  private gridService: GridService;
  private snappingService: SnappingService;
  private coordinateMapping: MapBetweenCoordinateSystemService;
  private draggedObject: IVisualObject | null = null;
  private customRenderCallback?: (ctx: CanvasRenderingContext2D) => void;
  
  // Demo-specific services
  private dragHostService?: DragHostService;
  private dragController?: CartesianDragController;
  private coordinateSystem?: MapScreenCoordinateSystem;
  private selectionService?: SelectionService;

  constructor(canvasId: string) {
    this.canvasService = new CanvasService(canvasId);
    this.animationLoop = new RequestAnimationLoop();

    // Initialize coordinate mapping, grid and snapping services
    this.coordinateMapping = new MapBetweenCoordinateSystemService(this.canvasService.width, this.canvasService.height);
    this.gridService = new GridService();
    this.snappingService = new SnappingService(this.gridService);

    // Setup canvas resize callback to update coordinate mapping
    this.canvasService.onResize((width, height) => {
      this.coordinateMapping.updateCanvasSize(width, height);
    });

    this.animationLoop.onTick(() => this.render());
  }



  public addObject(obj: IVisualObject | VisualRectangle) {
    this.visualObjects.push(obj);
  }

  /**
   * Sets a custom render callback for additional rendering (like connections)
   */
  public setCustomRenderCallback(callback: (ctx: CanvasRenderingContext2D) => void): void {
    this.customRenderCallback = callback;
  }

  /**
   * Gets the canvas width
   */
  public get canvasWidth(): number {
    return this.canvasService.width;
  }

  /**
   * Gets the canvas height
   */
  public get canvasHeight(): number {
    return this.canvasService.height;
  }

  /**
   * Gets the canvas element (read-only access)
   */
  public get canvasElement(): HTMLCanvasElement {
    return this.canvasService.getElement();
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
    const ctx = this.canvasService.getContext();
    
    // Clear the entire canvas in screen coordinates
    this.canvasService.clear();
    
    // Apply Cartesian coordinate transformation
    this.canvasService.applyCartesianTransform();
    
    // Render grid first (background layer) - now in Cartesian coordinates
    this.gridService.render(ctx, this.canvasService.width, this.canvasService.height);
    
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
        obj.render(ctx);
      } else if (obj instanceof VisualRectangle) {
        ctx.fillStyle = obj.color.color;
        // Objects are now positioned in Cartesian coordinates
        ctx.fillRect(obj.position.x, obj.position.y, obj.Width, obj.Height);
      }
    });
    
    // Render snap guides if an object is being dragged
    if (this.draggedObject) {
      this.snappingService.renderSnapGuides(
        ctx,
        this.draggedObject,
        this.visualObjects as IVisualObject[],
        this.canvasService.width,
        this.canvasService.height
      );
    }
    
    // Call custom render callback if provided (for connections, etc.)
    if (this.customRenderCallback) {
      this.customRenderCallback(ctx);
    }
    
    // Restore original coordinate system
    this.canvasService.restoreTransform();
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
    return this.canvasService.getElement();
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
  public updateGridConfig(config: Partial<import('../coordinateSystems/systems/GridService.js').GridConfig>): void {
    this.gridService.updateConfig(config);
  }

  /**
   * Updates snapping configuration
   */
  public updateSnappingConfig(config: Partial<import('../coordinateSystems/systems/SnappingService.js').SnappingConfig>): void {
    this.snappingService.updateConfig(config);
  }

  /**
   * Gets current grid configuration
   */
  public getGridConfig(): import('../coordinateSystems/systems/GridService.js').GridConfig {
    return this.gridService.getConfig();
  }

  /**
   * Gets current snapping configuration
   */
  public getSnappingConfig(): import('../coordinateSystems/systems/SnappingService.js').SnappingConfig {
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
  public getCoordinateSystem(): MapBetweenCoordinateSystemService {
    return this.coordinateMapping;
  }

  /**
   * Gets the coordinate mapping service instance (preferred method name)
   */
  public getCoordinateMapping(): MapBetweenCoordinateSystemService {
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
