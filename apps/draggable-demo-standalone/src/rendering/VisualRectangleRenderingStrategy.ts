import { BaseRenderingStrategy } from './IRenderingStrategy';
import { VisualRectangle } from 'mr-web-components';

/**
 * Rendering strategy specifically for VisualRectangle objects
 * Follows Open/Closed Principle and Single Responsibility Principle
 */
export class VisualRectangleRenderingStrategy extends BaseRenderingStrategy<VisualRectangle> {
  constructor() {
    super(10); // High priority for VisualRectangle objects
  }

  canRender(object: unknown): object is VisualRectangle {
    return object instanceof VisualRectangle;
  }

  render(ctx: CanvasRenderingContext2D, rectangle: VisualRectangle): void {
    // Use the rectangle's built-in render method
    // This delegates to the object's own rendering logic
    if ('render' in rectangle && typeof rectangle.render === 'function') {
      rectangle.render(ctx);
    } else {
      // Fallback rendering if render method is not available
      this.renderFallback(ctx, rectangle);
    }
  }

  /**
   * Fallback rendering method for VisualRectangle
   * Used if the object doesn't have its own render method
   */
  private renderFallback(ctx: CanvasRenderingContext2D, rectangle: VisualRectangle): void {
    const fillColor = rectangle.color?.color || '#0066cc';
    const borderColor = rectangle.color?.borderColor || '#004499';
    const borderWidth = rectangle.color?.borderWidth || 1;

    // Draw the rectangle
    ctx.fillStyle = fillColor;
    ctx.fillRect(rectangle.position.x, rectangle.position.y, rectangle.Width, rectangle.Height);

    // Draw border if specified
    if (borderWidth > 0) {
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderWidth;
      ctx.strokeRect(rectangle.position.x, rectangle.position.y, rectangle.Width, rectangle.Height);
    }

    // Draw selection indicator if selected
    if (rectangle.selected) {
      const selectionColor = '#10b981'; // Green selection
      const selectionWidth = 2;
      const selectionOffset = 2;
      
      ctx.strokeStyle = selectionColor;
      ctx.lineWidth = selectionWidth;
      ctx.strokeRect(
        rectangle.position.x - selectionOffset, 
        rectangle.position.y - selectionOffset, 
        rectangle.Width + (selectionOffset * 2), 
        rectangle.Height + (selectionOffset * 2)
      );
    }
  }
}
