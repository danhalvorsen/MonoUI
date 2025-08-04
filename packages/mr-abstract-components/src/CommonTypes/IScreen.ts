// packages/mr-abstract-components/src/canvas/IScreen.ts
export interface IScreen {
  /** Unique id for the screen */
  id?: string;

  /** Width in pixels */
  width: number;

  /** Height in pixels */
  height: number;

  /** Device pixel ratio (for HiDPI / retina) */
  pixelRatio?: number;

  /** Resize handler (updates width/height) */
  resize(width: number, height: number): void;

  /** Optional: Clear the screen before rendering */
  clear?(color?: string): void;

  /** Optional: Get the raw DOM element (for canvas-based systems) */
  getElement?(): HTMLElement | undefined;
}
