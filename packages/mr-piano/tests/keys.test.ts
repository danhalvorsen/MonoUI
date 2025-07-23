
import { describe, it, expect, beforeEach } from 'vitest';
import { KeyBuilder } from '../src/keyBuilder.js';
import { KeyTypes } from '../src/keyTypes.js';

describe('individual keys', () => {
  Object.keys(KeyTypes).forEach(keyName=>{
    it(`should build key ${keyName} with vertices >=4 and matching edges`,()=>{
      const key = KeyBuilder.build(keyName as any, 100, 100);
      expect(key.vertices.length).toBeGreaterThanOrEqual(4);
      expect(key.edges.length).toBe(key.vertices.length);
    });
  });
});
