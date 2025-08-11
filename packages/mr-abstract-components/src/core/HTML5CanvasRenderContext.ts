// src/core/HTML5CanvasRenderContext.ts
import type { IRenderContext } from "../core/IRenderContext.js"
import type { IVisualNode } from "./nodes/IVisualNode.js";

export class HTML5CanvasRenderContext implements IRenderContext {
  readonly canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null = null;
  private dpr = 1;

  constructor(canvas?: HTMLCanvasElement) {
    this.canvas = canvas ?? document.createElement("canvas");
  }

  initialize(): void {
    this.ctx = this.canvas.getContext("2d");
    if (!this.ctx) throw new Error("2D context unavailable");
    this.dpr = (globalThis as any).devicePixelRatio ?? 1;
    this.applyDpr();
  }

  clear(): void {
    if (!this.ctx) return;
    const w = this.canvas.width / this.dpr;
    const h = this.canvas.height / this.dpr;
    this.ctx.clearRect(0, 0, w, h);
  }

  renderObject(obj: IVisualNode): void {
    obj.draw(this);
  }

  onResize(width: number, height: number): void {
    const dpr = (globalThis as any).devicePixelRatio ?? 1;
    this.dpr = dpr;
    this.canvas.width = Math.max(0, Math.round(width * dpr));
    this.canvas.height = Math.max(0, Math.round(height * dpr));
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    if (this.ctx) this.applyDpr();
  }

  getObjectAt?(_x: number, _y: number): IVisualNode | undefined {
    return undefined;
  }

  getContext2D(): CanvasRenderingContext2D | null { return this.ctx; }

  private applyDpr() {
    if (!this.ctx) return;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (this.dpr !== 1) this.ctx.scale(this.dpr, this.dpr);
  }
}
