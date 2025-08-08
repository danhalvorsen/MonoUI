// packages/mr-abstract-components/src/abstractions/world/ITraversal.ts
import { INode } from '../../core/INode.js';

export type TraversalOrder = 'preorder' | 'inorder' | 'postorder';

export interface ITraversal {
    /** Traversal order type */
    order: TraversalOrder;

    /** Traverse nodes starting from root */
    traverse(root: INode, visit: (node: INode) => void): void;
}
// packages/mr-abstract-components/src/abstractions/world/Traversal.ts

