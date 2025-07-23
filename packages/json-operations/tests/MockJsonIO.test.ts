import { describe, it } from 'vitest';
import { MockJsonIO } from '../src/MockJsonIO.js';

describe('MockJsonIO', () => {
  it('should read and write JSON in memory', () => {
    const mock = new MockJsonIO();
    const path = 'foo.json';
    const data = { hello: 'world' };

    mock.writeJson(path, data);
    const result = mock.readJson<typeof data>(path);
    expect(result).toEqual(data);
  });

  it('should report existence correctly', () => {
    const mock = new MockJsonIO();
    const path = 'exists.json';
    mock.writeJson(path, { ok: true });

    expect(mock.exists(path)).toBe(true);
    expect(mock.exists('missing.json')).toBe(false);
  });

  it('should throw when reading nonexistent path', () => {
    const mock = new MockJsonIO();
    expect(() => mock.readJson('bad.json')).toThrow();
  });
});
