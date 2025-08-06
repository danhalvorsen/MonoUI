// File: apps/demo-node-canvas/src/DemoObject.ts
import { Matrix3, Vector2 } from '@my-graphics/math';
import { BaseVisualObject, IRenderType } from 'mr-abstract-components';

export class DemoObject extends BaseVisualObject {
  rotation = 0;
  position = new Vector2(600, 200);
  size = new Vector2(30, 10);
  worldMatrix = new Matrix3();

  constructor(id: string, color: string) {
    super(id, {
      id,
      visual: { style: { fill: color, stroke: "120", strokeWidth: 2 }
      , visible: true, opacity: 1, zIndex: 0 },
      connectors: [],
      interaction: { draggable: false, selected: false }
    });
  }

  updateWorldMatrix(): void {
    this.worldMatrix = Matrix3.identity(); // in the future: add translation + rotation
  }

  update(dt: number): void {
    this.rotation += dt * 0.001; // spin
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const width = this.size.x;
    const height = this.size.y;
    const style = this.configuration.visual.style;

    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation);

    ctx.fillStyle = style.fill ?? '#ff0000';
    ctx.fillRect(-width / 2, -height / 2, width, height);

    if (style.stroke) {
      ctx.strokeStyle = style.stroke;
      ctx.lineWidth = style.strokeWidth ?? 2;
      ctx.strokeRect(-width / 2, -height / 2, width, height);
    }
  }
}
