import { DependencyContainer, container } from "tsyringe";
import { IQuery } from "./IQuery.js";
import { IQueryHandler } from "./IQueryHandler.js";
import { IPipeline } from "@mr/pipeline-core";
import { Result } from "@mr/design-patterns";

export class QueryBus {
  constructor(private readonly container: DependencyContainer = container) {}

  async execute<TQuery extends IQuery<TResult>, TResult>(
    query: TQuery
  ): Promise<Result<TResult>> {
    const name     = query.getName();
    const handlers = this.container.resolveAll<IQueryHandler<TQuery, TResult>>(
      "IQueryHandler"
    );
    const handler  = handlers.find(h => h.constructor.name.startsWith(name));

    if (!handler) return Result.fail(`No query handler registered for "${name}"`);

    // immutable pipeline ─ keeps TQuery shape
    const preprocessed = await this.container
      .resolve<IPipeline<TQuery, TQuery>>("QueryPipeline")
      .run(query);

    return handler.handle(preprocessed);
  }
}
