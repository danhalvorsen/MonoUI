/**
 * Canvas-specific design tokens for interactive graphics
 * Follows mr-style token-based design system patterns
 */
export const CanvasTokens = {
  // Canvas background and grid
  canvasBackground: '#1a1a1a',
  gridPrimary: '#333333',
  gridSecondary: '#2a2a2a',
  gridAxis: '#444444',
  
  // Object colors with semantic meaning
  objectPrimary: '#3b82f6',      // Blue - primary interactive
  objectSecondary: '#10b981',    // Green - secondary interactive  
  objectAccent: '#f59e0b',       // Amber - accent/warning
  objectDanger: '#ef4444',       // Red - danger/error
  objectNeutral: '#6b7280',      // Gray - neutral/disabled
  
  // Object states
  objectSelected: '#8b5cf6',     // Purple - selected state
  objectHover: '#06b6d4',        // Cyan - hover state
  objectDragging: '#f97316',     // Orange - dragging state
  
  // Selection styling
  selectedBorder: '#a855f7',     // Bright purple - selected border
  selectedGlow: '#8b5cf6',       // Purple glow - selected highlight
  selectedBackground: '#7c3aed', // Darker purple - selected fill overlay
  
  // Drop zones and targets
  dropZoneDefault: '#374151',    // Dark gray - default drop zone
  dropZoneActive: '#059669',     // Green - active drop zone
  dropZoneInvalid: '#dc2626',    // Red - invalid drop zone
  
  // Snapping and guides
  snapGuide: '#fbbf24',          // Yellow - snap guides
  snapPoint: '#34d399',          // Light green - snap points
  
  // Borders and outlines
  borderDefault: '#4b5563',      // Gray border
  borderSelected: '#a855f7',     // Bright purple selected border
  borderHover: '#06b6d4',        // Cyan hover border
  
  // Selection border widths
  borderSelectedWidth: 3,        // Thicker border for selected state
  borderHoverWidth: 2,           // Medium border for hover state
  
  // Transparency levels
  alphaLow: 0.1,
  alphaMedium: 0.3,
  alphaHigh: 0.7,
  alphaFull: 1.0
};
