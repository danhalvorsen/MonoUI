import type { ReactiveController, ReactiveControllerHost } from "lit";
import type { IVisualObject } from 'mr-abstract-components';
import { Vector2 } from '@my-graphics/math';
import type { IPoint, ICoordinateSystem } from '../Helpers/IMapCoordinateSystem.js';

// Host type for canvas-enabled components with Cartesian coordinate support
export type CartesianDragCapableHost = ReactiveControllerHost & {
  canvas?: HTMLCanvasElement;
  getObjectAt?(x: number, y: number): IVisualObject | null;
  coordinateSystem: ICoordinateSystem<IPoint>;
};

/**
 * Drag controller that properly handles Cartesian coordinate transformations
 * Extends the basic drag functionality to work with coordinate system transformations
 */
export class CartesianDragController implements ReactiveController {
  private host?: CartesianDragCapableHost;
  private isDragging = false;
  private dragTarget: IVisualObject | null = null;

  private lastMouseX = 0;
  private lastMouseY = 0;
  private dragStartX = 0;
  private dragStartY = 0;
  private mouseDownX = 0;
  private mouseDownY = 0;
  private hasSignificantMovement = false;

  private static readonly DRAG_THRESHOLD = 3; // pixels

  constructor(host?: CartesianDragCapableHost) {
    if (host) this.setHost(host);
  }

  setHost(host: CartesianDragCapableHost) {
    this.host = host;
    if (this.host && 'addController' in this.host && typeof this.host.addController === 'function') {
      this.host.addController(this);
    }
  }

  hostConnected() {
    this.addEventListeners();
  }

  hostDisconnected() {
    this.removeEventListeners();
  }

  private addEventListeners() {
    if (!this.host?.canvas) return;
    this.host.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.host.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.host.canvas.addEventListener('mouseup', this.handleMouseUp);
    this.host.canvas.addEventListener('mouseleave', this.handleMouseUp);
  }

  private removeEventListeners() {
    if (!this.host?.canvas) return;
    this.host.canvas.removeEventListener('mousedown', this.handleMouseDown);
    this.host.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.host.canvas.removeEventListener('mouseup', this.handleMouseUp);
    this.host.canvas.removeEventListener('mouseleave', this.handleMouseUp);
  }

  private handleMouseDown = (event: MouseEvent) => {
    if (!this.host?.getObjectAt) return;

    console.log('🖱️ MOUSE DOWN:', {
      clientX: event.clientX,
      clientY: event.clientY,
      hasCanvas: !!this.host.canvas,
      hasGetObjectAt: !!this.host.getObjectAt,
      hasCoordinateSystem: !!this.host.coordinateSystem
    });

    const rect = this.host.canvas!.getBoundingClientRect();
    const scaleX = this.host.canvas!.width / this.host.canvas!.clientWidth;
    const scaleY = this.host.canvas!.height / this.host.canvas!.clientHeight;

    // Convert mouse coordinates to canvas coordinates
    const canvasX = (event.clientX - rect.left) * scaleX;
    const canvasY = (event.clientY - rect.top) * scaleY;

    // Convert canvas coordinates to canonical coordinates
    const canonicalPoint = this.host.coordinateSystem.toCanonical({ x: canvasX, y: canvasY });
    
    // Convert canonical coordinates to Cartesian coordinates to match boundRectangle
    // boundRectangle uses object position directly (Cartesian coordinates)
    // We need to scale canonical coordinates to match the object coordinate system
    const canvasWidth = this.host.canvas!.width;
    const canvasHeight = this.host.canvas!.height;
    
    // Convert from canonical (-width/2 to +width/2) to Cartesian coordinates
    // that match how objects are positioned in DemoConfig
    const cartesianPoint = {
      x: canonicalPoint.x,
      y: canonicalPoint.y
    };
    
    console.log('🎯 HIT TEST:', {
      screenCoords: { x: event.clientX, y: event.clientY },
      canvasCoords: { x: canvasX, y: canvasY },
      canonicalCoords: canonicalPoint,
      cartesianCoords: cartesianPoint,
      canvasSize: { width: this.host.canvas!.width, height: this.host.canvas!.height },
      clientSize: { width: this.host.canvas!.clientWidth, height: this.host.canvas!.clientHeight }
    });
    
    const target = this.host.getObjectAt(cartesianPoint.x, cartesianPoint.y);
    
    console.log('🎯 HIT RESULT:', {
      foundTarget: !!target,
      targetType: target?.constructor?.name,
      targetPosition: target?.position,
      targetIsDraggable: target?.isDraggable
    });

    if (target) {
      this.dragTarget = target;
      this.lastMouseX = canvasX;
      this.lastMouseY = canvasY;
      this.mouseDownX = canvasX;
      this.mouseDownY = canvasY;
      this.dragStartX = target.position.x;
      this.dragStartY = target.position.y;
      this.hasSignificantMovement = false;
      event.preventDefault();
    }
  };

