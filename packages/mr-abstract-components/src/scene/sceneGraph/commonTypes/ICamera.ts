export interface ICamera {
  /** Unique identifier */
  id?: string;

  /** Camera position in world space */
  position: { x: number; y: number; z?: number };

  /** Where the camera is looking */
  target?: { x: number; y: number; z?: number };

  /** Zoom (2D) or field of view in degrees (3D) */
  zoomOrFov: number;

  /** Near & far clipping planes (3D) */
  near?: number;
  far?: number;

  /** Up direction (default Y-up) */
  up?: { x: number; y: number; z: number };

  /** Orthographic or Perspective (for 3D) */
  projection: 'orthographic' | 'perspective' | 'none';

  /** Viewport size (for aspect ratio calculations) */
  viewport?: { width: number; height: number };

  /** Optional: Controls flags (e.g., allowPan, allowRotate, etc.) */
  controls?: {
    allowPan?: boolean;
    allowZoom?: boolean;
    allowRotate?: boolean;
  };
}
