import { IPipe } from "@mr/pipeline-core";
import { Result } from "@mr/design-patterns";
import { DragContext } from "../core/DragContext.js";
export interface Bounds { xMin: number; yMin: number; xMax: number; yMax: number; }
export class BoundsPipe implements IPipe<DragContext, DragContext> {
  name = "Bounds"; constructor(private bounds: Bounds) {}
  async execute(ctx: DragContext): Promise<Result<DragContext>> {
    if (ctx.phase === "dragging") {
      ctx.currentX = Math.max(this.bounds.xMin, Math.min(this.bounds.xMax, ctx.currentX));
      ctx.currentY = Math.max(this.bounds.yMin, Math.min(this.bounds.yMax, ctx.currentY));
    }
    return Result.ok(ctx);
  }
}