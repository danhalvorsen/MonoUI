import { describe, it, expect } from "vitest";
import { CanvasRenderer } from "../src/CanvasRenderer.js";
import { registerDefaultBehaviors } from "../src/defaultBehaviors.js";
import { GroupNode, TransformNode, StyleNode, RectNode, CircleNode } from "../src/nodes.js";
import { makeMockCtx } from "./utils/mockCtx.js";
import { Node } from "mr-node-core";

describe("CanvasRenderer - extended behaviors", () => {
  it("renders circle path with fill & stroke", () => {
    const root = new GroupNode("root").add(
      new StyleNode("s", { strokeStyle: "blue", lineWidth: 3 })
        .add(new CircleNode("c", { x: 5, y: 6, r: 7, fill: true, stroke: true }))
    );
    const { ctx, calls } = makeMockCtx();
    const renderer = registerDefaultBehaviors(new CanvasRenderer());
    renderer.render(root, ctx);

    expect(calls).toEqual([
      "save",
      "save", "strokeStyle=blue", "lineWidth=3",
      "beginPath", "arc(5,6,7)", "fill", "stroke",
      "restore",
      "restore"
    ]);
  });

  it("nested styles override then restore", () => {
    const root = new GroupNode("root")
      .add(
        new StyleNode("outer", { fillStyle: "red", lineWidth: 1 }).add(
          new StyleNode("inner", { fillStyle: "green" }).add(
            new RectNode("r", { x: 0, y: 0, width: 10, height: 10, fill: true })
          )
        )
      );
    const { ctx, calls } = makeMockCtx();
    const renderer = registerDefaultBehaviors(new CanvasRenderer());
    renderer.render(root, ctx);

    expect(calls).toEqual([
      "save",
      "save", "fillStyle=red", "lineWidth=1",
      "save", "fillStyle=green",
      "fillRect(0,0,10,10)",
      "restore",
      "restore",
      "restore"
    ]);
  });

  it("transform stacking order", () => {
    const root = new GroupNode("root")
      .add(
        new TransformNode("t", { translate: { x: 1, y: 2 }, rotate: 0.5, scale: { x: 3, y: 4 } })
          .add(new RectNode("r", { x: 0, y: 0, width: 1, height: 1, stroke: true }))
      );
    const { ctx, calls } = makeMockCtx();
    const renderer = registerDefaultBehaviors(new CanvasRenderer());
    renderer.render(root, ctx);

    expect(calls).toEqual([
      "save",
      "save", "translate(1,2)", "rotate(0.5)", "scale(3,4)",
      "strokeRect(0,0,1,1)",
      "restore",
      "restore"
    ]);
  });

  it("unregistered kind is ignored gracefully", () => {
    const root = new GroupNode("root");
    const orphan = new Node("plain", {}); // has no 'kind'
    root.add(orphan);
    const { ctx, calls } = makeMockCtx();
    const renderer = registerDefaultBehaviors(new CanvasRenderer());
    renderer.render(root, ctx);
    // only group save/restore expected; the orphan generates no drawing calls
    expect(calls).toEqual(["save", "restore"]);
  });

  it("sibling groups keep save/restore balanced", () => {
    const root = new GroupNode("root").add(
      new GroupNode("g1").add(new RectNode("r1", { x: 0, y: 0, width: 1, height: 1, fill: true })),
      new GroupNode("g2").add(new RectNode("r2", { x: 2, y: 2, width: 1, height: 1, stroke: true }))
    );
    const { ctx, calls } = makeMockCtx();
    const renderer = registerDefaultBehaviors(new CanvasRenderer());
    renderer.render(root, ctx);

    expect(calls).toEqual([
      "save",
      "save",
      "fillRect(0,0,1,1)",
      "restore",
      "save",
      "strokeRect(2,2,1,1)",
      "restore",
      "restore"
    ]);
  });
});
