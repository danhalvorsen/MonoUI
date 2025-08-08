import { IVisualObject } from "src/index.js";

export interface IRenderType {
  /** Prepare the rendering environment */
  initialize(): void;

  /** Clear frame buffer before rendering */
  clear(): void;

  /** Render one object */
  renderObject(obj: IVisualObject): void;

  /** Resize the rendering viewport */
  resize(width: number, height: number): void;

  /** Optional: Object picking / hit-testing */
  getObjectAt?(x: number, y: number): IVisualObject | undefined;
}
