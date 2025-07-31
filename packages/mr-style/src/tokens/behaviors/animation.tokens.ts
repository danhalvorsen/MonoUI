/**
 * Animation behavior tokens for smooth transitions and effects
 * Defines consistent animation patterns across all visual components
 */
export const BehaviorAnimationTokens = {
  // Transition durations
  duration: {
    instant: '0ms',               // No transition
    fast: '100ms',                // Quick interactions (clicks, presses)
    normal: '200ms',              // Standard transitions (hover, focus)
    slow: '300ms',                // Deliberate transitions (selections)
    slower: '500ms',              // Emphasis transitions (errors, success)
    slowest: '1000ms'             // Long animations (loading, reveals)
  },
  
  // Easing functions
  easing: {
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    bounceOut: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smoothOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    sharpOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
  },
  
  // Scale animations
  scale: {
    subtle: 1.02,                 // Barely noticeable
    small: 1.05,                  // Small emphasis
    medium: 1.1,                  // Clear emphasis
    large: 1.2,                   // Strong emphasis
    pressed: 0.98,                // Pressed/active state
    hidden: 0                     // Completely hidden
  },
  
  // Rotation animations (in degrees)
  rotation: {
    subtle: 1,                    // Slight tilt
    small: 3,                     // Small rotation
    medium: 5,                    // Noticeable rotation
    quarter: 90,                  // Quarter turn
    half: 180,                    // Half turn
    full: 360                     // Full rotation
  },
  
  // Opacity animations
  opacity: {
    hidden: 0,                    // Completely transparent
    subtle: 0.1,                  // Barely visible
    faded: 0.3,                   // Faded
    dimmed: 0.5,                  // Half opacity
    visible: 0.8,                 // Mostly visible
    opaque: 1.0                   // Fully opaque
  },
  
  // Transform origins
  transformOrigin: {
    center: 'center center',
    topLeft: 'top left',
    topRight: 'top right',
    bottomLeft: 'bottom left',
    bottomRight: 'bottom right',
    top: 'top center',
    bottom: 'bottom center',
    left: 'center left',
    right: 'center right'
  },
  
  // Special effects
  effects: {
    // Shake animation for errors
    shake: {
      keyframes: 'shake 0.5s ease-in-out',
      amplitude: 5,               // Shake distance in pixels
      frequency: 4                // Number of shakes
    },
    
    // Pulse animation for success/attention
    pulse: {
      keyframes: 'pulse 1s ease-in-out infinite',
      scaleMin: 1.0,              // Minimum scale
      scaleMax: 1.05,             // Maximum scale
      opacityMin: 0.8,            // Minimum opacity
      opacityMax: 1.0             // Maximum opacity
    },
    
    // Bounce animation for playful interactions
    bounce: {
      keyframes: 'bounce 0.6s ease-out',
      height: 10,                 // Bounce height in pixels
      damping: 0.8                // Bounce damping factor
    },
    
    // Glow effect for selections
    glow: {
      spreadRadius: 4,            // Glow spread
      blurRadius: 8,              // Glow blur
      intensity: 0.6,             // Glow opacity
      color: '#8b5cf6'            // Default glow color
    }
  }
} as const;
