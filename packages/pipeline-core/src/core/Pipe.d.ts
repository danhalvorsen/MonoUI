import { IPipe } from './IPipe';
import { IData } from './IData';
export declare class Pipe<TData extends IData> implements IPipe<TData> {
    readonly name: string;
    private handler;
    constructor(name: string, handler: (data: TData) => Promise<TData>);
    execute(data: TData): Promise<TData>;
}
