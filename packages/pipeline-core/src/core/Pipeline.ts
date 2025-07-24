import { IPipeline } from './IPipeline';
import { IPipe } from './IPipe';
import { IData } from './IData';
export class Pipeline<TData extends IData = IData> implements IPipeline<TData> { protected pipes: IPipe<TData>[] = []; addPipe(pipe: IPipe<TData>): this { this.pipes.push(pipe); return this; } async run(data: TData): Promise<TData> { let current = data; for (const pipe of this.pipes) current = await pipe.execute(current); return current; } }