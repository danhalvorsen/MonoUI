import { IData } from "./IData";
import { IPipe } from "./IPipe";
import { IPipeline } from "./IPipeline";

export class Pipeline<TInput extends IData = IData, TOutput extends IData = TInput>
  implements IPipeline<TInput, TOutput> {

  private steps: ((data: any) => Promise<any>)[] = [];

  addPipe<TNextOutput extends IData>(
    pipe: IPipe<TOutput, TNextOutput>
  ): Pipeline<TInput, TNextOutput> {
    this.steps.push(async (d: TOutput) => {
      const result = await pipe.execute(d);
      if (!result.isSuccess) {
        throw new Error(result.errors?.join(', ') || 'Pipeline execution failed');
      }
      return result.value!;
    });
    return this as unknown as Pipeline<TInput, TNextOutput>;
  }

  async run(initial: TInput): Promise<TOutput> {
    let result: any = initial;
    for (const step of this.steps) {
      result = await step(result);
    }
    return result as TOutput;
  }
}

