import { IPipe } from "@mr/pipeline-core";
import { IDragOperation } from "../contracts/IDragOperation.js";
import { IData } from "@mr/pipeline-core";
export class DragOperation<TContext extends IData = IData> implements IDragOperation<TContext> {
  context: TContext;
  private pipes: IPipe<any, any>[] = [];
  constructor(initialContext: TContext) { this.context = initialContext; }
  addPipe<TNextOutput extends TContext>(pipe: IPipe<TContext, TNextOutput>): DragOperation<TNextOutput> {
    this.pipes.push(pipe);
    return this as unknown as DragOperation<TNextOutput>;
  }
  async run(): Promise<TContext> {
    let result = this.context;
    for (const pipe of this.pipes) {
      const execution = await pipe.execute(result);
      if (!execution.isSuccess) break;
      result = execution.value;
    }
    this.context = result;
    return this.context;
  }
}