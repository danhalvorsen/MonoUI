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
var src_1 = require("../../src");
var TestNode = /** @class */ (function (_super) {
    __extends(TestNode, _super);
    function TestNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestNode.prototype.draw = function () { };
    return TestNode;
}(src_1.NodeBase));
(0, vitest_1.describe)('Visitor Pattern', function () {
    (0, vitest_1.it)('should visit all nodes in depth-first order', function () {
        var root = new TestNode('root');
        var child1 = new TestNode('child1');
        var child2 = new TestNode('child2');
        var grandchild = new TestNode('grandchild');
        child1.children = [grandchild];
        root.children = [child1, child2];
        var visited = [];
        var visitor = {
            visit: function (node) {
                visited.push(node.id);
            },
        };
        root.accept(visitor);
        (0, vitest_1.expect)(visited).toEqual(['root', 'child1', 'grandchild', 'child2']);
    });
    (0, vitest_1.it)('should work on WorldBase with children', function () {
        var world = new src_1.WorldBase('world');
        var child1 = new TestNode('child1');
        var child2 = new TestNode('child2');
        world.children = [child1, child2];
        var visited = [];
        world.accept({
            visit: function (node) {
                visited.push(node.id);
            },
        });
        (0, vitest_1.expect)(visited).toEqual(['world', 'child1', 'child2']);
    });
    (0, vitest_1.it)('should allow custom visitor logic (count nodes)', function () {
        var root = new TestNode('root');
        root.children = [new TestNode('a'), new TestNode('b')];
        var count = 0;
        var countingVisitor = {
            visit: function () {
                count++;
            },
        };
        root.accept(countingVisitor);
        (0, vitest_1.expect)(count).toBe(3); // root + 2 children
    });
});
