import type { IVisualNode } from "./nodes/IVisualNode.js";

export interface IRenderContext {
  initialize(): void;
  clear(): void;
  renderObject(obj: IVisualNode): void;
  onResize(width: number, height: number): void;
  getObjectAt?(x: number, y: number): IVisualNode | undefined;
}