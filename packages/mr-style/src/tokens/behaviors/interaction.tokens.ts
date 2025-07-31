/**
 * Behavior-specific design tokens for interactive states
 * Defines consistent interaction patterns across all visual components
 */
export const InteractionTokens = {
  // Selection behavior
  selected: {
    fill: '#7c3aed',              // Purple selected fill
    border: '#a855f7',            // Bright purple border
    borderWidth: 3,               // Thicker border for emphasis
    glow: '#8b5cf6',              // Purple glow effect
    glowIntensity: 0.7,           // High glow opacity
    shadow: '0 0 12px rgba(139, 92, 246, 0.4)', // Purple shadow
    scale: 1.02,                  // Slight scale increase
    transition: '150ms ease-out'   // Smooth transition
  },
  
  // Hover behavior
  hover: {
    fill: '#06b6d4',              // Cyan hover fill
    border: '#0891b2',            // Darker cyan border
    borderWidth: 2,               // Medium border width
    shadow: '0 4px 12px rgba(6, 182, 212, 0.3)', // Cyan shadow
    scale: 1.05,                  // Noticeable scale increase
    opacity: 0.9,                 // Slightly transparent
    transition: '200ms ease-out',  // Smooth hover transition
    cursor: 'pointer'             // Pointer cursor
  },
  
  // Dragging behavior
  dragging: {
    fill: '#f97316',              // Orange dragging fill
    border: '#ea580c',            // Darker orange border
    borderWidth: 2,               // Medium border
    shadow: '0 8px 24px rgba(249, 115, 22, 0.4)', // Large orange shadow
    scale: 1.1,                   // Larger scale for prominence
    opacity: 0.8,                 // More transparent while dragging
    rotation: 2,                  // Slight rotation (degrees)
    transition: '100ms ease-out',  // Quick response
    zIndex: 1000                  // Bring to front
  },
  
  // Focus behavior (keyboard navigation)
  focus: {
    border: '#3b82f6',            // Blue focus border
    borderWidth: 2,               // Medium border
    outline: '#93c5fd',           // Light blue outline
    outlineWidth: 2,              // Outline thickness
    outlineOffset: 2,             // Space between border and outline
    shadow: '0 0 0 3px rgba(59, 130, 246, 0.2)', // Blue focus ring
    transition: '150ms ease-out'   // Focus transition
  },
  
  // Active/Pressed behavior
  active: {
    fill: '#1d4ed8',              // Darker blue when pressed
    border: '#1e40af',            // Even darker border
    borderWidth: 2,               // Medium border
    shadow: '0 1px 3px rgba(0, 0, 0, 0.2)', // Inset shadow effect
    scale: 0.98,                  // Slightly smaller (pressed in)
    transition: '100ms ease-out'   // Quick press response
  },
  
  // Disabled behavior
  disabled: {
    fill: '#9ca3af',              // Gray disabled fill
    border: '#d1d5db',            // Light gray border
    borderWidth: 1,               // Thin border
    opacity: 0.5,                 // Half opacity
    cursor: 'not-allowed',        // Disabled cursor
    shadow: 'none',               // No shadow
    transition: 'none'            // No transitions when disabled
  },
  
  // Error/Invalid behavior
  error: {
    fill: '#fca5a5',              // Light red fill
    border: '#ef4444',            // Red border
    borderWidth: 2,               // Medium border
    shadow: '0 0 8px rgba(239, 68, 68, 0.3)', // Red shadow
    shake: '0.5s ease-in-out',    // Shake animation duration
    transition: '200ms ease-out'   // Error transition
  },
  
  // Success/Valid behavior
  success: {
    fill: '#86efac',              // Light green fill
    border: '#10b981',            // Green border
    borderWidth: 2,               // Medium border
    shadow: '0 0 8px rgba(16, 185, 129, 0.3)', // Green shadow
    pulse: '1s ease-in-out',      // Pulse animation duration
    transition: '200ms ease-out'   // Success transition
  }
} as const;
