/**
 * Component-specific design tokens for VisualRectangle
 * Defines the visual identity and styling properties specific to rectangle components
 */
export const VisualRectangleTokens = {
  // Base appearance
  fillPrimary: '#3b82f6',        // Blue - primary rectangles
  fillSecondary: '#10b981',      // Green - secondary rectangles
  fillAccent: '#f59e0b',         // Amber - accent rectangles
  fillNeutral: '#6b7280',        // Gray - neutral/disabled rectangles
  fillDanger: '#ef4444',         // Red - error/danger rectangles
  
  // Borders and outlines
  borderDefault: '#4b5563',      // Default border color
  borderWidth: 1,               // Standard border width
  borderRadius: 4,              // Corner radius for rounded rectangles
  
  // Shadows and depth
  shadowDefault: '0 2px 4px rgba(0, 0, 0, 0.1)',
  shadowElevated: '0 4px 8px rgba(0, 0, 0, 0.15)',
  shadowPressed: '0 1px 2px rgba(0, 0, 0, 0.1)',
  
  // Sizing and spacing
  paddingDefault: 8,            // Internal padding
  marginDefault: 4,             // External margin
  minWidth: 40,                 // Minimum width
  minHeight: 40,                // Minimum height
  
  // Typography (for rectangles with text)
  textColor: '#1f2937',         // Dark text on light backgrounds
  textColorInverse: '#f9fafb',  // Light text on dark backgrounds
  fontSize: 14,                 // Default font size
  fontWeight: 500,              // Medium font weight
  
  // Opacity levels
  opacityDefault: 1.0,          // Fully opaque
  opacityDisabled: 0.5,         // Disabled state
  opacitySubtle: 0.8,           // Subtle/secondary
} as const;
