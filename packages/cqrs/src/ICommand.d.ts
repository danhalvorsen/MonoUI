import { IData } from '@mr/pipeline-core';
export interface ICommand<TResult = unknown> extends IData {
    getName(): string;
}
