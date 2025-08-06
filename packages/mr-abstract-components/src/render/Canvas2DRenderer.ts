// packages/mr-abstract-components/src/canvas/Canvas2DRenderer.ts
import { IRenderType } from "./../abstractions/world/IRenderType.js";
import { IVisualObject } from "./../abstractions/IVisualObject.js";

export class Canvas2DRenderer implements IRenderType {
    private ctx: CanvasRenderingContext2D;
    private width: number;
    private height: number;

    constructor(private canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Failed to get 2D context from canvas.');
        this.ctx = ctx;
        this.width = canvas.width;
        this.height = canvas.height;
    }

    initialize(): void {
        this.ctx.imageSmoothingEnabled = true;
        this.clear();
    }

    clear(): void {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    renderObject(obj: IVisualObject): void {
        const { size, worldMatrix, configuration } = obj as any;

        this.ctx.save();
        // Apply world matrix directly
        const m = worldMatrix?.toFloat32Array?.() ?? [1, 0, 0, 1, 0, 0];
        this.ctx.setTransform(m[0], m[3], m[1], m[4], m[2], m[5]);

        const [a, b, c, d, e, f] = worldMatrix.toCanvasTransform();
        this.ctx.setTransform(a, b, c, d, e, f);


        const style = configuration?.resolvedStyles ?? configuration?.visual?.style;
        if (style) {
            if (style.fill || style.fillStyle) {
                this.ctx.fillStyle = style.fill ?? style.fillStyle;
                this.ctx.fillRect(0, 0, size.width, size.height);
            }
            if ((style.stroke || style.strokeStyle) && (style.strokeWidth || style.lineWidth)) {
                this.ctx.strokeStyle = style.stroke ?? style.strokeStyle;
                this.ctx.lineWidth = style.strokeWidth ?? style.lineWidth;
                this.ctx.strokeRect(0, 0, size.width, size.height);
            }
            if (style.opacity !== undefined) {
                this.ctx.globalAlpha = style.opacity;
            }
        }

        this.ctx.restore();
    }

    resize(width: number, height: number): void {
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
    }
}
