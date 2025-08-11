import { INode } from "../nodes/INode.js";


export interface INodeRelations {
    parent?: INode;
    children?: Set<INode>;
}
