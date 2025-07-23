// tests/keys.test.ts
import { describe, it, expect } from 'vitest';
import { KeyBuilder, KeyName, KeyRegistry } from '../src';
 
describe('individual keys – vertex / edge count', () => {
  Object.keys(KeyRegistry).forEach((name) => {
    it(`builds ${name} with ≥4 vertices and matching edges`, () => {
      const key = KeyBuilder.build(name as KeyName, 100, 100);
      expect(key.vertices.length).toBeGreaterThanOrEqual(4);
      expect(key.edges.length).toBe(key.vertices.length);
    });
  });
});