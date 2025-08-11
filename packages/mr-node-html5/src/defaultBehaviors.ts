import { CanvasRenderer, CanvasBehavior } from "./CanvasRenderer.js";
import { Kinds } from "./types.js";
import { GroupNode, TransformNode, StyleNode, RectNode, CircleNode } from "./nodes.js";

export const GroupBehavior: CanvasBehavior<GroupNode> = {
  kind: Kinds.Group,
  enter: (_n, ctx) => ctx.save(),
  leave: (_n, ctx) => ctx.restore(),
};

export const TransformBehavior: CanvasBehavior<TransformNode> = {
  kind: Kinds.Transform,
  enter: (n, ctx) => {
    ctx.save();
    const d = n.data;
    if (d.translate) ctx.translate(d.translate.x, d.translate.y);
    if (d.rotate) ctx.rotate(d.rotate);
    if (d.scale) ctx.scale(d.scale.x, d.scale.y);
  },
  leave: (_n, ctx) => ctx.restore(),
};

export const StyleBehavior: CanvasBehavior<StyleNode> = {
  kind: Kinds.Style,
  enter: (n, ctx) => {
    ctx.save();
    if (n.data.fillStyle !== undefined) ctx.fillStyle = n.data.fillStyle as any;
    if (n.data.strokeStyle !== undefined) ctx.strokeStyle = n.data.strokeStyle as any;
    if (n.data.lineWidth !== undefined) ctx.lineWidth = n.data.lineWidth;
    if (n.data.globalAlpha !== undefined) ctx.globalAlpha = n.data.globalAlpha;
  },
  leave: (_n, ctx) => ctx.restore(),
};

export const RectBehavior: CanvasBehavior<RectNode> = {
  kind: Kinds.Rect,
  enter: (n, ctx) => {
    const { x, y, width, height, fill, stroke } = n.data;
    if (fill) ctx.fillRect(x, y, width, height);
    if (stroke) ctx.strokeRect(x, y, width, height);
  },
};

export const CircleBehavior: CanvasBehavior<CircleNode> = {
  kind: Kinds.Circle,
  enter: (n, ctx) => {
    const { x, y, r, fill, stroke } = n.data;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  },
};

export function registerDefaultBehaviors(renderer: CanvasRenderer): CanvasRenderer {
  return renderer
    .register(GroupBehavior)
    .register(TransformBehavior)
    .register(StyleBehavior)
    .register(RectBehavior)
    .register(CircleBehavior);
}
