// File: packages/math/tests/Rectangle/IRectangle.test.ts
import { describe, it, expect } from 'vitest';
import { Vector2 } from '../../src/implementations/Vector2';
import { makeRect } from './helpers';

describe('IRectangle basic geometry operations', () => {
  const insidePoint   = new Vector2(5, 5);
  const outsidePoint  = new Vector2(15, 5);
  const base          = makeRect(0, 0, 10, 10);

  describe.each([
    ['contains', () => base.contains(insidePoint),  true],
    ['contains (outside)', () => base.contains(outsidePoint), false],
    ['intersects', () => base.intersects(makeRect(5, 5, 10, 10)), true],
    ['intersects (disjoint)', () => base.intersects(makeRect(20, 20, 5, 5)), false],
  ])('%s', (_name, fn, expected) => {
    it(`returns ${expected}`, () => expect(fn()).toBe(expected));
  });

  describe('union', () => {
    it('covers both rectangles', () => {
      const u = base.union(makeRect(5, 5, 10, 10));
      expect(u.contains(new Vector2(0, 0))).toBe(true);
      expect(u.contains(new Vector2(15, 15))).toBe(true);
    });
  });

  describe('intersectionRect', () => {
    it.each([
      ['overlap', makeRect(5, 5, 10, 10), true],
      ['no‑overlap', makeRect(20, 20, 5, 5), false],
    ])('returns %s', (_case, other, shouldExist) => {
      const i = base.intersectionRect(other);
      expect(i !== null).toBe(shouldExist);
    });
  });
});
