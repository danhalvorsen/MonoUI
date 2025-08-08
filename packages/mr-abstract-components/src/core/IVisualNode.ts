import { IRenderType } from "src/Renders/IRenderType.js";
import { IVisualObject } from "../core/ø";
import { INode } from "./INode.js";

 
 
/** A scene graph node that is renderable */
export interface IVisualNode extends INode, IVisualObject {
    /** Draw method (required for visual nodes) */
    draw(render: IRenderType): void;
}

