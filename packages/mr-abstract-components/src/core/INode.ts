import { INodeVisitor } from "../Datastructures/Node/INodeVisitor.js";
import { IRenderType } from "../Renders/IRenderType.js";


export interface INode {
    /** Unique ID */
    id: string;
    name?: string;
    parentId?: string;
    tags?: string[];
    metadata?: Record<string, any>;
 children?: INode[];
    onAdded?(): void;
    onRemoved?(): void;
    accept(visitor: INodeVisitor): void;
    /** Children (hierarchy support) */
   
    /** Draw method (optional, for visual nodes) */
    draw?(render: IRenderType): void;

    /** Accept a visitor */
    accept(visitor: INodeVisitor): void;
}
