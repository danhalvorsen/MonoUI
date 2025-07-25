import { describe, it, expect } from 'vitest';
import { container } from 'tsyringe';
import { CommandBus, ICommand, ICommandHandler, Result } from '../src';

class TestCommand implements ICommand<string> {
  getName() { return 'TestCommand'; }
  constructor(public payload: string) {}
}

class TestCommandHandler implements ICommandHandler<TestCommand, string> {
  async handle(command: TestCommand): Promise<Result<string>> {
    return Result.ok(`Handled: ${command.payload}`);
  }
}

describe('CommandBus', () => {
  it('should execute command and return success result', async () => {
    container.reset();
    container.register('ICommandHandler', { useClass: TestCommandHandler });
    container.registerInstance('CommandPipeline', { addStep: (s:any)=>{}, run: (c:any)=>new TestCommandHandler().handle(c) });
    const bus = new CommandBus(container);
    const result = await bus.execute(new TestCommand('data'));
    expect(result.isSuccess).toBe(true);
    expect(result.value).toBe('Handled: data');
  });
});
