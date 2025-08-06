"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var Traversal_js_1 = require("../../src/abstractions/world/Traversal.js");
var NodeBase_js_1 = require("../../src/abstractions/world/NodeBase.js");
var TestNode = /** @class */ (function (_super) {
    __extends(TestNode, _super);
    function TestNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestNode.prototype.draw = function () { };
    return TestNode;
}(NodeBase_js_1.NodeBase));
(0, vitest_1.describe)('Traversal', function () {
    var root = new TestNode('root');
    var left = new TestNode('left');
    var right = new TestNode('right');
    var leftChild = new TestNode('leftChild');
    root.children = [left, right];
    left.children = [leftChild];
    (0, vitest_1.it)('should traverse in preorder', function () {
        var visited = [];
        new Traversal_js_1.Traversal('preorder').traverse(root, function (n) { return visited.push(n.id); });
        (0, vitest_1.expect)(visited).toEqual(['root', 'left', 'leftChild', 'right']);
    });
    (0, vitest_1.it)('should traverse in postorder', function () {
        var visited = [];
        new Traversal_js_1.Traversal('postorder').traverse(root, function (n) { return visited.push(n.id); });
        (0, vitest_1.expect)(visited).toEqual(['leftChild', 'left', 'right', 'root']);
    });
    (0, vitest_1.it)('should traverse in inorder', function () {
        var visited = [];
        new Traversal_js_1.Traversal('inorder').traverse(root, function (n) { return visited.push(n.id); });
        (0, vitest_1.expect)(visited).toEqual(['leftChild', 'left', 'root', 'right']);
    });
});
