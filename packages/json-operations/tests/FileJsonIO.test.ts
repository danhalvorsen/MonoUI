import { describe, it, expect } from 'vitest';
import { FileJsonIO } from '../src/FileJsonIO.js';
import { writeFileSync, unlinkSync } from 'fs';

describe('FileJsonIO', () => {
  const path = './temp-test.json';

  afterEach(() => {
    try { unlinkSync(path); } catch {}

  });

  it('should write and read JSON file correctly', () => {
    const io = new FileJsonIO();
    const data = { foo: 'bar', num: 42 };
    io.writeJson(path, data);

    const result = io.readJson<typeof data>(path);
    expect(result).toEqual(data);
  });

  it('should report existence correctly', () => {
    const io = new FileJsonIO();
    io.writeJson(path, { ok: true });

    expect(io.exists(path)).toBe(true);
    expect(io.exists('nonexistent.json')).toBe(false);
  });

  it('should throw when reading non-existent file', () => {
    const io = new FileJsonIO();
    expect(() => io.readJson('does-not-exist.json')).toThrow();
  });
});
