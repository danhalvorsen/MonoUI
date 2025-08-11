import { IMutableNode, INode } from "./interfaces.js";
import { dfs, visit } from "./traversal.js";

export class Node<T> implements IMutableNode<T> {
  public data: T;
  private _parent: Node<T> | null = null;
  private _children: Node<T>[] = [];

  constructor(public readonly id: string, data: T) {
    this.data = data;
  }

  get parent(): Node<T> | null { return this._parent; }
  get children(): ReadonlyArray<Node<T>> { return this._children; }

  add(...children: Node<T>[]): this {
    for (const c of children) this.attach(c, this._children.length);
    return this;
  }

  insertAt(index: number, child: Node<T>): this {
    this.attach(child, Math.max(0, Math.min(index, this._children.length)));
    return this;
  }

  remove(child: Node<T>): boolean {
    const i = this._children.indexOf(child);
    if (i < 0) return false;
    this._children.splice(i, 1);
    child._parent = null;
    return true;
  }

  clear(): void {
    for (const c of this._children) c._parent = null;
    this._children.length = 0;
  }

  *[Symbol.iterator](): IterableIterator<INode<T>> { yield* dfs(this); }

  accept<R = void>(v: Parameters<typeof visit<T>>[1]): R | void {
    return visit(this, v as any) as R | void;
  }

  findById(id: string): INode<T> | undefined {
    for (const n of this) if ((n as Node<T>).id === id) return n;
    return undefined;
  }

  find(predicate: (n: INode<T>) => boolean): INode<T> | undefined {
    for (const n of this) if (predicate(n)) return n;
    return undefined;
  }

  path(): ReadonlyArray<INode<T>> {
    const out: INode<T>[] = [];
    let cur: Node<T> | null = this;
    while (cur) { out.push(cur); cur = cur._parent; }
    return out.reverse();
  }

  private attach(child: Node<T>, index: number) {
    if (child === this) throw new Error("A node cannot be its own child.");
    if (child._parent) child._parent.remove(child);
    child._parent = this;
    this._children.splice(index, 0, child);
    if (hasCycle(this)) {
      this._children.splice(index, 1);
      child._parent = null;
      throw new Error("Cycle detected.");
    }
  }
}

function hasCycle<T>(node: Node<T>): boolean {
  let p: Node<T> | null = node._parent;
  while (p) { if (p === node) return true; p = p._parent; }
  return false;
}
