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
var index_js_1 = require("../../src//index.js");
var TestObject = /** @class */ (function (_super) {
    __extends(TestObject, _super);
    function TestObject() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestObject.prototype.draw = function (ctx) { };
    return TestObject;
}(index_js_1.ObjectBase));
(0, vitest_1.describe)('Canvas2DRenderer', function () {
    var canvas;
    var ctx;
    (0, vitest_1.beforeEach)(function () {
        // Mocked canvas + 2D context
        ctx = {
            setTransform: vitest_1.vi.fn(),
            fillRect: vitest_1.vi.fn(),
            strokeRect: vitest_1.vi.fn(),
            clearRect: vitest_1.vi.fn(),
            save: vitest_1.vi.fn(),
            restore: vitest_1.vi.fn(),
        };
        canvas = {
            width: 800,
            height: 600,
            getContext: vitest_1.vi.fn().mockReturnValue(ctx)
        };
    });
    (0, vitest_1.it)('should initialize and clear the canvas', function () {
        var renderer = new index_js_1.Canvas2DRenderer(canvas);
        renderer.initialize();
        (0, vitest_1.expect)(ctx.clearRect).toHaveBeenCalledWith(0, 0, 800, 600);
    });
    (0, vitest_1.it)('should render an object using its world matrix', function () {
        var renderer = new index_js_1.Canvas2DRenderer(canvas);
        var obj = new TestObject('obj1');
        obj.size = { width: 50, height: 100 };
        obj.position.x = 10;
        obj.position.y = 20;
        obj.configuration = {
            id: 'obj1',
            visual: { style: { fill: '#ff0000', stroke: '#000000', strokeWidth: 2 } },
            interaction: { draggable: false, selected: false },
            connectors: [],
        };
        obj.updateWorldMatrix();
        renderer.renderObject(obj);
        (0, vitest_1.expect)(ctx.save).toHaveBeenCalled();
        (0, vitest_1.expect)(ctx.setTransform).toHaveBeenCalled();
        (0, vitest_1.expect)(ctx.fillRect).toHaveBeenCalledWith(0, 0, 50, 100);
        (0, vitest_1.expect)(ctx.strokeRect).toHaveBeenCalledWith(0, 0, 50, 100);
        (0, vitest_1.expect)(ctx.restore).toHaveBeenCalled();
    });
    (0, vitest_1.it)('should resize the canvas', function () {
        var renderer = new index_js_1.Canvas2DRenderer(canvas);
        renderer.resize(1024, 768);
        (0, vitest_1.expect)(canvas.width).toBe(1024);
        (0, vitest_1.expect)(canvas.height).toBe(768);
    });
});
