import { describe, it, expect } from 'vitest';
import { RxMediator, request } from '../src/index.js';

describe('RxMediator', () => {
  it('send/handle request/response', async () => {
    const med = new RxMediator();
    const Get = request<{ id: string }, { id: string; name: string }>('user.get');

    const off = med.handle(Get, async ({ id }) => ({ id, name: 'Ada' }));
    const res = await med.send(Get, { id: 'u1' });
    off();

    expect(res).toEqual({ id: 'u1', name: 'Ada' });
  });
});
