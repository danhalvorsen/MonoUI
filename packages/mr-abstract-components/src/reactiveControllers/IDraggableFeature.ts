import { INodeVisitor } from '../world/INodeVisitor.js';
import { IRenderType } from '../world/IRenderType.js';
import { INode } from '../world/INode.js';
import { IObject } from '../core/IObject.js';

export interface IDraggableFeature extends INode {
    target: IObject;
    isDraggable?: boolean;
    onDragStart?(): void;
    onDrag?(dx: number, dy: number): void;
    onDragEnd?(): void;
    draw?(render: IRenderType): void;
    accept(visitor: INodeVisitor): void;
}