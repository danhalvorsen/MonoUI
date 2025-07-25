import { DependencyContainer } from "tsyringe";
import { IQuery } from "./IQuery";
 import { Result } from "@mr/design-patterns";
export declare class QueryBus {
    private readonly container;
    constructor(container?: DependencyContainer);
    execute<TQuery extends IQuery<TResult>, TResult>(query: TQuery): Promise<Result<TResult>>;
}
