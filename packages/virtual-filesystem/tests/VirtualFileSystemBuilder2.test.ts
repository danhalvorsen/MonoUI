import { describe, it, expect } from 'vitest';
import { VirtualFileSystemBuilder } from '../src/VirtualFileSystemBuilder.js';

describe('VirtualFileSystemBuilder real scenario', () => {
  it('should simulate an npm package structure and prevent mutation when immutable', () => {
    const fs = new VirtualFileSystemBuilder()
      .withDirectory('/src')
      .withFile('/src/index.ts', 'export const x = 42;')
      .withDirectory('/tests')
      .withFile('/tests/index.test.ts', 'test("x", ()=>{})')
      .withFile('/package.json', JSON.stringify({ name: 'pkg', version: '1.0.0' }))
      .withImmutable()
      .build();

    // Ensure content is correct
    expect(fs.files.get('/src/index.ts')).toBe('export const x = 42;');
    expect(fs.directories.has('/src')).toBe(true);

    // Ensure immutability works
    const files = fs.files as any;
    expect(() => files.set('/src/hack.ts', 'nope')).toThrowError();
  });
});
