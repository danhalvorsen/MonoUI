/**
 * Design tokens for Rope visual objects
 * Follows mr-design system principles for consistent styling
 */
export interface IRopeTokens {
  // Line styling
  lineWidth: number;
  lineWidthThin: number;
  lineWidthMedium: number;
  lineWidthThick: number;
  
  // Colors
  lineColorDefault: string;
  lineColorActive: string;
  lineColorSelected: string;
  lineColorDisabled: string;
  
  // Endpoint styling
  endpointRadius: number;
  endpointColorDefault: string;
  endpointColorActive: string;
  endpointColorSelected: string;
  
  // Text/Info styling
  infoBackgroundColor: string;
  infoTextColor: string;
  infoFontSize: string;
  infoFontFamily: string;
  infoPadding: number;
  
  // Dash patterns
  dashPatternDefault: number[];
  dashPatternDotted: number[];
  dashPatternDashed: number[];
  
  // Animation
  animationDuration: string;
  animationEasing: string;
  
  // Physics and interaction states
  tensionColorLow: string;
  tensionColorMedium: string;
  tensionColorHigh: string;
  draggingOpacity: number;
  draggingLineWidth: number;
  
  // Connection indicators
  connectionPointRadius: number;
  connectionPointColor: string;
  connectionPointBorderWidth: number;
  connectionPointBorderColor: string;
  
  // Hover and focus states
  hoverLineWidth: number;
  hoverOpacity: number;
  focusOutlineWidth: number;
  focusOutlineColor: string;
  focusOutlineOffset: number;
  
  // Rope segments and physics
  segmentHighlightColor: string;
  segmentHighlightWidth: number;
  physicsDebugColor: string;
  physicsDebugWidth: number;
}

/**
 * Default rope tokens for light theme
 */
export const RopeTokensLight: IRopeTokens = {
  // Line styling
  lineWidth: 3,
  lineWidthThin: 2,
  lineWidthMedium: 3,
  lineWidthThick: 5,
  
  // Colors - Purple theme for ropes
  lineColorDefault: '#8b5cf6',    // Purple-500
  lineColorActive: '#7c3aed',     // Purple-600
  lineColorSelected: '#6d28d9',   // Purple-700
  lineColorDisabled: '#d1d5db',   // Gray-300
  
  // Endpoint styling
  endpointRadius: 4,
  endpointColorDefault: '#4c1d95', // Purple-900
  endpointColorActive: '#581c87',  // Purple-800
  endpointColorSelected: '#6d28d9', // Purple-700
  
  // Text/Info styling
  infoBackgroundColor: 'rgba(0, 0, 0, 0.8)',
  infoTextColor: '#ffffff',
  infoFontSize: '12px',
  infoFontFamily: 'Arial, sans-serif',
  infoPadding: 4,
  
  // Dash patterns
  dashPatternDefault: [],
  dashPatternDotted: [2, 3],
  dashPatternDashed: [10, 5],
  
  // Animation
  animationDuration: '0.2s',
  animationEasing: 'ease-in-out',
  
  // Physics and interaction states
  tensionColorLow: '#10b981',      // Green-500 - low tension
  tensionColorMedium: '#f59e0b',   // Amber-500 - medium tension
  tensionColorHigh: '#ef4444',     // Red-500 - high tension
  draggingOpacity: 0.6,
  draggingLineWidth: 4,
  
  // Connection indicators
  connectionPointRadius: 6,
  connectionPointColor: '#1f2937', // Gray-800
  connectionPointBorderWidth: 2,
  connectionPointBorderColor: '#ffffff',
  
  // Hover and focus states
  hoverLineWidth: 4,
  hoverOpacity: 0.8,
  focusOutlineWidth: 2,
  focusOutlineColor: '#3b82f6',    // Blue-500
  focusOutlineOffset: 2,
  
  // Rope segments and physics
  segmentHighlightColor: '#fbbf24', // Amber-400
  segmentHighlightWidth: 5,
  physicsDebugColor: '#ec4899',     // Pink-500
  physicsDebugWidth: 1
};

