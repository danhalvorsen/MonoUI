import { DependencyContainer, container } from "tsyringe";
import { ICommand } from "./ICommand.js";
import { ICommandHandler } from "./ICommandHandler.js";
import { IPipeline } from "@mr/pipeline-core";
import { Result } from "@mr/design-patterns";

export class CommandBus {
  constructor(private readonly container: DependencyContainer = container) {}

  async execute<TCommand extends ICommand<TResult>, TResult>(
    command: TCommand
  ): Promise<Result<TResult>> {
    const name     = command.getName();
    const handlers = this.container.resolveAll<ICommandHandler<TCommand, TResult>>(
      "ICommandHandler"
    );
    const handler  = handlers.find(h => h.constructor.name.startsWith(name));

    if (!handler) return Result.fail(`No command handler registered for "${name}"`);

    // immutable pipeline ─ does not change the payload type
    const preprocessed = await this.container
      .resolve<IPipeline<TCommand, TCommand>>("CommandPipeline")
      .run(command);

    // handler returns the domain Result
    return handler.handle(preprocessed);
  }
}
