import { IPipe } from './IPipe';
import { IData } from './IData';
import { IPipeline } from './IPipeline';
export declare class Pipeline<TInput extends IData = IData, TOutput extends IData = TInput> implements IPipeline<TInput, TOutput> {
    private steps;
    addPipe<TNextOutput extends IData>(pipe: IPipe<TOutput, TNextOutput>): Pipeline<TInput, TNextOutput>;
    run(initial: TInput): Promise<TOutput>;
}
