import { INode } from "src/abstractions/world/INode.js";
import { IVisualObject } from "./IVisualObject.js";
import { IRenderType } from "src/render/rendering/IRenderType.js";

/** A scene graph node that is renderable */
export interface IVisualNode extends INode, IVisualObject {
    /** Draw method (required for visual nodes) */
    draw(render: IRenderType): void;
}

