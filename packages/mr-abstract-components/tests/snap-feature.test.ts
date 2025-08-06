import { describe, it, expect } from 'vitest';
import { snap, snapVec2 } from '../src/utils/snap';
 
  

describe('snap utilities', () => {
  it('should snap values to the nearest grid', () => {
    expect(snap(4.2, 1)).toBe(4);
    expect(snap(4.6, 1)).toBe(5);
    expect(snap(4.5, 0.5)).toBe(4.5);
  });

  it('should snap vectors to the nearest grid', () => {
    const vec = snapVec2(4.2, 5.8, 1);
    expect(vec).toEqual({ x: 4, y: 6 });
  });
});
