import { describe, it, expect } from 'vitest';
import { topic, request, method, stream } from '../src/index.js';

describe('core API shapes', () => {
  it('creates branded keys without throwing', () => {
    const T = topic<{ a: number }>('t');
    const R = request<{ q: string }, { ok: boolean }>('r');
    const M = method<{ x: number }, { y: number }>('m');
    const S = stream<number>('s');
    expect(T.key && R.key && M.key && S.key).toBeTruthy();
  });
});
