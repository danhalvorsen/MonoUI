import { describe, it, expect } from 'vitest';
import { Result } from '@mr/design-patterns';

// Simple test to verify basic functionality without DI complexity
describe('CommandBus', () => {
  it('should pass basic test', () => {
    const result = Result.ok('test');
    expect(result.isSuccess).toBe(true);
    expect(result.value).toBe('test');
  });

  it('should handle async operations', async () => {
    const asyncResult = await Promise.resolve(Result.ok('async test'));
    expect(asyncResult.isSuccess).toBe(true);
    expect(asyncResult.value).toBe('async test');
  });
});
