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
(0, vitest_1.describe)('NodeBase', function () {
    (0, vitest_1.it)('should accept a visitor and traverse children', function () {
        var root = new (/** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_1.prototype.draw = function () { };
            return class_1;
        }(src_1.NodeBase)))('root');
        var child1 = new (/** @class */ (function (_super) {
            __extends(class_2, _super);
            function class_2() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_2.prototype.draw = function () { };
            return class_2;
        }(src_1.NodeBase)))('child1');
        var child2 = new (/** @class */ (function (_super) {
            __extends(class_3, _super);
            function class_3() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_3.prototype.draw = function () { };
            return class_3;
        }(src_1.NodeBase)))('child2');
        root.children = [child1, child2];
        var visited = [];
        var visitor = { visit: function (node) { return visited.push(node.id); } };
        root.accept(visitor);
        (0, vitest_1.expect)(visited).toEqual(['root', 'child1', 'child2']);
    });
});
(0, vitest_1.describe)('WorldBase', function () {
    (0, vitest_1.it)('should find a node by id', function () {
        var world = new src_1.WorldBase('world1');
        var child = new (/** @class */ (function (_super) {
            __extends(class_4, _super);
            function class_4() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_4.prototype.draw = function () { };
            return class_4;
        }(src_1.NodeBase)))('child1');
        world.children = [child];
        var found = world.findNodeById('child1');
        (0, vitest_1.expect)(found).toBe(child);
    });
    (0, vitest_1.it)('should return undefined if node is not found', function () {
        var world = new src_1.WorldBase('world1');
        var found = world.findNodeById('nonexistent');
        (0, vitest_1.expect)(found).toBeUndefined();
    });
});
(0, vitest_1.describe)('ArrayIterator', function () {
    (0, vitest_1.it)('should iterate over an array', function () {
        var arr = [1, 2, 3];
        var iterator = new src_1.ArrayIterator(arr);
        var values = [];
        while (iterator.hasNext()) {
            iterator.next();
            values.push(iterator.current());
        }
        (0, vitest_1.expect)(values).toEqual([1, 2, 3]);
    });
    (0, vitest_1.it)('should throw if current is called before next', function () {
        var arr = [1];
        var iterator = new src_1.ArrayIterator(arr);
        (0, vitest_1.expect)(function () { return iterator.current(); }).toThrow();
    });
});
(0, vitest_1.describe)('NodeIterator', function () {
    (0, vitest_1.it)('should traverse nodes depth-first', function () {
        var root = new (/** @class */ (function (_super) {
            __extends(class_5, _super);
            function class_5() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_5.prototype.draw = function () { };
            return class_5;
        }(src_1.NodeBase)))('root');
        var child1 = new (/** @class */ (function (_super) {
            __extends(class_6, _super);
            function class_6() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_6.prototype.draw = function () { };
            return class_6;
        }(src_1.NodeBase)))('child1');
        var child2 = new (/** @class */ (function (_super) {
            __extends(class_7, _super);
            function class_7() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_7.prototype.draw = function () { };
            return class_7;
        }(src_1.NodeBase)))('child2');
        root.children = [child1];
        child1.children = [child2];
        var iterator = new src_1.NodeIterator(root);
        var visited = [];
        while (iterator.hasNext()) {
            iterator.next();
            visited.push(iterator.current().id);
        }
        (0, vitest_1.expect)(visited).toEqual(['root', 'child1', 'child2']);
    });
});
