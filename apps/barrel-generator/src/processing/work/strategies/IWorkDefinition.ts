 import { Result } from '@mr/design-patterns';

export interface IWorkDefinition {
    execute(context: IWorkContext): Promise<IWorkResult>;
}

export interface IWorkContext {
  packageName: string;
  packagePath?: string;
  options?: Record<string, any>;
}

export interface IWorkResult {
  success: boolean;
  message: string;
  error?: unknown;
  fileCount?: number;
  barrelPath?: string;
  toString(): string;
}

export class WorkResult implements IWorkResult {
  constructor(
    public success: boolean,
    public message: string,
    public data?: unknown,
    public error?: unknown
  ) {}
  fileCount?: number | undefined;
  barrelPath?: string | undefined;

  toString(): string {
    return JSON.stringify(this);
  }
}