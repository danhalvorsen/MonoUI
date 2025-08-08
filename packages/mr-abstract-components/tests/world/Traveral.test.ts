import { describe, it, expect } from 'vitest';
import { NodeBase } from '../../src/index.js';
import { Traversal } from '../../src/Datastructures/Node/Traversal.js';

class TestNode extends NodeBase { draw() {} }

describe('Traversal', () => {
    const root = new TestNode('root');
    const left = new TestNode('left');
    const right = new TestNode('right');
    const leftChild = new TestNode('leftChild');
    root.children = [left, right];
    left.children = [leftChild];

    it('should traverse in preorder', () => {
        const visited: string[] = [];
        new Traversal('preorder').traverse(root, n => visited.push(n.id));
        expect(visited).toEqual(['root', 'left', 'leftChild', 'right']);
    });

    it('should traverse in postorder', () => {
        const visited: string[] = [];
        new Traversal('postorder').traverse(root, n => visited.push(n.id));
        expect(visited).toEqual(['leftChild', 'left', 'right', 'root']);
    });

    it('should traverse in inorder', () => {
        const visited: string[] = [];
        new Traversal('inorder').traverse(root, n => visited.push(n.id));
        expect(visited).toEqual(['leftChild', 'left', 'root', 'right']);
    });
});
