// packages/file-operations/tests/FileOperationsBuilder.test.ts
import { describe, it, expect, vi } from 'vitest';

// NOTE: with NodeNext resolution you need explicit .js in relative imports.
import {
  FileOperationsBuilder,
  NodeFilePath,
  NodeFileOperation,
  MockFileOperation,
  type IFilePath,
  type IFileOperation,
} from '../src/index.js';

describe('FileOperationsBuilder', () => {
  it('build() uses Node defaults when no preset is called', () => {
    const ops = new FileOperationsBuilder().build();
    expect(ops.path).toBeInstanceOf(NodeFilePath);
    expect(ops.file).toBeInstanceOf(NodeFileOperation);
  });

  it('forNode() forces NodeFilePath + NodeFileOperation', () => {
    const ops = new FileOperationsBuilder().forNode().build();
    expect(ops.path).toBeInstanceOf(NodeFilePath);
    expect(ops.file).toBeInstanceOf(NodeFileOperation);
  });

  it('forInMemory() uses NodeFilePath + MockFileOperation', () => {
    const ops = new FileOperationsBuilder().forInMemory().build();
    expect(ops.path).toBeInstanceOf(NodeFilePath);
    expect(ops.file).toBeInstanceOf(MockFileOperation);
  });

  it('supports fluent chaining and returns `this` from all mutators', () => {
    const b = new FileOperationsBuilder();
    // If any of these didn’t return `this`, the chained call would throw.
    const chained = b
      .forNode()
      .forInMemory()
      .withPath(new NodeFilePath())
      .withFile(new MockFileOperation())
      .withPathFactory(() => new NodeFilePath())
      .withFileFactory(() => new MockFileOperation());
    expect(chained).toBe(b);
  });

  it('withPath/withFile use the provided exact instances (identity preserved)', () => {
    const path = new NodeFilePath();
    const file = new MockFileOperation();

    const ops = new FileOperationsBuilder()
      .withPath(path)
      .withFile(file)
      .build();

    expect(ops.path).toBe(path);
    expect(ops.file).toBe(file);
  });

  it('withPathFactory/withFileFactory are lazy (not called until build)', () => {
    const pathFactory = vi.fn<IFilePath[], IFilePath>(() => new NodeFilePath());
    const fileFactory = vi.fn<IFileOperation[], IFileOperation>(() => new MockFileOperation());

    const builder = new FileOperationsBuilder()
      .withPathFactory(pathFactory)
      .withFileFactory(fileFactory);

    expect(pathFactory).not.toHaveBeenCalled();
    expect(fileFactory).not.toHaveBeenCalled();

    const _ops = builder.build();

    expect(pathFactory).toHaveBeenCalledTimes(1);
    expect(fileFactory).toHaveBeenCalledTimes(1);
  });

  it('factories produce fresh instances per build()', () => {
    const builder = new FileOperationsBuilder()
      .withPathFactory(() => new NodeFilePath())
      .withFileFactory(() => new MockFileOperation());

    const a = builder.build();
    const b = builder.build();

    expect(a).not.toBe(b);
    expect(a.path).not.toBe(b.path);
    expect(a.file).not.toBe(b.file);
  });

  it('static node() convenience returns Node implementations', () => {
    const ops = FileOperationsBuilder.node();
    expect(ops.path).toBeInstanceOf(NodeFilePath);
    expect(ops.file).toBeInstanceOf(NodeFileOperation);
  });

  it('integration sanity: MockFileOperation behaves as in-memory FS via builder', () => {
    const { file } = new FileOperationsBuilder().forInMemory().build();
    expect(file.exists('/mem/demo.txt')).toBe(false);
    file.write('/mem/demo.txt', 'hello');
    expect(file.exists('/mem/demo.txt')).toBe(true);
    expect(file.read('/mem/demo.txt')).toBe('hello');
  });

  it('Open–Closed: accepts custom implementations via DI', () => {
    class TestPath implements IFilePath {
      exists(): boolean { return true; }
      isDirectory(): boolean { return false; }
      relative(from: string, to: string): string { return `${from}->${to}`; }
      releativePath(from: string, to: string): string { return this.relative(from, to); }
      join(...paths: string[]): string { return paths.join('/'); }
      dirname(path: string): string { return `dir(${path})`; }
      basename(path: string): string { return `base(${path})`; }
      extname(path: string): string { return `.ext(${path})`; }
      resolve(...paths: string[]): string { return `res(${paths.join('/')})`; }
      normalize(path: string): string { return `norm(${path})`; }
    }

    class TestFile implements IFileOperation {
      store = new Map<string, string>();
      read(p: string): string { if (!this.exists(p)) throw new Error('nf'); return this.store.get(p)!; }
      write(p: string, c: string): void { this.store.set(p, c); }
      exists(p: string): boolean { return this.store.has(p); }
    }

    const tp = new TestPath();
    const tf = new TestFile();

    const ops = new FileOperationsBuilder()
      .withPath(tp)
      .withFile(tf)
      .build();

    expect(ops.path).toBe(tp);
    ops.file.write('/x', 'y');
    expect(ops.file.read('/x')).toBe('y');
  });
  it('MockFileOperation.read() throws if file not found', () => {
  const { file } = new FileOperationsBuilder().forInMemory().build();
  expect(() => file.read('/nope.txt')).toThrow(/Mock file not found/);
});

it('NodeFileOperation.read() throws if file not found', () => {
  const { file } = new FileOperationsBuilder().forNode().build();
  expect(() => file.read('__definitely_not_existing_file__.txt')).toThrow(/File not found/);
});

it('custom factories can break build if they throw', () => {
  const b = new FileOperationsBuilder()
    .withPathFactory(() => { throw new Error('Bad path factory'); })
    .withFileFactory(() => new MockFileOperation());

  expect(() => b.build()).toThrow(/Bad path factory/);
});
});
