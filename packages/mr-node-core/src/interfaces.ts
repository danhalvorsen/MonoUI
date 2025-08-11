export interface INode<T> extends Iterable<INode<T>> {
  readonly id: string;
  data: T;
  readonly parent: INode<T> | null;
  readonly children: ReadonlyArray<INode<T>>;

  [Symbol.iterator](): IterableIterator<INode<T>>; // DFS by default
  accept<R = void>(visitor: NodeVisitor<T, R>): R | void;

  findById(id: string): INode<T> | undefined;
  find(predicate: (n: INode<T>) => boolean): INode<T> | undefined;
  path(): ReadonlyArray<INode<T>>;
}

export interface IMutableNode<T> extends INode<T> {
  add(...children: IMutableNode<T>[]): this;
  insertAt(index: number, child: IMutableNode<T>): this;
  remove(child: IMutableNode<T>): boolean;
  clear(): void;
}

export type VisitContext<T> = {
  readonly depth: number;
  readonly index: number;
  readonly parent: INode<T> | null;
  stop(): void;
};

export type NodeVisitor<T, R = void> = {
  enter?(node: INode<T>, ctx: VisitContext<T>): R | void;
  leave?(node: INode<T>, ctx: VisitContext<T>): R | void;
};
