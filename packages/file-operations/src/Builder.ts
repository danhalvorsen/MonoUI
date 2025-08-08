// packages/file-operations/src/Builder.ts
export interface Builder<T> {
  build(): T;
}

export abstract class FluentBuilder<T, TSelf extends FluentBuilder<T, TSelf>>
  implements Builder<T> {
  /** For correct fluent return types in subclasses */
  protected get self(): TSelf {
    return this as unknown as TSelf;
  }

  abstract build(): T;
}
