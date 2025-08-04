import { IObject } from "src/index.js";

export interface IDraggable extends IObject {
  target: IObject;                  // The object this draggable manipulates
  onDragStart?(): void;
  onDrag?(dx: number, dy: number): void;
  onDragEnd?(): void;
}