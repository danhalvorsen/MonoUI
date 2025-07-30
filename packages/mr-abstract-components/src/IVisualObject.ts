import { Vector2 } from "@my-graphics/math";

export interface IVisualObject {
  id: string;
  selected?: boolean;

  // Position & size for hit-testing & drag
  position: { x: number; y: number };
  size: { width: number; height: number };

  // Dragging support
  isDraggable?: boolean;
  onDragStart?: (event: MouseEvent) => void;
  onDrag?: (event: MouseEvent, dx: number, dy: number) => void;
  onDragEnd?: (event: MouseEvent) => void;

  // Render/update
  update(dt: number): void;
  render(ctx: unknown): void;
}
