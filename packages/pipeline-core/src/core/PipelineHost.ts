import { DependencyContainer, container } from "tsyringe";
import { IData } from "./IData";
import { IPipeline } from "./IPipeline";
import { IPipelineHost } from "./IPipelineHost";

export class PipelineHost<TData extends IData = IData> implements IPipelineHost {
    private pipelines = new Map<string, IPipeline<TData>>();
    constructor(private ioc: DependencyContainer = container) {}
  
    async start(): Promise<void> {
      let registered: IPipeline<TData>[] = [];
      try {
        registered = this.ioc.resolveAll<IPipeline<TData>>("RoutablePipelines");
      } catch {
        // No pipelines registered under the token – that's fine, we'll just start empty
      }
      for (const p of registered) this.pipelines.set(p.constructor.name, p);
    }
  
    async stop(): Promise<void> {
      this.pipelines.clear();
    }
  
    async execute(pipelineName: string, data: TData): Promise<TData> {
      const pipeline = this.pipelines.get(pipelineName);
      if (!pipeline) throw new Error(`Pipeline '${pipelineName}' not found`);
      return await pipeline.run(data);
    }
  
    getRegistered(): string[] {
      return [...this.pipelines.keys()];
    }
  }
  