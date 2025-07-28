import { IData, IPipe } from "@mr/pipeline-core";
export interface IDragOperation<TContext extends IData = IData> {
  context: TContext;
  addPipe<TNextOutput extends TContext>(pipe: IPipe<TContext, TNextOutput>): IDragOperation<TNextOutput>;
  run(): Promise<TContext>;
}