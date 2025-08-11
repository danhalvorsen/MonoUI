import type { INode, INodeVisitor} from "../INode.js";

 

export abstract class NodeBase implements INode {
  id: string;
  name?: string;
  children: INode[] = [];
  // fix TS2564
  updateComplete: Promise<boolean> = Promise.resolve(true);

  protected constructor(id: string, name?: string) {
    this.id = id;
    this.name = name;
  }

  // DRY accept for all nodes
  accept(visitor: INodeVisitor): void {
    visitor.visit(this);
  }

  // helpers (optional)
  add(child: INode): this {
    this.children.push(child);
    return this;
  }
  remove(child: INode): this {
    this.children = this.children.filter((n) => n !== child);
    return this;
  }
}