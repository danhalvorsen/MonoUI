import { describe, it, expect } from 'vitest';
import { MockFileOperation } from '../src/MockFileOperation';

describe('MockFileOperation', () => {
  it('reads and writes to virtual files', () => {
    const mock = new MockFileOperation();
    mock.write('foo.txt', 'hello');
    expect(mock.read('foo.txt')).toBe('hello');
  });

  it('checks existence', () => {
    const mock = new MockFileOperation();
    mock.write('exists.txt', 'ok');
    expect(mock.exists('exists.txt')).toBe(true);
    expect(mock.exists('missing.txt')).toBe(false);
  });

  it('throws on missing read', () => {
    const mock = new MockFileOperation();
    expect(() => mock.read('404.txt')).toThrow();
  });
});
