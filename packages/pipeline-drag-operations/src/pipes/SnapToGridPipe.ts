import { IPipe } from "@mr/pipeline-core";
import { Result } from "@mr/design-patterns";
import { DragContext } from "../core/DragContext.js";
export class SnapToGridPipe implements IPipe<DragContext, DragContext> {
  name = "SnapToGrid"; constructor(private gridSize: number = 10) {}
  async execute(ctx: DragContext): Promise<Result<DragContext>> {
    if (ctx.phase === "dragging") {
      ctx.currentX = Math.round(ctx.currentX / this.gridSize) * this.gridSize;
      ctx.currentY = Math.round(ctx.currentY / this.gridSize) * this.gridSize;
    }
    return Result.ok(ctx);
  }
}