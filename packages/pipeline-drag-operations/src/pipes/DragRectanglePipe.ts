import { IPipe } from "@mr/pipeline-core";
import { Result } from "@mr/design-patterns";
import { DragContext } from "../core/DragContext.js";

export interface RectangleLike { position: { x: number; y: number }; }

export class DragRectanglePipe implements IPipe<DragContext, DragContext> {
  name = "DragRectangle"; private offsetX = 0; private offsetY = 0;
  constructor(private rect: RectangleLike) {}
  async execute(ctx: DragContext): Promise<Result<DragContext>> {
    if (ctx.phase === "start") { this.offsetX = ctx.startX - this.rect.position.x; this.offsetY = ctx.startY - this.rect.position.y; }
    if (ctx.phase === "dragging") { this.rect.position.x = ctx.currentX - this.offsetX; this.rect.position.y = ctx.currentY - this.offsetY; }
    return Result.ok(ctx);
  }
}