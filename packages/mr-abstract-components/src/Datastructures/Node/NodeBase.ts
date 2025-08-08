import { INode } from "../../core/INode.js";
import { INodeVisitor } from "./INodeVisitor.js";
import { IRenderType } from "../../Renders/IRenderType.js";
 
export abstract class NodeBase implements INode {
    id: string;
    name?: string;
    parentId?: string;
    tags?: string[];
    metadata?: Record<string, any>;
    children: INode[] = [];

    constructor(id: string) {
        this.id = id;
    }

    accept(visitor: INodeVisitor): void {
        visitor.visit(this);
        this.children.forEach(child => child.accept(visitor));
    }

    draw?(render: IRenderType): void {}
    onAdded?(): void {}
    onRemoved?(): void {}
}
