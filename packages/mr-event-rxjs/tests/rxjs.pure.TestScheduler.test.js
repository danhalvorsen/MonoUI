import { describe, it, expect } from "vitest";
import { TestScheduler } from "rxjs/testing";
import { debounceTime, map } from "rxjs/operators";
describe("RxJS TestScheduler (pure RxJS)", () => {
  it("debounceTime deterministically with virtual time", () => {
    const ts = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    ts.run(({ cold, expectObservable, scheduler }) => {
      const input = cold<string>("-a--b----c---|");
      const out = input.pipe(
        map(x => ({ x })),
        debounceTime(5, scheduler)
      );

      // c is flushed on completion at the same frame => "(c|)"
      expectObservable(out).toBe("------------- (c|)", {
        c: { x: "c" }
      });
    });
  });
});
