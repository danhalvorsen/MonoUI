// core/nodes/node/RenderVisitor.ts
import type { IRenderContext } from "../../IRenderContext.js";
import type { INode } from "../INode.js";
import type { IVisualNode } from "../IVisualNode.js";
import type { INodeVisitor } from "./INodeVisitor.js";

function isVisualNode(node: INode): node is IVisualNode {
  return typeof (node as any).draw === "function";
}

export class RenderVisitor implements INodeVisitor {
  constructor(private readonly render: IRenderContext) {
    if (!render) throw new Error("Render context is required");
  }

visit(node: RenderVisitor): INode {
    throw new Error("Method not implemented."); 
  }
}
