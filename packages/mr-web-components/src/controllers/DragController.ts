import type { ReactiveController, ReactiveControllerHost } from "lit";
import type { IVisualObject } from 'mr-abstract-components';

 
// Host type for canvas-enabled components
export type DragCapableHost = ReactiveControllerHost & {
  canvas?: HTMLCanvasElement;
  getObjectAt?(x: number, y: number): IVisualObject | null;
};

export class DragController implements ReactiveController {
  private host?: DragCapableHost;
  private isDragging = false;
  private dragTarget: IVisualObject | null = null;

  private lastMouseX = 0;
  private lastMouseY = 0;
  private dragStartX = 0;
  private dragStartY = 0;
  private mouseDownX = 0;
  private mouseDownY = 0;
  private hasSignificantMovement = false;

  private static readonly DRAG_THRESHOLD = 3; // pixels

  constructor(host?: DragCapableHost) {
    if (host) this.setHost(host);
  }

  setHost(host: DragCapableHost) {
    this.host = host;
    if (this.host && 'addController' in this.host && typeof this.host.addController === 'function') {
      this.host.addController(this);
    }
  }

  hostConnected() {
    this.addEventListeners();
  }

  hostDisconnected() {
    this.removeEventListeners();
  }

  private addEventListeners() {
    if (!this.host?.canvas) return;
    this.host.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.host.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.host.canvas.addEventListener('mouseup', this.handleMouseUp);
    this.host.canvas.addEventListener('mouseleave', this.handleMouseUp);
  }

  private removeEventListeners() {
    if (!this.host?.canvas) return;
    this.host.canvas.removeEventListener('mousedown', this.handleMouseDown);
    this.host.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.host.canvas.removeEventListener('mouseup', this.handleMouseUp);
    this.host.canvas.removeEventListener('mouseleave', this.handleMouseUp);
  }

  private handleMouseDown = (event: MouseEvent) => {
    if (!this.host?.getObjectAt) return;

    const rect = this.host.canvas!.getBoundingClientRect();
    const scaleX = this.host.canvas!.width / this.host.canvas!.clientWidth;
    const scaleY = this.host.canvas!.height / this.host.canvas!.clientHeight;

    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    const target = this.host.getObjectAt(mouseX, mouseY);

    if (target && target.isDraggable !== false) {
      this.dragTarget = target;
      this.lastMouseX = mouseX;
      this.lastMouseY = mouseY;
      this.mouseDownX = mouseX;
      this.mouseDownY = mouseY;
      this.dragStartX = target.position.x;
      this.dragStartY = target.position.y;
      this.hasSignificantMovement = false;
      event.preventDefault();
    }
  };

  private handleMouseMove = (event: MouseEvent) => {
    if (!this.dragTarget || !this.host?.canvas) return;

    const rect = this.host.canvas.getBoundingClientRect();
    const scaleX = this.host.canvas.width / this.host.canvas.clientWidth;
    const scaleY = this.host.canvas.height / this.host.canvas.clientHeight;

    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    const totalDeltaX = mouseX - this.mouseDownX;
    const totalDeltaY = mouseY - this.mouseDownY;
    const totalDistance = Math.sqrt(totalDeltaX ** 2 + totalDeltaY ** 2);

    if (!this.hasSignificantMovement && totalDistance > DragController.DRAG_THRESHOLD) {
      this.hasSignificantMovement = true;
      this.isDragging = true;

      if (this.dragTarget.onDragStart && this.dragTarget.isDraggable !== false) {
        this.dragTarget.onDragStart(event);
      }
      this.host.canvas.style.cursor = 'grabbing';
    }

    if (this.isDragging && this.dragTarget.isDraggable !== false) {
      const deltaX = mouseX - this.lastMouseX;
      const deltaY = mouseY - this.lastMouseY;

      this.dragTarget.position.x += deltaX;
      this.dragTarget.position.y += deltaY;

      if (this.dragTarget.onDrag) {
        this.dragTarget.onDrag(event, deltaX, deltaY);
      }

      this.host.requestUpdate();
    }

    this.lastMouseX = mouseX;
    this.lastMouseY = mouseY;
  };

  private handleMouseUp = (event: MouseEvent) => {
    if (!this.dragTarget) return;

    if (this.isDragging && this.hasSignificantMovement) {
      if (this.dragTarget.onDragEnd) {
        this.dragTarget.onDragEnd(event);
      }
    } else if ('selected' in this.dragTarget) {
      (this.dragTarget as any).selected = !(this.dragTarget as any).selected;
    }

    if (this.host?.canvas) {
      this.host.canvas.style.cursor = 'default';
    }

    this.isDragging = false;
    this.dragTarget = null;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.mouseDownX = 0;
    this.mouseDownY = 0;
    this.hasSignificantMovement = false;

    this.host?.requestUpdate();
  };

  // Public API
  public startDrag(target: IVisualObject, mouseX: number, mouseY: number) {
    if (target.isDraggable === false) return;
    this.isDragging = true;
    this.dragTarget = target;
    this.lastMouseX = mouseX;
    this.lastMouseY = mouseY;
    this.dragStartX = target.position.x;
    this.dragStartY = target.position.y;
  }

  public stopDrag() {
    this.isDragging = false;
    this.dragTarget = null;
    if (this.host?.canvas) {
      this.host.canvas.style.cursor = 'default';
    }
  }

  public get isCurrentlyDragging() {
    return this.isDragging;
  }

  public get currentDragTarget() {
    return this.dragTarget;
  }
}
