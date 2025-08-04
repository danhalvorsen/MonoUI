import { describe, it, expect } from 'vitest';

import { ArrayIterator, INodeVisitor, NodeIterator, NodeBase, WorldBase } from '../../src';
describe('NodeBase', () => {
    it('should accept a visitor and traverse children', () => {
        const root = new (class extends NodeBase { draw() {} })('root');
        const child1 = new (class extends NodeBase { draw() {} })('child1');
        const child2 = new (class extends NodeBase { draw() {} })('child2');
        root.children = [child1, child2];

        const visited: string[] = [];
        const visitor: INodeVisitor = { visit: node => visited.push(node.id) };

        root.accept(visitor);

        expect(visited).toEqual(['root', 'child1', 'child2']);
    });
});

describe('WorldBase', () => {
    it('should find a node by id', () => {
        const world = new WorldBase('world1');
        const child = new (class extends NodeBase { draw() {} })('child1');
        world.children = [child];

        const found = world.findNodeById('child1');
        expect(found).toBe(child);
    });

    it('should return undefined if node is not found', () => {
        const world = new WorldBase('world1');
        const found = world.findNodeById('nonexistent');
        expect(found).toBeUndefined();
    });
});

describe('ArrayIterator', () => {
    it('should iterate over an array', () => {
        const arr = [1, 2, 3];
        const iterator = new ArrayIterator(arr);

        const values: number[] = [];
        while (iterator.hasNext()) {
            iterator.next();
            values.push(iterator.current());
        }

        expect(values).toEqual([1, 2, 3]);
    });

    it('should throw if current is called before next', () => {
        const arr = [1];
        const iterator = new ArrayIterator(arr);
        expect(() => iterator.current()).toThrow();
    });
});

describe('NodeIterator', () => {
    it('should traverse nodes depth-first', () => {
        const root = new (class extends NodeBase { draw() {} })('root');
        const child1 = new (class extends NodeBase { draw() {} })('child1');
        const child2 = new (class extends NodeBase { draw() {} })('child2');
        root.children = [child1];
        child1.children = [child2];

        const iterator = new NodeIterator(root);
        const visited: string[] = [];
        while (iterator.hasNext()) {
            iterator.next();
            visited.push(iterator.current().id);
        }

        expect(visited).toEqual(['root', 'child1', 'child2']);
    });
});