  private handleMouseMove = (event: MouseEvent) => {
    if (!this.dragTarget || !this.host?.canvas) return;

    const rect = this.host.canvas.getBoundingClientRect();
    const scaleX = this.host.canvas.width / this.host.canvas.clientWidth;
    const scaleY = this.host.canvas.height / this.host.canvas.clientHeight;

    // Convert mouse coordinates to canvas coordinates
    const canvasX = (event.clientX - rect.left) * scaleX;
    const canvasY = (event.clientY - rect.top) * scaleY;

    const totalDeltaX = canvasX - this.mouseDownX;
    const totalDeltaY = canvasY - this.mouseDownY;
    const totalDistance = Math.sqrt(totalDeltaX ** 2 + totalDeltaY ** 2);

    if (!this.hasSignificantMovement && totalDistance > CartesianDragController.DRAG_THRESHOLD) {
      this.hasSignificantMovement = true;
      this.isDragging = true;
      console.log('🎯 DRAG START:', {
        target: this.dragTarget,
        position: { x: this.dragTarget.position.x, y: this.dragTarget.position.y },
        isDraggable: this.dragTarget.isDraggable,
        hasOnDragStart: !!this.dragTarget.onDragStart
      });

      if (this.dragTarget.onDragStart && this.dragTarget.isDraggable !== false) {
        this.dragTarget.onDragStart(event);
      }
      if (this.host.canvas) {
        this.host.canvas.style.cursor = 'grabbing';
      }
    }

    if (this.isDragging && this.dragTarget.isDraggable !== false) {
      // Calculate screen delta first
      const screenDeltaX = canvasX - this.lastMouseX;
      const screenDeltaY = canvasY - this.lastMouseY;
      
      // Convert screen delta to canonical delta
      // In canonical space: Y is flipped, so screen +Y becomes canonical -Y
      const canonicalDeltaX = screenDeltaX;
      const canonicalDeltaY = -screenDeltaY; // Flip Y delta for canonical space

      console.log('🔄 DRAG DELTA:', {
        screenDelta: { x: canvasX - this.lastMouseX, y: canvasY - this.lastMouseY },
        canonicalDelta: { x: canonicalDeltaX, y: canonicalDeltaY },
        currentPos: this.dragTarget.position,
        newPos: { x: this.dragTarget.position.x + canonicalDeltaX, y: this.dragTarget.position.y + canonicalDeltaY }
      });

      // Apply the canonical deltas to the object position
      // Use Vector2 constructor to create new position, which triggers the position setter
      // and automatically updates the boundRectangle
      const newPosition = new Vector2(
        this.dragTarget.position.x + canonicalDeltaX,
        this.dragTarget.position.y + canonicalDeltaY
      );
      this.dragTarget.position = newPosition;

      if (this.dragTarget.onDrag) {
        this.dragTarget.onDrag(event, canonicalDeltaX, canonicalDeltaY);
      }

      this.host.requestUpdate();
    }

    this.lastMouseX = canvasX;
    this.lastMouseY = canvasY;
  };

  private handleMouseUp = (event: MouseEvent) => {
    if (!this.dragTarget) return;

    if (this.isDragging && this.hasSignificantMovement) {
      console.log('🏁 DRAG END:', {
        target: this.dragTarget,
        finalPosition: { x: this.dragTarget.position.x, y: this.dragTarget.position.y },
        hasOnDragEnd: !!this.dragTarget.onDragEnd
      });
      if (this.dragTarget.onDragEnd) {
        this.dragTarget.onDragEnd(event);
      }
    } else if ('selected' in this.dragTarget) {
      (this.dragTarget as any).selected = !(this.dragTarget as any).selected;
    }

    if (this.host?.canvas) {
      this.host.canvas.style.cursor = 'default';
    }

    this.isDragging = false;
    this.dragTarget = null;
    this.hasSignificantMovement = false;
  };

  /**
   * Gets the currently dragged object
   */
  getDragTarget(): IVisualObject | null {
    return this.dragTarget;
  }

  /**
   * Checks if currently dragging
   */
  getIsDragging(): boolean {
    return this.isDragging;
  }
}
