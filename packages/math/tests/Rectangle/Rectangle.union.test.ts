// File: packages/math/tests/Rectangle/Rectangle.union.test.ts
import { describe, it, expect } from 'vitest';
import { Rectangle, Vector2 } from '../../dist/index.js';

describe('Rectangle.union – concrete implementation', () => {
  const cases: Array<[
    string,
    Rectangle,
    Rectangle,
    { min: Vector2; max: Vector2 }
  ]> = [
    [
      'partial overlap',
      new Rectangle(new Vector2(0,  0), new Vector2(1, 1)),
      new Rectangle(new Vector2(0.5,-1), new Vector2(1, 2)),
      { min: new Vector2(0, -1), max: new Vector2(1, 2) },
    ],
    [
      'disjoint',
      new Rectangle(new Vector2(0, 0), new Vector2(1, 1)),
      new Rectangle(new Vector2(2, 2), new Vector2(3, 3)),
      { min: new Vector2(0, 0), max: new Vector2(3, 3) },
    ],
    [
      'containment',
      new Rectangle(new Vector2(-1,-1), new Vector2(2, 2)),
      new Rectangle(new Vector2( 0, 0), new Vector2(1, 1)),
      { min: new Vector2(-1,-1), max: new Vector2(2, 2) },
    ],
    [
      'edge touch',
      new Rectangle(new Vector2(0,0), new Vector2(1,1)),
      new Rectangle(new Vector2(1,0), new Vector2(2,1)),
      { min: new Vector2(0,0), max: new Vector2(2,1) },
    ],
  ];

  it.each(cases)('%s', (_label, r1, r2, { min, max }) => {
    const u = r1.union(r2);
    expect(u.vertices[0]).toMatchObject(min);
    expect(u.vertices[2]).toMatchObject(max);
  });
});
