export interface IScreen {
  /** Unique identifier */
  id?: string;

  /** Size in pixels */
  size: { width: number; height: number };

  /** Dots per inch (DPI) */
  dpi?: number;

  /** Orientation of the screen */
  orientation?: 'landscape' | 'portrait';
}
