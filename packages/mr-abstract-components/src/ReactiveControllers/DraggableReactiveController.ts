
import { IReactiveController } from 'src/controllers/IReactiveController.js';
import { IMouseReactiveController } from './IMouseReactiveController.js';
import { IVisualObject } from 'src/world/visualObjects/IVisualObject.js';
export class DraggableReactiveController implements IReactiveController {
  private host!: IVisualObject|IVisualObject;
  private isDragging = false;
  private lastX = 0;
  private lastY = 0;

  constructor(private mouse: IMouseReactiveController) {}

  attach(host: IVisualObject|IVisualObject) {
    this.host = host;
  }

  hostConnected(): void {
    this.mouse.on("mousedown", this.onMouseDown);
    this.mouse.on("mouseup", this.onMouseUp);
    this.mouse.on("mousemove", this.onMouseMove);
  }

  hostDisconnected(): void {
    this.mouse.off("mousedown", this.onMouseDown);
    this.mouse.off("mouseup", this.onMouseUp);
    this.mouse.off("mousemove", this.onMouseMove);
  }

  private onMouseDown = (e: MouseEvent) => {
    if (this.hitTest(e.clientX, e.clientY)) {
      this.isDragging = true;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      this.host.onDragStart?.();
    }
  };

  private onMouseUp = () => {
    if (this.isDragging) {
      this.isDragging = false;
      this.host.onDragEnd?.();
    }
  };

  private onMouseMove = (e: MouseEvent) => {
    if (!this.isDragging) return;
    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.host.onDrag?.(dx, dy);
  };

  private hitTest(x: number, y: number): boolean {
    const { position, size } = this.host;
    return (
      x >= position.x &&
      x <= position.x + size.width &&
      y >= position.y &&
      y <= position.y + size.height
    );
  }
}
