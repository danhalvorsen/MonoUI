import { Node } from "mr-node-core";
import { Kinds } from "./types.js";

export abstract class RenderNode<T> extends Node<T> {
  constructor(public readonly kind: string, id: string, data: T) {
    super(id, data);
  }
}

export type GroupData = Record<string, never>;
export class GroupNode extends RenderNode<GroupData> {
  constructor(id: string) { super(Kinds.Group, id, {}); }
}

export type TransformData = {
  translate?: { x: number; y: number };
  rotate?: number; // radians
  scale?: { x: number; y: number };
};
export class TransformNode extends RenderNode<TransformData> {
  constructor(id: string, data: TransformData) { super(Kinds.Transform, id, data); }
}

export type StyleData = {
  fillStyle?: string | CanvasGradient | CanvasPattern;
  strokeStyle?: string | CanvasGradient | CanvasPattern;
  lineWidth?: number;
  globalAlpha?: number;
};
export class StyleNode extends RenderNode<StyleData> {
  constructor(id: string, data: StyleData) { super(Kinds.Style, id, data); }
}

export type RectData = { x: number; y: number; width: number; height: number; fill?: boolean; stroke?: boolean };
export class RectNode extends RenderNode<RectData> {
  constructor(id: string, data: RectData) { super(Kinds.Rect, id, data); }
}

export type CircleData = { x: number; y: number; r: number; fill?: boolean; stroke?: boolean };
export class CircleNode extends RenderNode<CircleData> {
  constructor(id: string, data: CircleData) { super(Kinds.Circle, id, data); }
}
