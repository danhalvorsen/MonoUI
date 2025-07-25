import { IData } from "./IData";
export interface IPipelineHost<TData extends IData = IData> {
    start(): Promise<void>;
    stop(): Promise<void>;
    execute(pipelineName: string, data: TData): Promise<TData>;
    getRegistered(): string[];
}
