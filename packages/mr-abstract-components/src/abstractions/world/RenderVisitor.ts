import { INode, INodeVisitor, IRenderType, IVisualNode } from "src/index.js";

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