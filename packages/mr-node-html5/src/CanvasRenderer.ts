import { INode, visit } from "mr-node-core";
import { Kind } from "./types.js";

export type CanvasBehavior<N extends INode<any>> = {
  kind: Kind | (string & {});
  enter?(node: N, ctx: CanvasRenderingContext2D): void;
  leave?(node: N, ctx: CanvasRenderingContext2D): void;
};

export class CanvasRenderer {
  private behaviors = new Map<string, CanvasBehavior<INode<any>>>();

  register<N extends INode<any>>(b: CanvasBehavior<N>): this {
    this.behaviors.set(b.kind, b as CanvasBehavior<INode<any>>);
    return this;
  }

  render(root: INode<any>, ctx: CanvasRenderingContext2D): void {
    visit(root, {
      enter: (node : INode<any>) => {
        const kind = (node as any).kind as string | undefined;
        const b = kind ? this.behaviors.get(kind) : undefined;
        b?.enter?.(node, ctx);
      },
      leave: (node : INode<any>) => {
        const kind = (node as any).kind as string | undefined;
        const b = kind ? this.behaviors.get(kind) : undefined;
        b?.leave?.(node, ctx);
      },
    });
  }
}
