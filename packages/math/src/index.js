"use strict";
// File: packages/math/src/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplineInterpolator3D = exports.CatmullRomSpline3D = exports.LinearInterpolator3D = exports.Line = exports.BoundingBox2D = exports.Transformer = exports.ImplTransform = exports.Matrix = exports.Vector3 = exports.Vector2 = void 0;
// --- Vectors ---
var Vector2_1 = require("./implementations/Vector2");
Object.defineProperty(exports, "Vector2", { enumerable: true, get: function () { return Vector2_1.Vector2; } });
var Vector3_1 = require("./implementations/Vector3");
Object.defineProperty(exports, "Vector3", { enumerable: true, get: function () { return Vector3_1.Vector3; } });
// --- Matrix & Transform ---
var Matrix4_1 = require("./implementations/Matrix4");
Object.defineProperty(exports, "Matrix", { enumerable: true, get: function () { return Matrix4_1.Matrix; } });
var Transform_1 = require("./implementations/Transform");
Object.defineProperty(exports, "ImplTransform", { enumerable: true, get: function () { return Transform_1.Transform; } });
var Transform_2 = require("./transformers/Transform");
Object.defineProperty(exports, "Transformer", { enumerable: true, get: function () { return Transform_2.Transform; } });
// --- Geometry ---
var BoundingBox_1 = require("./implementations/BoundingBox");
Object.defineProperty(exports, "BoundingBox2D", { enumerable: true, get: function () { return BoundingBox_1.BoundingBox2D; } });
var Line_1 = require("./implementations/Line");
Object.defineProperty(exports, "Line", { enumerable: true, get: function () { return Line_1.Line; } });
// --- Interpolation ---
var LinearInterpolator3D_1 = require("./interpolation/LinearInterpolator3D");
Object.defineProperty(exports, "LinearInterpolator3D", { enumerable: true, get: function () { return LinearInterpolator3D_1.LinearInterpolator3D; } });
var CatmullRomSpline3D_1 = require("./interpolation/CatmullRomSpline3D");
Object.defineProperty(exports, "CatmullRomSpline3D", { enumerable: true, get: function () { return CatmullRomSpline3D_1.CatmullRomSpline3D; } });
var SplineInterpolator3D_1 = require("./interpolation/SplineInterpolator3D");
Object.defineProperty(exports, "SplineInterpolator3D", { enumerable: true, get: function () { return SplineInterpolator3D_1.SplineInterpolator3D; } });
