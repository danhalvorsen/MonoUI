export interface INode {
  id: string;
  name?: string;
  children: INode[];
  accept(visitor: INodeVisitor): void;
}

export interface INodeVisitor {
  visit(node: INode): void;
}