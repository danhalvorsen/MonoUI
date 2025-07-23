// tests/builder-clone.test.ts
import { describe, it, expect } from 'vitest';
import { KeyBuilder } from '../src/keyBuilder.js';
import { OctaveBuilder } from '../src/octaveBuilder.js';

describe('KeyBuilder and OctaveBuilder cloning', () => {
  it('KeyBuilder returns fresh mutable copies', () => {
    const key1 = KeyBuilder.build('C', 0, 0);
    const key2 = KeyBuilder.build('C', 0, 0);

    // Mutate key1
    key1.vertices[0][0] = 999;
    key1.edges[0][0] = 999;

    // Ensure key2 unaffected
    expect(key2.vertices[0][0]).not.toBe(999);
    expect(key2.edges[0][0]).not.toBe(999);
  });

  it('OctaveBuilder returns independent keys', () => {
    const keys = new OctaveBuilder().buildOctave();
    const cKey = keys.find(k => k.name === 'C')!;
    const dKey = keys.find(k => k.name === 'D')!;

    // Mutate C key
    cKey.vertices[0][0] = 123;
    cKey.edges[0][0] = 123;

    // D key should remain unchanged
    expect(dKey.vertices[0][0]).not.toBe(123);
    expect(dKey.edges[0][0]).not.toBe(123);
  });
});
