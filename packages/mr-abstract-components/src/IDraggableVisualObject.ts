import { IVisualObject } from "./IVisualObject.js";

/**
 * 
 * 
 * onDragStart – initiate visual changes (e.g., add class, prepare data transfer).

    onDrag – update UI or element position (dx, dy makes it reusable for custom positioning).

    onDragEnd – cleanup state (remove classes, finalize position).

    onDragEnter / onDragLeave – highlight potential drop targets.

    onDragOver – used to prevent default (for allowing drop) & provide hover feedback.

    onDrop – finalize the operation, update model/
 */
export interface IDraggableVisualObject<C = unknown> extends IVisualObject<C> {
  size: { width: number; height: number };
  isDraggable?: boolean;
   /** When the user starts dragging */
  onDragStart?: (event: MouseEvent) => void;

  /** While dragging (with deltas) */
  onDrag?: (event: MouseEvent, dx: number, dy: number) => void;

  /** When the user releases the drag */
  onDragEnd?: (event: MouseEvent) => void;

  /** When an item enters a valid drop zone */
  onDragEnter?: (event: MouseEvent) => void;

  /** While hovering over a drop zone */
  onDragOver?: (event: MouseEvent) => void;

  /** When an item leaves a drop zone */
  onDragLeave?: (event: MouseEvent) => void;

  /** When the dragged item is dropped */
  onDrop?: (event: MouseEvent) => void;
}

