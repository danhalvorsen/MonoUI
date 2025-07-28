import { describe, it, expect } from "vitest";
import { DragOperation } from "@src/core/DragOperation.js";
import { DragContext } from "@src/core/DragContext.js";
import { DragRectanglePipe } from "@src/pipes/DragRectanglePipe.js";

describe("DragOperation", () => {
  it("should execute pipes and update rectangle position", async () => {
    const rect = { position: { x: 0, y: 0 } };

    const op = new DragOperation<DragContext>({
      phase: "start",
      startX: 10, startY: 20,
      currentX: 10, currentY: 20,
      deltaX: 0, deltaY: 0,
      event: {} as MouseEvent,
      context: {}
    }).addPipe(new DragRectanglePipe(rect));

    op.context.phase = "dragging";
    op.context.currentX = 50; op.context.currentY = 60;
    await op.run();

    expect(rect.position.x).toBe(50);
    expect(rect.position.y).toBe(60);
  });
});
