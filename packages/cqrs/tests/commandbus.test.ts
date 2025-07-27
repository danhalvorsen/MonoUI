import { describe, it, expect } from 'vitest';
import { container } from 'tsyringe';
import { CommandBus, ICommand, ICommandHandler } from '../src';
import { Result } from '@packages/design-patterns';

class TestCommand implements ICommand<string> {
  getName() { return 'TestCommand'; }
  constructor(public payload: string) {}
  context: Record<string, any> = {};
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
    container.registerInstance('CommandPipeline', { 
      addStep: (s: any) => {}, 
      run: async (c: any) => c  // <-- FIXED
    });
    const bus = new CommandBus(container);
    const result = await bus.execute(new TestCommand('data'));
    expect(result.isSuccess).toBe(true);
    expect(result.value).toBe('Handled: data');
  });
});
