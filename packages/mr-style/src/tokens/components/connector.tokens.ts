/**
 * Component-specific design tokens for Connectors
 * Defines the visual identity and styling properties for connector anchor points
 */
export const ConnectorTokens = {
  // Base appearance
  fillDefault: '#6366f1',        // Indigo - default connector
  fillActive: '#3b82f6',         // Blue - active/hovered connector
  fillConnected: '#10b981',      // Green - connected connector
  fillDisabled: '#9ca3af',       // Gray - disabled connector
  fillError: '#ef4444',          // Red - error/invalid connector
  
  // Borders and outlines
  borderDefault: '#4f46e5',      // Default border color
  borderActive: '#2563eb',       // Active border color
  borderConnected: '#059669',    // Connected border color
  borderWidth: 1,               // Standard border width
  borderWidthActive: 2,         // Active border width
  borderRadius: 2,              // Corner radius for slightly rounded squares
  
  // Sizing (square dimensions)
  sizeSmall: 8,                 // Small connector square size (8x8px)
  sizeDefault: 12,              // Default connector square size (12x12px)
  sizeLarge: 16,                // Large connector square size (16x16px)
  
  // Shadows and depth
  shadowDefault: '0 2px 4px rgba(99, 102, 241, 0.2)',
  shadowActive: '0 4px 8px rgba(59, 130, 246, 0.3)',
  shadowConnected: '0 3px 6px rgba(16, 185, 129, 0.25)',
  
  // Animation and transitions
  transitionDuration: '200ms',   // Standard transition duration
  transitionEasing: 'ease-in-out', // Transition easing
  
  // Hover and interaction states
  hoverScale: 1.2,              // Scale factor on hover
  activeScale: 1.1,             // Scale factor when active
  
  // Connection line styling
  connectionStroke: '#6366f1',   // Default connection line color
  connectionStrokeWidth: 2,      // Connection line width
  connectionStrokeActive: '#3b82f6', // Active connection line color
  connectionStrokeWidthActive: 3, // Active connection line width
  
  // Typography (for connector labels)
  labelColor: '#374151',         // Label text color
  labelFontSize: 12,            // Label font size
  labelFontWeight: 500,         // Label font weight
  
  // Spacing and positioning
  offsetFromEdge: 4,            // Distance from parent object edge
  labelOffset: 16,              // Distance of label from connector
  
  // Z-index for layering
  zIndex: 100,                  // Base z-index for connectors
  zIndexActive: 110,            // Z-index for active connectors
  zIndexConnected: 105,         // Z-index for connected connectors
} as const;

export type ConnectorTokens = typeof ConnectorTokens;
