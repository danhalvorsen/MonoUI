import { describe, it, expect } from 'vitest';
import { RxRpc, method } from '../src/index.js';

describe('RxRpc', () => {
  it('call/expose works', async () => {
    const rpc = new RxRpc();
    const Create = method<{ name: string }, { id: string; name: string }>('user.create');

    const unexpose = rpc.expose(Create, async ({ name }) => ({ id: '1', name }));
    const res = await rpc.call(Create, { name: 'Bob' });
    unexpose();

    expect(res).toEqual({ id: '1', name: 'Bob' });
  });

  it('times out when requested', async () => {
    const rpc = new RxRpc();
    const Slow = method<void, void>('slow');

    rpc.expose(Slow, () => new Promise<void>(() => { /* never resolves */ }));

    await expect(rpc.call(Slow, undefined, { timeoutMs: 10 })).rejects.toThrow(/timeout/i);
  });
});
