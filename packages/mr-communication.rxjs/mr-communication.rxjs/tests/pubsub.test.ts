import { describe, it, expect } from 'vitest';
import { RxPubSub, topic } from '../src/index.js';

describe('RxPubSub', () => {
  it('publish/subscribe delivers payload', async () => {
    const bus = new RxPubSub();
    const T = topic<{ v: number }>('test.topic');
    let seen = 0;

    const off = bus.subscribe(T, (p) => { seen = p.v; });
    bus.publish(T, { v: 42 });
    off();

    expect(seen).toBe(42);
  });
});
