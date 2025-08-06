// File: apps/demo-node-canvas/src/Canvas2DRenderer.ts
import { IVisualObject as IVisualObjectBase } from 'mr-abstract-components';

export interface IVisualObject extends IVisualObjectBase {
    draw(ctx: CanvasRenderingContext2D): void;
}

export class Canvas2DRenderer {
    ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Failed to get 2D context");
        this.ctx = ctx;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    renderObject(obj: IVisualObject): void {
        this.ctx.save();
        obj.draw(this.ctx);
        this.ctx.restore();
    }
}
