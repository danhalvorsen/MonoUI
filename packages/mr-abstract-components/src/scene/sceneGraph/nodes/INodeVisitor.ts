import { INode } from "./INode.js";

export interface INodeVisitor {
    visit(node: INode): void;
}