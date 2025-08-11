import { describe, it, expect } from "vitest";
import { CanvasRenderer } from "../src/CanvasRenderer.js";
import { registerDefaultBehaviors } from "../src/defaultBehaviors.js";
import { GroupNode, TransformNode, StyleNode, RectNode } from "../src/nodes.js";
import { makeMockCtx } from "./utils/mockCtx.js";

describe("CanvasRenderer - basic chain", () => {
  it("renders group -> transform -> style -> rect", () => {
    const root = new GroupNode("root")
      .add(
        new TransformNode("t1", { translate: { x: 10, y: 20 } })
          .add(
            new StyleNode("s1", { fillStyle: "#000", globalAlpha: 0.5 })
              .add(new RectNode("r1", { x: 0, y: 0, width: 100, height: 50, fill: true, stroke: true }))
          )
      );

    const { ctx, calls } = makeMockCtx();
    const renderer = registerDefaultBehaviors(new CanvasRenderer());
    renderer.render(root, ctx);

    expect(calls).toEqual([
      "save",
      "save", "translate(10,20)",
      "save", "fillStyle=#000", "globalAlpha=0.5",
      "fillRect(0,0,100,50)", "strokeRect(0,0,100,50)",
      "restore",
      "restore",
      "restore"
    ]);
  });
});
