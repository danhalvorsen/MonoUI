import { DependencyContainer } from "tsyringe";
import { IData } from "./IData";
import { IPipelineHost } from "./IPipelineHost";
export declare class PipelineHost<TData extends IData = IData> implements IPipelineHost {
    private ioc;
    private pipelines;
    constructor(ioc?: DependencyContainer);
    start(): Promise<void>;
    stop(): Promise<void>;
    execute(pipelineName: string, data: TData): Promise<TData>;
    getRegistered(): string[];
}
