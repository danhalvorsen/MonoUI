// packages/mr-abstract-components/tests/TransformNode.test.ts
import { describe, it, expect, vi } from "vitest";
import { TransformNode } from "../../src/index.js";

describe("TransformNode", () => {
    it("should trigger onParentChanged when added to a parent", () => {
        const root = new TransformNode("root");
        const child = new TransformNode("child");
        const parentChanged = vi.fn();

        child.onParentChanged = parentChanged;
        root.addChild(child);

        expect(child.parent).toBe(root);
        expect(parentChanged).toHaveBeenCalledTimes(1);
        expect(parentChanged).toHaveBeenCalledWith(child);
    });

    it("should trigger onTransformChanged when position changes and updateWorldMatrix is called", () => {
        const root = new TransformNode("root");
        const child = new TransformNode("child");
        const transformChanged = vi.fn();

        child.onTransformChanged = transformChanged;
        root.addChild(child);

        child.position.x = 5;
        child.updateWorldMatrix();

        expect(transformChanged).toHaveBeenCalled();
    });

    it("should remove a child and clear its parent", () => {
        const root = new TransformNode("root");
        const child = new TransformNode("child");

        root.addChild(child);
        root.removeChild(child);

        expect(child.parent).toBeUndefined();
        expect(root.children.length).toBe(0);
    });

    it("should find a child by id recursively", () => {
        const root = new TransformNode("root");
        const child1 = new TransformNode("child1");
        const child2 = new TransformNode("child2");

        root.addChild(child1);
        child1.addChild(child2);

        const found = root.findChildById("child2");
        expect(found).toBe(child2);
    });
});
