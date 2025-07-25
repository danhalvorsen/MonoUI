import { ICommand } from './ICommand';
import { Result } from "@mr/design-patterns";

export interface ICommandHandler<TCommand extends ICommand<TResult>, TResult> {
  handle(command: TCommand): Promise<Result<TResult>>;
}
