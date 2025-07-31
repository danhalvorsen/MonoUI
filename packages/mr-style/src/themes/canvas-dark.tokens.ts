import { CanvasTokens } from '../tokens/canvas.tokens';
import { CanvasSpacingTokens } from '../tokens/canvas-spacing.tokens';

/**
 * Dark theme for canvas applications
 * Extends base canvas tokens with dark theme overrides
 */
export const CanvasDarkTheme = {
  ...CanvasTokens,
  ...CanvasSpacingTokens,
  
  // Dark theme specific overrides
  canvasBackground: '#0f0f0f',
  gridPrimary: '#2a2a2a',
  gridSecondary: '#1f1f1f',
  gridAxis: '#404040',
  
  // Enhanced contrast for dark theme
  objectPrimary: '#60a5fa',      // Lighter blue for better contrast
  objectSecondary: '#34d399',    // Lighter green
  objectAccent: '#fbbf24',       // Lighter amber
  
  // Drop zones with better dark theme visibility
  dropZoneDefault: '#1f2937',
  dropZoneActive: '#065f46',
  dropZoneInvalid: '#991b1b'
};
