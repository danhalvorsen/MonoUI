import { Result } from '@mr/design-patterns';
import { IQuery } from './IQuery.js';
 
export interface IQueryHandler<TQuery extends IQuery<TResult>, TResult> {
  handle(query: TQuery): Promise<Result<TResult>>;
}
