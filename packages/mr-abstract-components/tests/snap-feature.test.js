"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var snap_1 = require("../src/utils/snap");
(0, vitest_1.describe)('snap utilities', function () {
    (0, vitest_1.it)('should snap values to the nearest grid', function () {
        (0, vitest_1.expect)((0, snap_1.snap)(4.2, 1)).toBe(4);
        (0, vitest_1.expect)((0, snap_1.snap)(4.6, 1)).toBe(5);
        (0, vitest_1.expect)((0, snap_1.snap)(4.5, 0.5)).toBe(4.5);
    });
    (0, vitest_1.it)('should snap vectors to the nearest grid', function () {
        var vec = (0, snap_1.snapVec2)(4.2, 5.8, 1);
        (0, vitest_1.expect)(vec).toEqual({ x: 4, y: 6 });
    });
});
