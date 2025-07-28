// Simple Rectangle class - no over-engineered interfaces needed
export class Draggable {
  public isDraggable: boolean = true;
  public onDragStart?: (event: MouseEvent) => void;
  public onDrag?: (event: MouseEvent, deltaX: number, deltaY: number) => void;
  public onDragEnd?: (event: MouseEvent) => void;
}

export class Rectangle {
  public id: string;
  public position: { x: number; y: number };
  private _selected: boolean = false;
  private _draggable! : Draggable;
 
 
  
  // Size for drag controller
  get size(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }
  
  // Simple selection state
  get selected(): boolean {
    return this._selected;
  }
  
  set selected(value: boolean) {
    this._selected = value;
    console.log(`Rectangle ${this.id} selection changed to: ${value}`);
  }

  constructor(
    public width: number,
    public height: number,
    public color: string,
    x: number = 0,
    y: number = 0,
    id: string = 'Rectangle'
  ) {
    this.id = id;
    this.position = { x, y };
    this._draggable = new Draggable();  
  }

  update(dt: number): void {
    // Simple update - no velocity/animation needed for basic rectangle
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Draw the rectangle
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    
    // Draw selection indicator if selected
    if (this._selected) {
      ctx.strokeStyle = '#00ff00'; // Green selection border
      ctx.lineWidth = 2;
      ctx.strokeRect(this.position.x - 2, this.position.y - 2, this.width + 4, this.height + 4);
    }
  }
}
