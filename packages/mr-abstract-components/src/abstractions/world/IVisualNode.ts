import {INode} from "./INode.js";
import {IVisualObject } from "../IVisualObject.js";
import {IRenderType } from "./IRenderType.js";  


/** A scene graph node that is renderable */
export interface IVisualNode extends INode, IVisualObject {
    /** Draw method (required for visual nodes) */
    draw(render: IRenderType): void;
}