/**
 * Dark theme rope tokens
 */
export const RopeTokensDark: IRopeTokens = {
  ...RopeTokensLight,
  
  // Adjusted colors for dark theme
  lineColorDefault: '#a78bfa',    // Purple-400 (lighter for dark bg)
  lineColorActive: '#8b5cf6',     // Purple-500
  lineColorSelected: '#7c3aed',   // Purple-600
  lineColorDisabled: '#4b5563',   // Gray-600
  
  endpointColorDefault: '#c4b5fd', // Purple-300
  endpointColorActive: '#a78bfa',  // Purple-400
  endpointColorSelected: '#8b5cf6', // Purple-500
  
  infoBackgroundColor: 'rgba(255, 255, 255, 0.9)',
  infoTextColor: '#1f2937', // Gray-800
  
  // Physics and interaction states (adjusted for dark theme)
  tensionColorLow: '#34d399',      // Green-400 - low tension
  tensionColorMedium: '#fbbf24',   // Amber-400 - medium tension
  tensionColorHigh: '#f87171',     // Red-400 - high tension
  draggingOpacity: 0.7,
  draggingLineWidth: 4,
  
  // Connection indicators (adjusted for dark theme)
  connectionPointRadius: 6,
  connectionPointColor: '#f9fafb', // Gray-50
  connectionPointBorderWidth: 2,
  connectionPointBorderColor: '#1f2937', // Gray-800
  
  // Hover and focus states (adjusted for dark theme)
  hoverLineWidth: 4,
  hoverOpacity: 0.9,
  focusOutlineWidth: 2,
  focusOutlineColor: '#60a5fa',    // Blue-400
  focusOutlineOffset: 2,
  
  // Rope segments and physics (adjusted for dark theme)
  segmentHighlightColor: '#fcd34d', // Amber-300
  segmentHighlightWidth: 5,
  physicsDebugColor: '#f472b6',     // Pink-400
  physicsDebugWidth: 1
};

/**
 * Rope token service for managing rope styling
 */
export class RopeTokenService {
  private tokens: IRopeTokens;

  constructor(tokens: IRopeTokens = RopeTokensLight) {
    this.tokens = tokens;
  }

  /**
   * Updates the token set (for theme switching)
   */
  updateTokens(tokens: IRopeTokens): void {
    this.tokens = tokens;
  }

  /**
   * Gets line width based on variant
   */
  getLineWidth(variant: 'thin' | 'medium' | 'thick' = 'medium'): number {
    switch (variant) {
      case 'thin': return this.tokens.lineWidthThin;
      case 'thick': return this.tokens.lineWidthThick;
      default: return this.tokens.lineWidthMedium;
    }
  }

  /**
   * Gets line color based on state
   */
  getLineColor(state: 'default' | 'active' | 'selected' | 'disabled' = 'default'): string {
    switch (state) {
      case 'active': return this.tokens.lineColorActive;
      case 'selected': return this.tokens.lineColorSelected;
      case 'disabled': return this.tokens.lineColorDisabled;
      default: return this.tokens.lineColorDefault;
    }
  }

  /**
   * Gets endpoint color based on state
   */
  getEndpointColor(state: 'default' | 'active' | 'selected' = 'default'): string {
    switch (state) {
      case 'active': return this.tokens.endpointColorActive;
      case 'selected': return this.tokens.endpointColorSelected;
      default: return this.tokens.endpointColorDefault;
    }
  }

  /**
   * Gets dash pattern based on style
   */
  getDashPattern(style: 'solid' | 'dotted' | 'dashed' = 'solid'): number[] {
    switch (style) {
      case 'dotted': return this.tokens.dashPatternDotted;
      case 'dashed': return this.tokens.dashPatternDashed;
      default: return this.tokens.dashPatternDefault;
    }
  }

  /**
   * Gets all tokens (for direct access)
   */
  getTokens(): IRopeTokens {
    return { ...this.tokens };
  }
}
