// packages/mr-cqrs/src/adapters/ResultDataAdapter.ts
import { IData } from "@mr/pipeline-core";
import { Result } from "@mr/design-patterns";  // must match QueryBus
export class ResultDataAdapter<T> implements IData {
  context: Record<string, any> = {};
  constructor(private readonly wrapped: Result<T>) {}
  toResult(): Result<T> {
    return this.wrapped;
  }
}
