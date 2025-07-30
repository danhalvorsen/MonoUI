// File: packages/pipeline-core/src/core/Pipe.ts
 
import { Result } from '@mr/design-patterns';
import { IData } from './IData';
import { IPipe } from './IPipe';

export class Pipe<TData extends IData> implements IPipe<TData, TData> {
  constructor(
    public readonly name: string,
    private handler: (data: TData) => Promise<TData>
  ) {}

  async execute(data: TData): Promise<Result<TData>> {
    const result = await this.handler(data);
    return Result.ok(result);
  }
}

