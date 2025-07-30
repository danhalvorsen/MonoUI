// File: packages/math/tests/Rectangle/Rectangle.subtract.test.ts
import { describe, it, expect } from 'vitest';
import { Rectangle, Vector2 } from '../../dist/index.js';

describe('Rectangle.subtract – L‑shape mesh', () => {
  it('subtracts correctly', () => {
    const original   = new Rectangle(new Vector2(0, 0), new Vector2(2, 1));
    const toSubtract = new Rectangle(new Vector2(1, 0.1), new Vector2(3, 0.9));
    const mesh       = original.subtract(toSubtract);

    expect(mesh.polygons).toHaveLength(1);
    const poly = mesh.polygons[0];
    expect(poly).toHaveLength(6);

    const expected = [
      { x: 0, y: 0   },
      { x: 1, y: 0   },
      { x: 1, y: 0.1 },
      { x: 1, y: 0.9 },
      { x: 1, y: 1   },
      { x: 0, y: 1   },
    ];

    poly.forEach((v, i) => {
      expect(v.x).toBeCloseTo(expected[i].x);
      expect(v.y).toBeCloseTo(expected[i].y);
    });
  });
});
