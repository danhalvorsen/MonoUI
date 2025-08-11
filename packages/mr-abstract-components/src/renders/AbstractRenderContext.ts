// src/renders/RenderContext.ts
 
import { IVisualNode } from "../core/index.js";
import type { IRenderContext } from "../core/IRenderContext.js";
import { Vector2 } from "@my-graphics/math";
 
export class AbstractRenderContext implements IRenderContext {
  readonly canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null = null;
  private dpr = 1;
  /** Nodes drawn in the last frame (used by getObjectAt) */
  private lastFrame: IVisualNode[] = [];

  constructor(canvas?: HTMLCanvasElement) {
    this.canvas = canvas ?? document.createElement("canvas");
  }
    GetPosition(): Vector2 {
        throw new Error("Method not implemented.");
    }
    GetSize(): Vector2 {
        throw new Error("Method not implemented.");
    }

  initialize(): void {
    this.ctx = this.canvas.getContext("2d");
    if (!this.ctx) throw new Error("2D context unavailable");
    this.dpr = (globalThis as any).devicePixelRatio ?? 1;
    this.applyDprTransform();
  }

  clear(): void {
    if (!this.ctx) return;
    // logical dimensions after DPR scaling
    const w = this.canvas.width / this.dpr;
    const h = this.canvas.height / this.dpr;
    this.ctx.clearRect(0, 0, w, h);
    this.lastFrame = [];
  }

  renderObject(obj: IVisualNode): void {
    throw new Error("Method not implemented.");  
  }

  onResize(width: number, height: number): void {
    // CSS size (logical)
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    // Backing store size (physical)
    const dpr = (globalThis as any).devicePixelRatio ?? 1;
    this.dpr = dpr;
    this.canvas.width = Math.max(0, Math.round(width * dpr));
    this.canvas.height = Math.max(0, Math.round(height * dpr));

    if (this.ctx) this.applyDprTransform();
  }

  getObjectAt?(x: number, y: number): IVisualNode | undefined {

   throw new Error("Method not implemented.");
  }

  // ---------- Extras (not in interface, but useful) ----------

  /** Clear + render all nodes in order */
  renderAll(nodes: Iterable<IVisualNode>): void {
    this.clear();
    for (const n of nodes) this.renderObject(n);
  }

  /** Expose ctx to nodes that know this concrete context */
  getContext2D(): CanvasRenderingContext2D | null {
    return this.ctx;
  }

  // ---------- Internal ----------
  private applyDprTransform(): void {
    if (!this.ctx) return;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
    if (this.dpr !== 1) this.ctx.scale(this.dpr, this.dpr);
  }
}
