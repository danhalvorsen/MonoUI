
// Add the correct import or declaration for IDraggableFeature

import { IObject } from '../IObject.js';
import { IDraggableFeature } from './IDraggableFeature.js';
import { INode } from './INode.js';

import { INodeVisitor } from './INodeVisitor.js';
import { IRenderType } from './IRenderType.js';

export abstract class DraggableFeature implements IDraggableFeature {
  id!: string;
  position!: { x: number; y: number; };
  size!: { width: number; height: number; };
  isDraggable?: boolean | undefined;
  update(dt: number): void {
    throw new Error("Method not implemented.");
  }
  render(ctx: unknown): void {
    throw new Error("Method not implemented.");
  }
  name?: string | undefined;
  parentId?: string | undefined;
  tags?: string[] | undefined;
  metadata?: Record<string, any> | undefined;
  children: INode[] = [];
  onAdded?(): void {
    throw new Error("Method not implemented.");
  }
  onRemoved?(): void {
    throw new Error("Method not implemented.");
  }
  accept(visitor: INodeVisitor): void;
  accept(visitor: INodeVisitor): void;
  accept(visitor: INodeVisitor): void {
    throw new Error("Method not implemented.");
  }
  draw?(render: IRenderType): void {
    throw new Error("Method not implemented.");
  }
  abstract target: IObject;

  onDragStart?(): void { }
  onDrag?(dx: number, dy: number): void { }
  onDragEnd?(): void { }
}
