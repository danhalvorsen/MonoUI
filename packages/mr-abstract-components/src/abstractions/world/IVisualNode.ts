import {INode, IVisualObject, IRenderType } from "src/index.js";

/** A scene graph node that is renderable */
export interface IVisualNode extends INode, IVisualObject {
    /** Draw method (required for visual nodes) */
    draw(render: IRenderType): void;
}

