// packages/mr-event-base/tests/_support/waitFor.ts
import type { IObservable } from "../../src/core/EventSystemTypes.js";

export class WaitTimeoutError extends Error {
  constructor(ms: number) { super(`waitFor timeout after ${ms}ms`); }
}

export function waitFor<T>(
  src: IObservable<T>,
  predicate: (v: T) => boolean,
  timeoutMs = 1000
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let done = false;
    const sub = src.subscribe(value => {
      if (done) return;
      if (predicate(value)) {
        done = true;
        clearTimeout(timer);
        sub.unsubscribe();
        resolve(value);
      }
    });
    const timer = setTimeout(() => {
      if (done) return;
      done = true;
      sub.unsubscribe();
      reject(new WaitTimeoutError(timeoutMs));
    }, timeoutMs);
  });
}
