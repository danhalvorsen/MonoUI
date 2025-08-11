 
import { ICamera } from '../sceneGraph/ICamera.js';
import { IScreen } from '../sceneGraph/IScreen.js';
import { INode } from "../../core/nodes/INode.js"
import { INodeVisitor } from "../../core/nodes/INode.js";

export interface IWorld extends INode {
    cameras: ICamera[];
    screens: IScreen[];

    findNodeById(id: string): INode | undefined;
    accept(visitor: INodeVisitor): void;
}
