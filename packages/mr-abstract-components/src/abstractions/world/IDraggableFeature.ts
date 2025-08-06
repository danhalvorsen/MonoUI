import { INodeVisitor } from './INodeVisitor.js';
import { IRenderType } from './IRenderType.js';
import { INode } from './INode.js';
import { IObject } from '../IObject.js';

export interface IDraggableFeature extends INode {
    target: IObject;
    isDraggable?: boolean;
    onDragStart?(): void;
    onDrag?(dx: number, dy: number): void;
    onDragEnd?(): void;
    draw?(render: IRenderType): void;
    accept(visitor: INodeVisitor): void;
}