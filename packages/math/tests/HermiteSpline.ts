import { Vector3 } from "../src/implementations/Vector3.js";
import { Vector3HermiteFn } from "../src/implementations/interpolation/hermiteInterpolation/vector3HermiteFn.js";
import { HermiteInterpolationStrategy } from "../src/implementations/interpolation/hermiteInterpolation/HermiteInterpolationStrategy.js";
import { describe, it, expect } from "vitest";
import { HermiteSpline } from "../src/implementations/interpolation/hermiteInterpolation/HermiteSpline.js";

class FiniteDifferenceTangentStrategy {
  estimate(points: Vector3[], index: number): Vector3 {
    const prev = points[Math.max(index - 1, 0)];
    const next = points[Math.min(index + 1, points.length - 1)];
    return next.subtract(prev).multiplyScalar(0.5);
  }
}

describe("HermiteSpline<Vector3>", () => {
  const controlPoints = [
    new Vector3(0, 0, 0),
    new Vector3(1, 1, 0),
    new Vector3(2, 0, 0),
  ];

  const tangentStrategy = new FiniteDifferenceTangentStrategy();
  const interpolationStrategy = new HermiteInterpolationStrategy<Vector3>(Vector3HermiteFn);
  const spline = new HermiteSpline<Vector3>(controlPoints, tangentStrategy, interpolationStrategy);

  it("evaluates the spline at t = 0", () => {
    const point = spline.at(0);
    expect(point.x).toBeCloseTo(0);
    expect(point.y).toBeCloseTo(0);
  });

  it("evaluates the spline at t = 1", () => {
    const point = spline.at(1);
    expect(point.x).toBeCloseTo(1);
    expect(point.y).toBeCloseTo(1);
  });

  it("evaluates the spline at t = 1.5", () => {
    const point = spline.at(1.5);
    expect(point.x).toBeGreaterThan(1);
  });

  it("returns correct control points", () => {
    const points = spline.getPoints();
    expect(points.length).toBe(3);
  });
});
