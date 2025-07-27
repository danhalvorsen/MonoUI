import { IData } from './IData';
export interface IPipe<TInput extends IData, TOutput extends IData> {
    name: string;
    execute(input: TInput): Promise<Result<TOutput>>;
}
