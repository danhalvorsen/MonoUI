// src/core/IPipeline.ts
import { IData } from './IData';
import { IPipe } from './IPipe';

export interface IPipeline<TInput extends IData = IData, TOutput extends IData = TInput> {
  addPipe<TNextOutput extends IData>(pipe: IPipe<TOutput, TNextOutput>): IPipeline<TInput, TNextOutput>;
  run(initial: TInput): Promise<TOutput>;
}