import { IMouseReactiveController } from "./IMouseReactiveController.js";

export class CanvasMouseReactiveController implements IMouseReactiveController {
  private element: HTMLCanvasElement;
  private listeners: Map<string, Set<(e: MouseEvent) => void>> = new Map();
  private lastPos = { x: 0, y: 0 };

  constructor(element: HTMLCanvasElement) {
    this.element = element;
  }

  hostConnected(): void {
    this.element.addEventListener("mousedown", this.dispatch);
    this.element.addEventListener("mouseup", this.dispatch);
    this.element.addEventListener("mousemove", this.dispatch);
  }

  hostDisconnected(): void {
    this.element.removeEventListener("mousedown", this.dispatch);
    this.element.removeEventListener("mouseup", this.dispatch);
    this.element.removeEventListener("mousemove", this.dispatch);
  }

  on(event: "mousedown" | "mouseup" | "mousemove", handler: (e: MouseEvent) => void): void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(handler);
  }

  off(event: "mousedown" | "mouseup" | "mousemove", handler: (e: MouseEvent) => void): void {
    this.listeners.get(event)?.delete(handler);
  }

  getPosition(): { x: number; y: number } {
    return this.lastPos;
  }

  private dispatch = (e: MouseEvent) => {
    const rect = this.element.getBoundingClientRect();
    this.lastPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    this.listeners.get(e.type)?.forEach(handler => handler(e));
  };
}
