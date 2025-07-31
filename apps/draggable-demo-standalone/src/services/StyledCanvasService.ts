import { CanvasDarkTheme } from 'mr-style';

/**
 * Service for applying mr-style design tokens to canvas styling
 * Provides consistent theming and professional visual appearance
 */
export class StyledCanvasService {
  private theme = CanvasDarkTheme;

  /**
   * Applies styled background to the canvas element
   */
  applyCanvasStyles(canvas: HTMLCanvasElement): void {
    const container = canvas.parentElement;
    if (container) {
      // Apply container styles using design tokens
      container.style.background = `linear-gradient(135deg, ${this.theme.canvasBackground} 0%, #1f1f1f 100%)`;
      container.style.borderRadius = '8px';
      container.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
      container.style.border = `1px solid ${this.theme.borderDefault}`;
      container.style.overflow = 'hidden';
    }

    // Apply canvas-specific styles
    canvas.style.display = 'block';
    canvas.style.cursor = 'crosshair';
    canvas.style.transition = 'all 0.2s ease';
  }

  /**
   * Gets styled colors for canvas objects based on their type
   */
  getObjectColors(type: 'primary' | 'secondary' | 'accent' | 'neutral' = 'primary') {
    const baseColor = this.theme[`object${type.charAt(0).toUpperCase() + type.slice(1)}`];
    
    return {
      fill: baseColor,
      stroke: this.theme.borderDefault,
      hover: this.theme.objectHover,
      selected: this.theme.objectSelected,
      dragging: this.theme.objectDragging
    };
  }

  /**
   * Gets drop zone styling
   */
  getDropZoneColors() {
    return {
      default: this.theme.dropZoneDefault,
      active: this.theme.dropZoneActive,
      invalid: this.theme.dropZoneInvalid,
      border: this.theme.borderDefault
    };
  }

  /**
   * Gets grid styling configuration
   */
  getGridConfig() {
    return {
      primary: this.theme.gridPrimary,
      secondary: this.theme.gridSecondary,
      axis: this.theme.gridAxis,
      size: this.theme.gridSizeMedium,
      opacity: this.theme.alphaMedium
    };
  }

  /**
   * Gets snapping guide styling
   */
  getSnapGuideConfig() {
    return {
      guide: this.theme.snapGuide,
      point: this.theme.snapPoint,
      distance: this.theme.snapDistanceMedium,
      opacity: this.theme.alphaHigh
    };
  }

  /**
   * Applies hover effect to canvas
   */
  applyHoverEffect(canvas: HTMLCanvasElement, isHovering: boolean): void {
    if (isHovering) {
      canvas.style.boxShadow = `0 0 20px ${this.theme.objectHover}40`;
      canvas.style.transform = 'scale(1.01)';
    } else {
      canvas.style.boxShadow = 'none';
      canvas.style.transform = 'scale(1)';
    }
  }

  /**
   * Creates professional gradient backgrounds for objects
   */
  createGradient(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string): CanvasGradient {
    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.5, this.adjustBrightness(color, 20));
    gradient.addColorStop(1, this.adjustBrightness(color, -20));
    return gradient;
  }

  /**
   * Utility to adjust color brightness
   */
  private adjustBrightness(color: string, percent: number): string {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const adjustedR = Math.max(0, Math.min(255, r + (r * percent / 100)));
    const adjustedG = Math.max(0, Math.min(255, g + (g * percent / 100)));
    const adjustedB = Math.max(0, Math.min(255, b + (b * percent / 100)));

    return `#${Math.round(adjustedR).toString(16).padStart(2, '0')}${Math.round(adjustedG).toString(16).padStart(2, '0')}${Math.round(adjustedB).toString(16).padStart(2, '0')}`;
  }
}
