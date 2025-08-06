import { IVisualNode } from "src/core/IVisualNode.js";
import { IRenderType } from "src/render/rendering/IRenderType.js";
import { INode } from "./nodes/INode.js";
import { INodeVisitor } from "./nodes/INodeVisitor.js";

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