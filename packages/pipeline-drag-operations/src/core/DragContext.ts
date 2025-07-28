import { IData } from "@mr/pipeline-core";
export interface DragContext extends IData {
  phase: "start" | "dragging" | "end";
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  deltaX: number;
  deltaY: number;
  event: MouseEvent;
}