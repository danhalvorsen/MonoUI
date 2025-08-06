 
import { INodeVisitor } from "./core/sceneGraph/node/INodeVisitor.js";
import { INode } from "src/abstractions/world/INode.js";
import { IRenderType } from "src/render/rendering/IRenderType.js";

export abstract class NodeBase implements INode {
  id: string;
  name?: string;
  parent?: NodeBase;
  parentId?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  children: INode[] = [];

  constructor(id: string) {
    this.id = id;
  }

  accept(visitor: INodeVisitor): void {
    visitor.visit(this);
    this.children.forEach((child) => child.accept(visitor));
  }

  draw?(render: IRenderType): void {}
  onAdded?(): void {}
  onRemoved?(): void {}
}
