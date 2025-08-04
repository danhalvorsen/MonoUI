import { describe, it, expect } from 'vitest';
import { NodeBase, WorldBase, INodeVisitor } from '../../src';

class TestNode extends NodeBase {
    draw() {}
}

describe('Visitor Pattern', () => {
    it('should visit all nodes in depth-first order', () => {
        const root = new TestNode('root');
        const child1 = new TestNode('child1');
        const child2 = new TestNode('child2');
        const grandchild = new TestNode('grandchild');
        child1.children = [grandchild];
        root.children = [child1, child2];

        const visited: string[] = [];
        const visitor: INodeVisitor = {
            visit(node) {
                visited.push(node.id);
            },
        };

        root.accept(visitor);

        expect(visited).toEqual(['root', 'child1', 'grandchild', 'child2']);
    });

    it('should work on WorldBase with children', () => {
        const world = new WorldBase('world');
        const child1 = new TestNode('child1');
        const child2 = new TestNode('child2');
        world.children = [child1, child2];

        const visited: string[] = [];
        world.accept({
            visit(node) {
                visited.push(node.id);
            },
        });

        expect(visited).toEqual(['world', 'child1', 'child2']);
    });

    it('should allow custom visitor logic (count nodes)', () => {
        const root = new TestNode('root');
        root.children = [new TestNode('a'), new TestNode('b')];

        let count = 0;
        const countingVisitor: INodeVisitor = {
            visit() {
                count++;
            },
        };

        root.accept(countingVisitor);

        expect(count).toBe(3); // root + 2 children
    });
});
