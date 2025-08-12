import { describe, it, expect } from 'vitest';
import { RxRemoteStreams, stream } from '../src/index.js';

describe('RxRemoteStreams', () => {
  it('observe/next emits values', async () => {
    const streams = new RxRemoteStreams();
    const S = stream<number>('nums');

    let sum = 0;
    const sub = streams.observe(S).subscribe(v => { sum += v; });
    streams.next(S, 2);
    streams.next(S, 3);
    sub.unsubscribe();

    expect(sum).toBe(5);
  });
});
