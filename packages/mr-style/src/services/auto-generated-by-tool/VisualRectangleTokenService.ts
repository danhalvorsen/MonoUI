/**
 * Injectable service providing visual rectangle design tokens
 * This represents what mr-style-cli would generate from our rectangle tokens
 */
export class VisualRectangleTokenService {
  // Base appearance
  fillPrimary = '#3b82f6';        // Blue - primary rectangles
  fillSecondary = '#10b981';      // Green - secondary rectangles
  fillAccent = '#f59e0b';         // Amber - accent rectangles
  fillNeutral = '#6b7280';        // Gray - neutral/disabled rectangles
  fillDanger = '#ef4444';         // Red - error/danger rectangles
  
  // Borders and outlines
  borderDefault = '#4b5563';      // Default border color
  borderWidth = 1;               // Standard border width
  borderRadius = 4;              // Corner radius for rounded rectangles
  
  // Shadows and depth
  shadowDefault = '0 2px 4px rgba(0, 0, 0, 0.1)';
  shadowElevated = '0 4px 8px rgba(0, 0, 0, 0.15)';
  shadowPressed = '0 1px 2px rgba(0, 0, 0, 0.1)';
  
  // Sizing and spacing
  paddingDefault = 8;            // Internal padding
  marginDefault = 4;             // External margin
  minWidth = 40;                 // Minimum width
  minHeight = 40;                // Minimum height
  
  // Typography (for rectangles with text)
  textColor = '#1f2937';         // Dark text on light backgrounds
  textColorInverse = '#f9fafb';  // Light text on dark backgrounds
  fontSize = 14;                 // Default font size
  fontWeight = 400;              // Default font weight
  
  // Interactive states
  hoverOpacity = 0.8;            // Opacity when hovered
  activeScale = 0.95;            // Scale when pressed/active
  disabledOpacity = 0.5;         // Opacity when disabled
  
  // Selection and focus
  selectionBorderColor = '#10b981'; // Green selection border
  selectionBorderWidth = 2;      // Selection border width
  selectionBorderOffset = 2;     // Selection border offset
  selectionBorderDash = [5, 5];  // Dashed line pattern for selection
  focusOutlineColor = '#3b82f6'; // Blue focus outline
  focusOutlineWidth = 2;         // Focus outline width
  
  // Dragging state
  draggingBorderColor = '#f59e0b'; // Amber border when dragging
  draggingBorderWidth = 3;       // Thicker border when dragging
  draggingOpacity = 0.7;         // Opacity when being dragged
  draggingBorderOffset = 3;      // Larger offset when dragging
  draggingBorderDash = [8, 4];   // Dashed line pattern for dragging
}
