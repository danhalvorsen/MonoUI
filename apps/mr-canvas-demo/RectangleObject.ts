 // packages/mr-canvas-demo/src/objects/RectangleObject.ts
import { ObjectBase } from 'mr-abstract-components';

export class RectangleObject extends ObjectBase {
    color: string = 'red';
    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
    }
}
