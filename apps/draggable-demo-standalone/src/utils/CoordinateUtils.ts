import { ICoordinateSystem } from '../Helpers/IMapCoordinateSystem';
import { IPoint } from '../Helpers/IMapCoordinateSystem';

/**
 * Utility class for common coordinate conversion operations
 * Follows DRY principle by centralizing coordinate logic
 */
export class CoordinateUtils {
  /**
   * Converts mouse event coordinates to canvas coordinates
   * Handles canvas scaling and positioning
   */
  static mouseEventToCanvasCoordinates(
    event: MouseEvent, 
    canvas: HTMLCanvasElement
  ): IPoint {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / canvas.clientWidth;
    const scaleY = canvas.height / canvas.clientHeight;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  }

  /**
   * Converts mouse event coordinates directly to canonical coordinates
   * Combines mouse-to-canvas and canvas-to-canonical conversions
   */
  static mouseEventToCanonicalCoordinates(
    event: MouseEvent,
    canvas: HTMLCanvasElement,
    coordinateSystem: ICoordinateSystem<IPoint>
  ): IPoint {
    const canvasCoords = this.mouseEventToCanvasCoordinates(event, canvas);
    return coordinateSystem.toCanonical(canvasCoords);
  }

  /**
   * Calculates screen delta and converts to canonical delta
   * Handles Y-axis flipping for drag operations
   */
  static calculateCanonicalDelta(
    currentCanvasCoords: IPoint,
    lastCanvasCoords: IPoint
  ): IPoint {
    const screenDeltaX = currentCanvasCoords.x - lastCanvasCoords.x;
    const screenDeltaY = currentCanvasCoords.y - lastCanvasCoords.y;
    
    // Convert screen delta to canonical delta (flip Y)
    return {
      x: screenDeltaX,
      y: -screenDeltaY // Flip Y axis for canonical space
    };
  }

  /**
   * Validates that coordinates are within canvas bounds
   */
  static isWithinCanvasBounds(
    coords: IPoint,
    canvasWidth: number,
    canvasHeight: number
  ): boolean {
    return coords.x >= 0 && 
           coords.x <= canvasWidth && 
           coords.y >= 0 && 
           coords.y <= canvasHeight;
  }

  /**
   * Clamps coordinates to canvas bounds
   */
  static clampToCanvasBounds(
    coords: IPoint,
    canvasWidth: number,
    canvasHeight: number
  ): IPoint {
    return {
      x: Math.max(0, Math.min(canvasWidth, coords.x)),
      y: Math.max(0, Math.min(canvasHeight, coords.y))
    };
  }
}
