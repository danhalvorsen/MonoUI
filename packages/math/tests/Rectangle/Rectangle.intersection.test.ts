// File: packages/math/tests/Rectangle/Rectangle.intersection.test.ts
import { describe, it, expect } from 'vitest';
import { Rectangle, Vector2 } from '../../dist/index';

describe('Rectangle.intersectionRect – concrete implementation', () => {
  it('partial overlap', () => {
    const r1 = new Rectangle(new Vector2(0, 0), new Vector2(1, 1));
    const r2 = new Rectangle(new Vector2(0.5, -1), new Vector2(1, 2));
    const i  = r1.intersectionRect(r2)!;

    expect(i.vertices[0]).toEqual(expect.objectContaining({ x: 0.5, y: 0 }));
    expect(i.vertices[2]).toEqual(expect.objectContaining({ x: 1,   y: 1 }));
  });

  it('no overlap -> null', () => {
    const r1 = new Rectangle(new Vector2(0, 0), new Vector2(1, 1));
    const r2 = new Rectangle(new Vector2(2, 2), new Vector2(3, 3));
    expect(r1.intersectionRect(r2)).toBeNull();
  });

  it('inner rectangle -> returns inner', () => {
    const outer = new Rectangle(new Vector2(-1, -1), new Vector2(2, 2));
    const inner = new Rectangle(new Vector2(0, 0), new Vector2(1, 1));
    const i     = outer.intersectionRect(inner)!;
    expect(i.vertices[0]).toMatchObject({ x: 0, y: 0 });
    expect(i.vertices[2]).toMatchObject({ x: 1, y: 1 });
  });

  it('edge‑touch -> null', () => {
    const r1 = new Rectangle(new Vector2(0, 0), new Vector2(1, 1));
    const r2 = new Rectangle(new Vector2(1, 0), new Vector2(2, 1));
    expect(r1.intersectionRect(r2)).toBeNull();
  });
});
