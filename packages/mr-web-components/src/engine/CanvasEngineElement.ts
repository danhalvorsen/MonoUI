import { LitElement, html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { CanvasEngine, IVisualObject } from "mr-abstract-components";
import { RequestAnimationLoop } from "./RequestAnimationLoop";

@customElement("canvas-engine")
export class CanvasEngineElement
  extends LitElement
  implements CanvasEngine<CanvasRenderingContext2D>
{
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    canvas {
      width: 100%;
      height: 100%;
    }
  `;

  @property({ type: Number }) width = 300;
  @property({ type: Number }) height = 150;

  @query("canvas")
  private _canvas!: HTMLCanvasElement;
  private _ctx!: CanvasRenderingContext2D;
  private _objects: IVisualObject<CanvasRenderingContext2D>[] = [];
  private _loop = new RequestAnimationLoop();

  get context(): CanvasRenderingContext2D {
    return this._ctx;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._loop.onTick(dt => this._tick(dt));
    this._loop.start();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._loop.stop();
  }

  firstUpdated(): void {
    this._canvas.width = this.width;
    this._canvas.height = this.height;
    const ctx = this._canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get 2D context");
    this._ctx = ctx;
  }

  add(obj: IVisualObject<CanvasRenderingContext2D>): void {
    this._objects.push(obj);
  }

  // Overloads to remain compatible with HTMLElement.remove()
  remove(): void;
  remove(obj: IVisualObject<CanvasRenderingContext2D>): void;
  remove(obj?: IVisualObject<CanvasRenderingContext2D>): void {
    if (obj) {
      const idx = this._objects.indexOf(obj);
      if (idx >= 0) this._objects.splice(idx, 1);
    } else {
      // Call the native HTMLElement.remove() to detach from DOM
      super.remove();
    }
  }

  clear(): void {
    this._objects.length = 0;
    if (this._ctx) this._ctx.clearRect(0, 0, this.width, this.height);
  }

  private _tick(dt: number): void {
    if (!this._ctx) return;
    this._ctx.clearRect(0, 0, this.width, this.height);
    for (const obj of this._objects) {
      obj.update(dt);
      obj.render(this._ctx);
    }
    console.log("tick")
  }

  render() {
    return html`<canvas></canvas>`;
  }
}

// Export for non-web-component usage as well
export type Canvas2DEngine = CanvasEngineElement;
