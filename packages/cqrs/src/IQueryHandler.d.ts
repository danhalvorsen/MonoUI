import { IQuery } from './IQuery';
import { Result } from './Result';
export interface IQueryHandler<TQuery extends IQuery<TResult>, TResult> {
    handle(query: TQuery): Promise<Result<TResult>>;
}
