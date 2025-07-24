import { IData } from './IData';
export interface IPipe<TData extends IData = IData> { name: string; execute(data: TData): Promise<TData>; }