import { INode } from "../../core/INode.js";

 

export interface INodeVisitor {
    visit(node: INode): void;
}