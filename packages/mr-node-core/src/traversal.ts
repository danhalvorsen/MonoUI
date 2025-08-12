import { INode, NodeVisitor, VisitContext } from "./interfaces.js";

/** Depth-first (pre-order) */
export function* dfs<T>(root: INode<T>): IterableIterator<INode<T>> {
  yield root;
  for (const c of root.children) yield* dfs(c);
}

/** Breadth-first */
export function* bfs<T>(root: INode<T>): IterableIterator<INode<T>> {
  const q: INode<T>[] = [root];
  while (q.length) {
    const n = q.shift()!;
    yield n;
    for (const c of n.children) q.push(c);
  }
}

/** Visitor with enter/leave + short-circuit via ctx.stop() */
export function visit<T, R = void>(
  root: INode<T>,
  visitor: NodeVisitor<T, R>
): R | void {
  let stopped = false;
  const stop = () => { stopped = true; };

  const walk = (
    node: INode<T>,
    parent: INode<T> | null,
    depth: number,
    index: number
  ): R | void => {
    if (stopped) return;

    const ctx: VisitContext<T> = { depth, index, parent, stop };
    let ret: R | void = undefined;

    if (visitor.enter) ret = visitor.enter(node, ctx);
    if (stopped) return ret;

    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i]!;
      const r = walk(child, node, depth + 1, i);
      if (typeof r !== "undefined") ret = r;
      if (stopped) break;
    }

    if (!stopped && visitor.leave) {
      const r2 = visitor.leave(node, ctx);
      if (typeof r2 !== "undefined") ret = r2;
    }
    return ret;
  };

  return walk(root, null, 0, 0);
}
