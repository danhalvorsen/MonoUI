// tests/key-geometry.test.ts
import { describe, it, expect } from 'vitest';
import { KeyBuilder, KeyName, KeyRegistry } from '../src';                            
import { buildEdges } from '../src/geometryUtils';             

// the 12 canonical key names from the registry
const allKeys = Object.keys(KeyRegistry) as KeyName[];

describe('KeyBuilder – geometry validation (all keys)', () => {
  const xOffset = 10;
  const yOffset = 20;

  /** --------------------------------------------------
   * Positive: vertices match template + translation
   * ------------------------------------------------- */
  allKeys.forEach((name) => {
    it(`${name}: vertices translated correctly`, () => {
      const built = KeyBuilder.build(name, xOffset, yOffset);
      const template = KeyRegistry[name].makeVertices();

      expect(built.vertices.length).toBe(template.length);

      built.vertices.forEach((v, i) => {
        expect(v[0]).toBeCloseTo(template[i][0] + xOffset, 5);
        expect(v[1]).toBeCloseTo(template[i][1] + yOffset, 5);
      });
    });
  });

  /** --------------------------------------------------
   * Positive: edges form a closed polygon
   * ------------------------------------------------- */
  allKeys.forEach((name) => {
    it(`${name}: edges form closed polygon`, () => {
      const built = KeyBuilder.build(name, 0, 0);
      const expected = buildEdges(built.vertices);

      expect(built.edges).toEqual(expected);
      // last edge must close to vertex 0
      expect(built.edges.at(-1)?.[1]).toBe(0);
    });
  });

  /** --------------------------------------------------
   * Negative checks (sanity)
   * ------------------------------------------------- */
  allKeys.forEach((name) => {
    it(`${name}: should NOT have exactly 4 vertices`, () => {
      const built = KeyBuilder.build(name, 0, 0);
      expect(built.vertices.length).not.toBe(4);
    });

    it(`${name}: edges must connect consecutively`, () => {
      const built = KeyBuilder.build(name, 0, 0);
      built.edges.forEach((edge, idx, arr) => {
        const next = arr[(idx + 1) % arr.length];
        expect(edge[1]).toBe(next[0]); // end of current == start of next
      });
    });
  });
});
