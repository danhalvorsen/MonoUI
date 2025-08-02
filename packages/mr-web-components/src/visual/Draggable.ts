export class Draggable {
  public isDragging = false;

  startDrag(): void {
    this.isDragging = true;
  }

  stopDrag(): void {
    this.isDragging = false;
  }
}
