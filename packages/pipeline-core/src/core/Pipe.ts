import { IPipe } from './IPipe';
import { IData } from './IData';
export class Pipe<TData extends IData> implements IPipe<TData> { constructor(public readonly name: string, private handler: (data: TData) => Promise<TData>) {} async execute(data: TData): Promise<TData> { return this.handler(data); } }