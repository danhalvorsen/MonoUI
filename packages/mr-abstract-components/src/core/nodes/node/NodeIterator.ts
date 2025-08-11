import { IIterator } from "../../../datastructures/IIterator.js";
import { INode } from "../INode.js";

export class NodeIterator implements IIterator<INode> {
    private stack: INode[] = [];
    private currentNode?: INode;

    constructor(root: INode) {
        this.stack.push(root);
    }

    next(): boolean {
        this.currentNode = this.stack.shift();
        if (this.currentNode) {
            this.stack.push(...(this.currentNode.children ?? []));
            return true;
        }
        return false;
    }

    current(): INode {
        if (!this.currentNode) throw new Error('Iterator is not at a valid node');
        return this.currentNode;
    }

    reset(): void {
        this.stack = this.currentNode ? [this.currentNode] : [];
    }

    hasNext(): boolean {
        return this.stack.length > 0;
    }
}
