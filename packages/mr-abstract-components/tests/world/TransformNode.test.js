"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// packages/mr-abstract-components/tests/TransformNode.test.ts
var vitest_1 = require("vitest");
var TransformNode_js_1 = require("../../src/abstractions/world/TransformNode.js");
(0, vitest_1.describe)("TransformNode", function () {
    (0, vitest_1.it)("should trigger onParentChanged when added to a parent", function () {
        var root = new TransformNode_js_1.TransformNode("root");
        var child = new TransformNode_js_1.TransformNode("child");
        var parentChanged = vitest_1.vi.fn();
        child.onParentChanged = parentChanged;
        root.addChild(child);
        (0, vitest_1.expect)(child.parent).toBe(root);
        (0, vitest_1.expect)(parentChanged).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(parentChanged).toHaveBeenCalledWith(child);
    });
    (0, vitest_1.it)("should trigger onTransformChanged when position changes and updateWorldMatrix is called", function () {
        var root = new TransformNode_js_1.TransformNode("root");
        var child = new TransformNode_js_1.TransformNode("child");
        var transformChanged = vitest_1.vi.fn();
        child.onTransformChanged = transformChanged;
        root.addChild(child);
        child.position.x = 5;
        child.updateWorldMatrix();
        (0, vitest_1.expect)(transformChanged).toHaveBeenCalled();
    });
    (0, vitest_1.it)("should remove a child and clear its parent", function () {
        var root = new TransformNode_js_1.TransformNode("root");
        var child = new TransformNode_js_1.TransformNode("child");
        root.addChild(child);
        root.removeChild(child);
        (0, vitest_1.expect)(child.parent).toBeUndefined();
        (0, vitest_1.expect)(root.children.length).toBe(0);
    });
    (0, vitest_1.it)("should find a child by id recursively", function () {
        var root = new TransformNode_js_1.TransformNode("root");
        var child1 = new TransformNode_js_1.TransformNode("child1");
        var child2 = new TransformNode_js_1.TransformNode("child2");
        root.addChild(child1);
        child1.addChild(child2);
        var found = root.findChildById("child2");
        (0, vitest_1.expect)(found).toBe(child2);
    });
});
