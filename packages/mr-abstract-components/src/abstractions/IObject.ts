import { INode } from 'src/index.js';
export interface IObject extends INode {
    id: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    isDraggable?: boolean;

  update(dt: number): void;
  render(ctx: unknown): void;
}