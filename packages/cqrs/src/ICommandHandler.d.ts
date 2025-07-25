import { ICommand } from './ICommand';
import { Result } from './Result';
export interface ICommandHandler<TCommand extends ICommand<TResult>, TResult> {
    handle(command: TCommand): Promise<Result<TResult>>;
}
