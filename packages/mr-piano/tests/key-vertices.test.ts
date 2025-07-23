// tests/key-vertices.test.ts
import { describe, it, expect } from 'vitest';
import { KeyBuilder } from '../src/keyBuilder.js';
// Update the import path below if 'KeyTypes' is exported from a local file
import { KeyTypes } from '../src/keyTypes.js';

describe('KeyBuilder - C key vertex count', () => {
  it('Positive: C key should have exactly 6 vertices', () => {
    const key = KeyBuilder.build('C', 0, 0);
    expect(key.vertices.length).toBe(6);
  });

  it('Negative: C key should NOT have only 4 vertices', () => {
    const key = KeyBuilder.build('C', 0, 0);
    expect(key.vertices.length).not.toBe(4);
  });
});

describe('KeyBuilder - C key vertices values', () => {
  it('C key vertices should match template + translation', () => {
    const xOffset = 10;
    const yOffset = 20;
    const builtKey = KeyBuilder.build('C', xOffset, yOffset);
    // Use alias import if configured in vite.config.ts, e.g., '@mr-piano/keyTypes'
    // import { KeyTypes } from '@mr-piano/keyTypes';
    // For this test, we assume the alias resolves correctly.
    const template = KeyTypes['C'].baseVertices;

    expect(builtKey.vertices.length).toBe(template.length);

    builtKey.vertices.forEach((v, i) => {
      const [expectedX, expectedY] = [
        template[i][0] + xOffset,
        template[i][1] + yOffset,
      ];
      expect(v[0]).toBeCloseTo(expectedX, 5);
      expect(v[1]).toBeCloseTo(expectedY, 5);
    });
  });
});

// tests/key-geometry.test.ts
import { describe, it, expect } from 'vitest';
import { KeyBuilder } from '../src/keyBuilder.js';
import { KeyTypes, KeyName } from '../src/keyTypes.js';
import { buildEdges } from '../src/geometryUtils.js';

const allKeys = Object.keys(KeyTypes) as KeyName[];

describe('KeyBuilder - Geometry validation for all keys', () => {
  allKeys.forEach((name) => {
    const xOffset = 10;
    const yOffset = 20;

    it(`${name} key: Positive - vertices match template + translation`, () => {
      const builtKey = KeyBuilder.build(name, xOffset, yOffset);
      const template = KeyTypes[name].baseVertices;

      expect(builtKey.vertices.length).toBe(template.length);
      builtKey.vertices.forEach((v, i) => {
        const [expectedX, expectedY] = [
          template[i][0] + xOffset,
          template[i][1] + yOffset,
        ];
        expect(v[0]).toBeCloseTo(expectedX, 5);
        expect(v[1]).toBeCloseTo(expectedY, 5);
      });
    });

    it(`${name} key: Positive - edges form a closed polygon`, () => {
      const builtKey = KeyBuilder.build(name, 0, 0);
      const expectedEdges = buildEdges(builtKey.vertices);

      expect(builtKey.edges.length).toBe(expectedEdges.length);
      builtKey.edges.forEach((edge, i) => {
        expect(edge[0]).toBe(expectedEdges[i][0]);
        expect(edge[1]).toBe(expectedEdges[i][1]);
      });
      const lastEdge = builtKey.edges[builtKey.edges.length - 1];
      expect(lastEdge[1]).toBe(0);
    });

    // Negative: Vertex count should NOT be 4
    it(`${name} key: Negative - should NOT have only 4 vertices`, () => {
      const builtKey = KeyBuilder.build(name, 0, 0);
      expect(builtKey.vertices.length).not.toBe(4);
    });

    // Negative: Edges should NOT be disconnected
    it(`${name} key: Negative - edges must connect consecutively`, () => {
      const builtKey = KeyBuilder.build(name, 0, 0);

      for (let i = 0; i < builtKey.edges.length - 1; i++) {
        const currentEnd = builtKey.edges[i][1];
        const nextStart = builtKey.edges[i + 1][0];
        expect(currentEnd).toBe(nextStart);
      }
    });
  });
});
