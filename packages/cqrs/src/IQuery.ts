import { IData } from '@mr/pipeline-core';
export interface IQuery<TResult = unknown> extends IData {
  getName(): string;
}
