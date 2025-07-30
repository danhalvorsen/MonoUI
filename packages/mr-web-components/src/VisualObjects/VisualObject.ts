import { IVisualObject, PhysicObject } from "mr-abstract-components";
import { Vector2 } from "@my-graphics/math";

export class VisualObject extends PhysicObject implements IVisualObject {
  id!: string;
  selected?: boolean;
  isDraggable?: boolean;

  onDragStart?: (event: MouseEvent) => void;
  onDrag?: (event: MouseEvent, dx: number, dy: number) => void;
  onDragEnd?: (event: MouseEvent) => void;

  constructor(
    position: Vector2 = new Vector2(0, 0),
    velocity: Vector2 = new Vector2(0, 0),
    acceleration: Vector2 = new Vector2(0, 0),
    width: number = 100,
    height: number = 100,
    id: string = 'VisualObject',
    selected: boolean = false,
    isDraggable: boolean = false
  ) {
    super(position, velocity, acceleration, width, height);
    this.id = id;
    this.selected = selected;
    this.isDraggable = isDraggable;
  }

  // Provide public access to the underlying position
  get position() {
    return this._position;
  }

  // Implement required size property
  get size() {
    return { width: this.width, height: this.height };
  }

  update(dt: number): void {
    // Default no-op
  }

  render(ctx: unknown): void {
    // Default no-op
  }
}
