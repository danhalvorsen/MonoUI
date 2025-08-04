import { INode } from './INode.js';
import { ITraversal, TraversalOrder } from './ITraveral.js';

export class Traversal implements ITraversal {
    constructor(public order: TraversalOrder = 'preorder') { }

    traverse(root: INode, visit: (node: INode) => void): void {
        switch (this.order) {
            case 'preorder':
                this.preorder(root, visit);
                break;
            case 'inorder':
                this.inorder(root, visit);
                break;
            case 'postorder':
                this.postorder(root, visit);
                break;
        }
    }

    private preorder(root: INode, visit: (node: INode) => void): void {
        const stack: INode[] = [root];
        while (stack.length > 0) {
            const node = stack.pop()!;
            visit(node);
            const children = node.children ?? [];
            for (let i = children.length - 1; i >= 0; i--) stack.push(children[i]);
        }
    }

    private inorder(root: INode, visit: (node: INode) => void): void {
        const stack: INode[] = [];
        let current: INode | undefined = root;
        while (stack.length > 0 || current) {
            while (current) {
                stack.push(current);
                current = current.children?.[0];
            }
            current = stack.pop()!;
            visit(current);
            if (current.children && current.children.length > 1) {
                current = current.children[1];
            } else {
                current = undefined;
            }
        }
    }

    private postorder(root: INode, visit: (node: INode) => void): void {
        const stack1: INode[] = [root];
        const stack2: INode[] = [];
        while (stack1.length > 0) {
            const node = stack1.pop()!;
            stack2.push(node);
            for (const child of node.children ?? []) stack1.push(child);
        }
        while (stack2.length > 0) visit(stack2.pop()!);
    }
}
