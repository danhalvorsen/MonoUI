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
// tests/ObjectBaseTransform.test.ts
var vitest_1 = require("vitest");
var ObjectBase_1 = require("../src/abstractions/world/ObjectBase");
var TestObject = /** @class */ (function (_super) {
    __extends(TestObject, _super);
    function TestObject() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestObject.prototype.draw = function (ctx) {
        // no-op for testing
    };
    return TestObject;
}(ObjectBase_1.ObjectBase));
(0, vitest_1.describe)('ObjectBase transform system', function () {
    (0, vitest_1.it)('should compute world matrix as identity for root', function () {
        var obj = new TestObject('root');
        obj.position.x = 10;
        obj.position.y = 20;
        obj.rotation = Math.PI / 4;
        obj.scale.x = 2;
        obj.scale.y = 2;
        obj.updateWorldMatrix();
        var m = obj.worldMatrix.toFloat32Array();
        (0, vitest_1.expect)(m[2]).toBeCloseTo(10); // tx
        (0, vitest_1.expect)(m[5]).toBeCloseTo(20); // ty
    });
    (0, vitest_1.it)('should update child world matrix when parent transforms', function () {
        var parent = new TestObject('parent');
        var child = new TestObject('child');
        parent.addChild(child);
        parent.position.x = 50;
        parent.position.y = 50;
        child.position.x = 10;
        child.position.y = 0;
        parent.updateWorldMatrix();
        var childWorld = child.worldMatrix.toFloat32Array();
        (0, vitest_1.expect)(childWorld[2]).toBeCloseTo(60); // parent's 50 + child's 10
        (0, vitest_1.expect)(childWorld[5]).toBeCloseTo(50);
    });
    (0, vitest_1.it)('should propagate scale and rotation to child', function () {
        var parent = new TestObject('parent');
        var child = new TestObject('child');
        parent.addChild(child);
        parent.scale.x = 2;
        parent.scale.y = 2;
        child.position.x = 5;
        parent.updateWorldMatrix();
        var childWorld = child.worldMatrix.toFloat32Array();
        (0, vitest_1.expect)(childWorld[2]).toBeCloseTo(10); // scaled by parent
    });
});
