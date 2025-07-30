// Simple Rectangle class - no over-engineered interfaces needed

export class Draggable {
  public isDraggable: boolean = true;
  public onDragStart?: (event: MouseEvent) => void;
  public onDrag?: (event: MouseEvent, deltaX: number, deltaY: number) => void;
  public onDragEnd?: (event: MouseEvent) => void;
}
