import { IData } from './IData';
import { IPipe } from './IPipe';

export interface IPipeline<TData extends IData = IData> { addPipe(pipe: IPipe<TData>): this; run(data: TData): Promise<TData>; }