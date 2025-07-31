import { VisualRectangle } from 'mr-web-components';
import { Vector2 } from '@my-graphics/math';
import { CanvasDarkTheme } from 'mr-style';
import { Rope } from '../objects/Rope';

/**
 * Configuration service for the draggable demo
 * Now creates VisualRectangle instances directly using library code
 * Eliminates unnecessary abstraction layer
 */
export class DemoConfig {
  /**
   * Creates the drop zone rectangle
   * Uses Cartesian coordinates with origin at center and mr-style design tokens
   */
  static createDropZone(): VisualRectangle {
    const dropZone = new VisualRectangle(
      'drop-zone',
      { 
        color: CanvasDarkTheme.dropZoneDefault,
        strokeColor: CanvasDarkTheme.borderDefault,
        strokeWidth: CanvasDarkTheme.borderMedium
      },
      CanvasDarkTheme.dropZoneWidth,
      CanvasDarkTheme.dropZoneHeight
    );
    
    // Position in Cartesian coordinates (center horizontally and vertically)
    dropZone.position.x = -CanvasDarkTheme.dropZoneWidth / 2;
    dropZone.position.y = -CanvasDarkTheme.dropZoneHeight / 2;
    dropZone.isDraggable = false;
    
    // Remove connectors from drop zone - it should not have connection points
    dropZone.connectors = [];
    
    return dropZone;
  }

  /**
   * Creates the draggable rectangles
   * Uses Cartesian coordinates with origin at center and mr-style design tokens
   */
  static createDraggableRectangles(): VisualRectangle[] {
    const rectangles: VisualRectangle[] = [];
    const size = CanvasDarkTheme.objectSizeMedium;
    const yPosition = 200; // Position above center (positive Y is up)
    
    // Create first test rectangle
    const rect1 = new VisualRectangle(
      'test-rect-1',
      { 
        color: CanvasDarkTheme.objectPrimary,
        strokeColor: CanvasDarkTheme.borderDefault,
        strokeWidth: CanvasDarkTheme.borderThin
      },
      size,
      size
    );
    rect1.position.x = 0; // Center horizontally
    rect1.position.y = yPosition;
    rect1.isDraggable = true;
    rectangles.push(rect1);
    
    // Create second test rectangle at the same position
    const rect2 = new VisualRectangle(
      'test-rect-2',
      { 
        color: CanvasDarkTheme.objectSecondary,
        strokeColor: CanvasDarkTheme.borderDefault,
        strokeWidth: CanvasDarkTheme.borderThin
      },
      size,
      size
    );
    rect2.position.x = 0; // Same horizontal position
    rect2.position.y = yPosition; // Same vertical position
    rect2.isDraggable = true;
    rectangles.push(rect2);
    
    return rectangles;
  }

  /**
   * Creates a rope that connects the two VisualRectangles
   */
  static createRope(rectangles: VisualRectangle[]): Rope | null {
    if (rectangles.length < 2) {
      console.warn('Need at least 2 rectangles to create a rope');
      return null;
    }

    const rect1 = rectangles[0]; // VR1
    const rect2 = rectangles[1]; // VR2

    // Create rope connecting the two rectangles using design tokens
    const rope = new Rope(
      'rope-vr1-vr2',
      rect1,
      rect2,
      'thick', // Line variant
      'solid' // Line style
    );

    console.log('🔗 ROPE CREATED:', {
      ropeId: rope.id,
      startRect: rect1.id,
      endRect: rect2.id,
      connectionInfo: rope.getConnectionInfo()
    });

    return rope;
  }

  /**
   * Creates all rectangles for the demo
   */
  static createAllRectangles(): {
    dropZone: VisualRectangle;
    draggableRectangles: VisualRectangle[];
  } {
    return {
      dropZone: this.createDropZone(),
      draggableRectangles: this.createDraggableRectangles()
    };
  }
}
