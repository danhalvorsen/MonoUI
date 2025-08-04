// packages/mr-canvas-html5/src/Html5VisualObject.ts
import type { IVisualObject, IDraggable } from 'mr-abstract-components';

export class Html5VisualObject implements IVisualObject {
    id: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    draggable?: IDraggable;

    constructor(id: string, x: number, y: number, width: number, height: number) {
        this.id = id;
        this.position = { x, y };
        this.size = { width, height };
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = '#007acc';
        ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
    }
}
