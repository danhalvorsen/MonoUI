// tests/key-vertices.test.ts
import { describe, it, expect } from 'vitest';
import { KeyBuilder } from '../src';
import { KeyRegistry } from '../src'; 

/* -------------------------------------------------- *
 * Vertex‑count checks for C
 * -------------------------------------------------- */
describe('KeyBuilder – C key vertex count', () => {
  it('Positive: C key should have exactly 6 vertices', () => {
    const key = KeyBuilder.build('C', 0, 0);
    expect(key.vertices.length).toBe(6);
  });

  it('Negative: C key should NOT have only 4 vertices', () => {
    const key = KeyBuilder.build('C', 0, 0);
    expect(key.vertices.length).not.toBe(4);
  });
});

/* -------------------------------------------------- *
 * Vertex‑value translation check for C
 * -------------------------------------------------- */
describe('KeyBuilder – C key vertex values', () => {
  it('C vertices should match template + translation', () => {
    const dx = 10;
    const dy = 20;

    const built   = KeyBuilder.build('C', dx, dy);
    const template = KeyRegistry['C'].makeVertices();

    expect(built.vertices.length).toBe(template.length);

    built.vertices.forEach((v, i) => {
      expect(v[0]).toBeCloseTo(template[i][0] + dx, 5);
      expect(v[1]).toBeCloseTo(template[i][1] + dy, 5);
    });
  });
});
