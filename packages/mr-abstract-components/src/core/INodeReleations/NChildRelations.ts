import { INode } from "../nodes/INode.js";
import { INodeRelations } from "./INodeRelations.js";

export interface NChildRelations extends INodeRelations {
    leftChild?: INode;
    rightChild?: INode;
}   


