import { DependencyContainer } from "tsyringe";
import { ICommand } from "./ICommand";
import { Result } from "@mr/design-patterns";
 
export declare class CommandBus {
    private readonly container;
    constructor(container?: DependencyContainer);
    execute<TCommand extends ICommand<TResult>, TResult>(command: TCommand): Promise<Result<TResult>>;
}
