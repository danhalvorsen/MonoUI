import { ObjectBase, IRenderType } from 'mr-abstract-components';

export class DemoObject extends ObjectBase {
  color: string;

  constructor(id: string, color: string) {
    super(id);
    this.color = color;
    this.size = { width: 100, height: 100 };
  }

  draw(ctx: IRenderType): void {
    const renderCtx = (ctx as any).ctx as CanvasRenderingContext2D;
    renderCtx.fillStyle = this.color;
    renderCtx.fillRect(0, 0, this.size.width, this.size.height);
  }
}
