import { INode } from "src/index.js";

export interface INodeVisitor {
    visit(node: INode): void;
}