import { describe, it, expect } from 'vitest';
import { InMemoryFileSystemStorage } from '../src/InMemoryFileSystemStorage.js';
// If using TypeScript, ensure tsconfig.json has "module": "NodeNext" or "Node16" for .js imports, or use .ts extension if needed
import { VirtualFileSystemBuilder } from '../src/VirtualFileSystemBuilder.js';

describe('VirtualFileSystemBuilder', () => {
  const createBuilder = () => new VirtualFileSystemBuilder();

  it('should build an empty file system by default', () => {
    const fs = createBuilder().build();
    expect(fs.files.size).toBe(0);
    expect(fs.directories.size).toBe(0);
  });

  it('should add files', () => {
    const fs = createBuilder()
      .withFile('/file1.txt', 'hello')
      .withFile('/file2.txt', 'world')
      .build();

    expect(fs.files.get('/file1.txt')).toBe('hello');
    expect(fs.files.get('/file2.txt')).toBe('world');
  });

  it('should add directories', () => {
    const fs = createBuilder()
      .withDirectory('/folder1')
      .withDirectory('/folder2')
      .build();

    expect(fs.directories.has('/folder1')).toBe(true);
    expect(fs.directories.has('/folder2')).toBe(true);
  });

  it('should delete files', () => {
    const builder = createBuilder().withFile('/file1.txt', 'to delete');
    builder.withDeletedFile('/file1.txt');
    const fs = builder.build();

    expect(fs.files.has('/file1.txt')).toBe(false);
  });

  it('should delete directories', () => {
    const builder = createBuilder().withDirectory('/folder1');
    builder.withDeletedDirectory('/folder1');
    const fs = builder.build();

    expect(fs.directories.has('/folder1')).toBe(false);
  });

  it('should execute callback with file content when reading file', () => {
    let contentRead = '';
    createBuilder()
      .withFile('/file1.txt', 'read me')
      .withReadFile('/file1.txt', content => (contentRead = content))
      .build();

    expect(contentRead).toBe('read me');
  });

  it('should execute callback with true for existing file in assert exists', () => {
    let existsFlag = false;
    createBuilder()
      .withFile('/file1.txt', 'check')
      .withAssertExists('/file1.txt', exists => (existsFlag = exists))
      .build();

    expect(existsFlag).toBe(true);
  });

  it('should execute callback with false for non-existing file in assert exists', () => {
    let existsFlag = true;
    createBuilder()
      .withAssertExists('/file2.txt', exists => (existsFlag = exists))
      .build();

    expect(existsFlag).toBe(false);
  });

  it('should find files by pattern', () => {
    let results: string[] = [];
    createBuilder()
      .withFile('/file1.txt', 'data')
      .withFile('/file2.log', 'data')
      .withFindFiles('*.txt', matches => (results = matches))
      .build();

    expect(results).toContain('/file1.txt');
    expect(results).not.toContain('/file2.log');
  });

  it('should mark as immutable when withImmutable is used', () => {
    const builder = createBuilder().withFile('/file1.txt', 'data').withImmutable();
    const fs = builder.build();

    // Check for immutability state by trying to cast & mutate
    const mutableFs = fs as any;
    expect(() => mutableFs.files.set('/file2.txt', 'fail')).toThrowError();
  });
});
