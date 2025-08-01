import { IData } from './IData';
import { Result } from '@mr/design-patterns';

export interface IPipe<TInput extends IData, TOutput extends IData> {
  name: string;
  execute(input: TInput): Promise<Result<TOutput>>;
}
