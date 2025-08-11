import { INode } from "../nodes/INode.js";
import { INodeRelations } from "./INodeRelations.js";

export interface IBinaryNodeRelations extends INodeRelations {
    leftChild?: INode;
    rightChild?: INode;
}
