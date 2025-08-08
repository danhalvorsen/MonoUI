import { INode } from "../../core/INode.js";
import { IVisualNode } from "../../core/IVisualNode.js";
import { IRenderType } from "../../Renders/IRenderType.js";
import { INodeVisitor } from "./INodeVisitor.js"; 

function isVisualNode(node: INode): node is IVisualNode {
    return typeof (node as IVisualNode).draw === "function";
}

export class RenderVisitor implements INodeVisitor {
    constructor(private render: IRenderType) {}

    visit(node: INode): void {
        if (isVisualNode(node)) {
            node.draw(this.render);
        }
        node.children?.forEach(child => child.accept(this));
    }
}