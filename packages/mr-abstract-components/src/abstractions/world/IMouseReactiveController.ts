import { IReactiveController } from "src/index.js";

export interface IMouseReactiveController extends IReactiveController {
  on(event: "mousedown" | "mouseup" | "mousemove", handler: (e: MouseEvent) => void): void;
  off(event: "mousedown" | "mouseup" | "mousemove", handler: (e: MouseEvent) => void): void;
  getPosition(): { x: number; y: number };
}