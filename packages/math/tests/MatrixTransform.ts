import { Matrix } from '../src/implementations/Matrix4.js'
import { describe, expect, it } from 'vitest';
import { Vector2 } from '../src/implementations/Vector2.js';
import { Transform } from '../src/implementations/Transform.js';

describe('Transform.transformVec2', () => {
  it('should apply a 2x2 rotation matrix to a vector', () => {
    const angle = Math.PI / 2; // 90°
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const rotation = new Matrix([
      [cos, -sin],
      [sin, cos],
    ]);

    const t = new Transform(rotation);
    const v = new Vector2(1, 0);
    const result = t.transformVec2(v);
    expect(result.equals(new Vector2(0, 1), 1e-6)).toBe(true);
  });

  it('should apply a 2x2 scaling matrix', () => {
    const scale = new Matrix([
      [2, 0],
      [0, 3],
    ]);

    const t = new Transform(scale);
    const v = new Vector2(1, 1);
    const result = t.transformVec2(v);
    expect(result.equals(new Vector2(2, 3))).toBe(true);
  });

  it('should apply a 3x3 affine transform matrix (scale + translation)', () => {
    const affine = new Matrix([
      [2, 0, 5],
      [0, 2, 6],
      [0, 0, 1],
    ]);

    const t = new Transform(affine);
    const v = new Vector2(1, 1);
    const result = t.transformVec2(v);
    expect(result.equals(new Vector2(7, 8))).toBe(true);
  });

  it('should throw on unsupported matrix size', () => {
    const bad = new Matrix([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ]);

    const t = new Transform(bad);
    const v = new Vector2(1, 1);
    expect(() => t.transformVec2(v)).toThrow(
      'transformVec2: unsupported matrix size'
    );
  });
});
