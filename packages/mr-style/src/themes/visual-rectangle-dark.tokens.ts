import { VisualRectangleTokens } from '../tokens/components/visual-rectangle.tokens';
import { InteractionTokens } from '../tokens/behaviors/interaction.tokens';

/**
 * Dark theme variation for VisualRectangle components
 * Overrides base tokens for better dark mode contrast and visibility
 */
export const VisualRectangleDarkTheme = {
  ...VisualRectangleTokens,
  
  // Enhanced colors for dark backgrounds
  fillPrimary: '#60a5fa',        // Lighter blue for better contrast
  fillSecondary: '#34d399',      // Lighter green
  fillAccent: '#fbbf24',         // Lighter amber
  fillNeutral: '#9ca3af',        // Lighter gray
  
  // Adjusted borders for dark theme
  borderDefault: '#6b7280',      // Lighter border for visibility
  
  // Enhanced shadows for depth on dark backgrounds
  shadowDefault: '0 2px 8px rgba(0, 0, 0, 0.4)',
  shadowElevated: '0 4px 16px rgba(0, 0, 0, 0.5)',
  shadowPressed: '0 1px 4px rgba(0, 0, 0, 0.3)',
  
  // Dark theme typography
  textColor: '#f9fafb',          // Light text for dark backgrounds
  textColorInverse: '#1f2937',   // Dark text for light elements
  
  // Interaction overrides for dark theme
  interaction: {
    ...InteractionTokens,
    
    // Enhanced selection for dark backgrounds
    selected: {
      ...InteractionTokens.selected,
      fill: '#8b5cf6',            // Brighter purple
      glow: '#a855f7',            // More vibrant glow
      shadow: '0 0 16px rgba(139, 92, 246, 0.6)' // Stronger shadow
    },
    
    // Adjusted hover for dark theme
    hover: {
      ...InteractionTokens.hover,
      fill: '#22d3ee',            // Brighter cyan
      shadow: '0 4px 16px rgba(34, 211, 238, 0.4)' // Enhanced shadow
    },
    
    // Enhanced dragging visibility
    dragging: {
      ...InteractionTokens.dragging,
      shadow: '0 8px 32px rgba(249, 115, 22, 0.6)' // Stronger shadow
    }
  }
} as const;
