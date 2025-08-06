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
var ObjectBase_js_1 = require("../src/abstractions/world/ObjectBase.js");
var TestObject = /** @class */ (function (_super) {
    __extends(TestObject, _super);
    function TestObject() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.drawCalled = false;
        _this.children = [];
        return _this;
    }
    TestObject.prototype.draw = function (ctx) {
        this.drawCalled = true;
        ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
    };
    return TestObject;
}(ObjectBase_js_1.ObjectBase));
(0, vitest_1.describe)('ObjectBase lifecycle', function () {
    (0, vitest_1.it)('should call draw on parent and children', function () {
        var ctx = { fillRect: vitest_1.vi.fn() };
        var parent = new TestObject('parent');
        var child = new TestObject('child');
        parent.children = [child];
        parent.render(ctx);
        (0, vitest_1.expect)(parent.drawCalled).toBe(true);
        (0, vitest_1.expect)(child.drawCalled).toBe(true);
        (0, vitest_1.expect)(ctx.fillRect).toHaveBeenCalledTimes(2);
    });
    (0, vitest_1.it)('should trigger willUpdate and updated lifecycle hooks in order', function () {
        var ctx = { fillRect: vitest_1.vi.fn() };
        var parent = new TestObject('parent');
        var willUpdateSpy = vitest_1.vi.fn();
        var updatedSpy = vitest_1.vi.fn();
        parent.willUpdate = willUpdateSpy;
        parent.updated = updatedSpy;
        parent.render(ctx);
        (0, vitest_1.expect)(willUpdateSpy).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(updatedSpy).toHaveBeenCalledTimes(1);
        // Ensure willUpdate is called before updated
        var willUpdateCall = willUpdateSpy.mock.invocationCallOrder[0];
        var updatedCall = updatedSpy.mock.invocationCallOrder[0];
        (0, vitest_1.expect)(willUpdateCall).toBeLessThan(updatedCall);
    });
    (0, vitest_1.it)('should trigger firstUpdated only on first render', function () {
        var ctx = { fillRect: vitest_1.vi.fn() };
        var parent = new TestObject('parent');
        var firstUpdatedSpy = vitest_1.vi.fn();
        parent.firstUpdated = firstUpdatedSpy;
        parent.render(ctx);
        parent.render(ctx); // render again
        (0, vitest_1.expect)(firstUpdatedSpy).toHaveBeenCalledTimes(1); // only first time
    });
    (0, vitest_1.it)('should skip rendering when shouldUpdate returns false', function () {
        var ctx = { fillRect: vitest_1.vi.fn() };
        var parent = new TestObject('parent');
        var shouldUpdateSpy = vitest_1.vi.fn(function () { return false; });
        parent.shouldUpdate = shouldUpdateSpy;
        parent.render(ctx);
        (0, vitest_1.expect)(shouldUpdateSpy).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(ctx.fillRect).not.toHaveBeenCalled(); // draw() not executed
    });
});
