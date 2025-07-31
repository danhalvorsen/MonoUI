import type { DragCapableHost } from 'mr-web-components';
import type { IVisualObject } from 'mr-abstract-components';
import { Vector2, Rectangle } from '@my-graphics/math';
import type { IPoint, ICoordinateSystem } from '../coordinates/ICoordinateSystem.js';
import type { CartesianDragCapableHost } from '../controllers/CartesianDragController.js';

// Type guard to check if an object has a boundRectangle property
interface IVisualObjectWithBounds extends IVisualObject {
  boundRectangle: Rectangle;
}

function hasBoundRectangle(obj: IVisualObject): obj is IVisualObjectWithBounds {
  return 'boundRectangle' in obj && obj.boundRectangle instanceof Rectangle;
}

/**
 * Service that provides drag host functionality for canvas-based applications
 * Follows Single Responsibility Principle - only handles drag host concerns
 */
export class DragHostService implements CartesianDragCapableHost {
  private _canvas: HTMLCanvasElement;
  private draggableObjects: IVisualObject[];
  public coordinateSystem: ICoordinateSystem<IPoint>;

  constructor(canvas: HTMLCanvasElement, draggableObjects: IVisualObject[], coordinateSystem: ICoordinateSystem<IPoint>) {
    this._canvas = canvas;
    this.draggableObjects = draggableObjects;
    this.coordinateSystem = coordinateSystem;
  }

  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  /**
   * Finds the topmost draggable object at the given coordinates
   * Expects coordinates to already be in Cartesian format from CartesianDragController
   * Uses hit-testing algorithm to determine object intersection
   */
  getObjectAt(x: number, y: number): IVisualObject | null {
    // Coordinates are already in Cartesian format when passed from CartesianDragController
    // No need for additional coordinate conversion
    
    // Iterate from top to bottom (last drawn = topmost)
    for (let i = this.draggableObjects.length - 1; i >= 0; i--) {
      const obj = this.draggableObjects[i];
      if (this.isPointInObject(x, y, obj)) {
        return obj;
      }
    }
    return null;
  }

  /**
   * Determines if a point intersects with a visual object
   * Uses the Rectangle.contains method for accurate hit-testing
   * Can be extended for different object shapes
   */
  private isPointInObject(x: number, y: number, obj: IVisualObject): boolean {
    // Use the Rectangle.contains method if available for more accurate hit-testing
    if (hasBoundRectangle(obj)) {
      const point = new Vector2(x, y);
      
      console.log('🔍 HIT TEST DETAILS:', {
        testPoint: { x, y },
        objectPosition: obj.position,
        objectSize: obj.size,
        boundRectangleVertices: obj.boundRectangle.vertices,
        containsResult: obj.boundRectangle.contains(point)
      });
      
      return obj.boundRectangle.contains(point);
    }
    
    // Fallback to manual bounds checking for objects without boundRectangle
    return (
      obj.position.x <= x &&
      x <= obj.position.x + obj.size.width &&
      obj.position.y <= y &&
      y <= obj.position.y + obj.size.height
    );
  }

  /**
   * Updates the list of draggable objects
   */
  updateDraggableObjects(objects: IVisualObject[]): void {
    this.draggableObjects = objects;
  }

  /**
   * Updates the coordinate system
   */
  updateCoordinateSystem(coordinateSystem: ICoordinateSystem<IPoint>): void {
    this.coordinateSystem = coordinateSystem;
  }

  // ReactiveControllerHost implementation
  requestUpdate(): void {
    // No-op for this standalone implementation
    // In a real Lit component, this would trigger a re-render
  }

  addController(controller: any): void {
    // Connect the controller to the host
    if (controller && typeof controller.hostConnected === 'function') {
      controller.hostConnected();
    }
  }

  removeController(controller: any): void {
    // Disconnect the controller from the host
    if (controller && typeof controller.hostDisconnected === 'function') {
      controller.hostDisconnected();
    }
  }

  readonly updateComplete: Promise<boolean> = Promise.resolve(true);
}
